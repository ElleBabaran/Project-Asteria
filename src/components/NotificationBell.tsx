"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, AlertTriangle, CheckCircle, XCircle, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function getNotifIcon(type: string) {
  switch (type) {
    case "REPORT":
      return <AlertTriangle size={14} className="text-rose-500 shrink-0" />;
    case "APPROVAL":
      return <CheckCircle size={14} className="text-leaf shrink-0" />;
    case "REJECTION":
      return <XCircle size={14} className="text-rose-500 shrink-0" />;
    case "VOLUNTEER_APPROVED":
      return <Award size={14} className="text-butter shrink-0" />;
    case "VOLUNTEER_REJECTED":
      return <XCircle size={14} className="text-rose-400 shrink-0" />;
    default:
      return <Bell size={14} className="text-sage shrink-0" />;
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch (e) {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((prev) => !prev);
    // Mark all as read when opening
    if (!open && unreadCount > 0) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-card text-sage-dark transition-all hover:bg-sage-dark/8"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-card border border-sage-dark/12 bg-paper shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sage-dark/10 px-4 py-3">
            <span className="font-display text-sm font-semibold text-sage-dark">Notifications</span>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={async () => {
                  await fetch("/api/notifications", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                  });
                  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                  setUnreadCount(0);
                }}
                className="flex items-center gap-1 text-[10px] font-semibold text-sage hover:text-sage-dark transition-colors"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-sage-dark/5">
            {loading && notifications.length === 0 ? (
              <div className="py-10 text-center text-xs text-ink/40">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Bell size={28} className="text-sage-dark/20" />
                <p className="text-xs text-ink/40">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    notif.isRead ? "bg-paper" : "bg-sage-dark/3"
                  }`}
                >
                  <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${notif.isRead ? "text-ink/65" : "text-ink font-medium"}`}>
                      {notif.message}
                    </p>
                    <span className="mt-1 block text-[10px] font-mono text-ink/35">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-sage-dark/10 px-4 py-2.5 text-center">
              <span className="text-[10px] text-ink/35 font-mono">
                Showing last {notifications.length} notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
