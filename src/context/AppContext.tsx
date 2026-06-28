"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Comment {
  id: string;
  user: string;
  role: "student" | "volunteer" | "admin" | "guest";
  text: string;
  date: string;
  rating?: number;
}

export interface Resource {
  id: string;
  title: string;
  country: string;
  curriculum: string;
  grade: string;
  subject: string;
  topic: string;
  description: string;
  fileType: "PDF" | "PPT" | "DOC" | "Image" | "Worksheet";
  uploadDate: string;
  contributorName: string;
  downloadsCount: number;
  likes: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  fileSize: string;
  fileUrl?: string;
  comments: Comment[];
  serialNumber?: number;
}

export interface BrokenLinkReport {
  id: string;
  resourceId: string;
  resourceTitle: string;
  userEmail: string;
  description: string;
  date: string;
  status: "open" | "resolved";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "volunteer" | "admin" | "guest";
  adminRole?: "general" | "tech" | "staff";
  image?: string;
  bio?: string;
}

export interface PartnerRequest {
  id: string;
  orgName: string;
  contactName: string;
  email: string;
  type: string;
  details: string;
  date: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  userEmail: string;
  date: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success";
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  background: string;
  subject: string;
  message: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  rejectionNote?: string;
}

interface AppContextType {
  user: User | null;
  login: (id: string, name: string, email: string, role: "student" | "volunteer" | "admin", adminRole?: "general" | "tech" | "staff") => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  resources: Resource[];
  heroResourceIds: string[];
  addResource: (resource: Omit<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments"> & Partial<Pick<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments">>) => void;
  updateHeroResourceIds: (ids: string[]) => void;
  updateResourceStatus: (id: string, status: "approved" | "pending" | "rejected", reason?: string) => void;
  editResource: (id: string, updatedFields: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  savedResources: string[]; // Resource IDs
  toggleFavorite: (id: string) => void;
  downloadHistory: { resourceId: string; timestamp: string }[];
  recordDownload: (id: string) => void;
  recentlyViewed: string[]; // Resource IDs
  recordView: (id: string) => void;
  addComment: (resourceId: string, text: string, rating?: number) => void;
  brokenReports: BrokenLinkReport[];
  reportBrokenLink: (resourceId: string, description: string) => void;
  resolveReport: (reportId: string) => void;
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, type: "info" | "warning" | "success") => void;
  deleteAnnouncement: (id: string) => void;
  categories: {
    countries: string[];
    curricula: { [key: string]: string[] };
    grades: string[];
    subjects: string[];
  };
  addCategory: (type: "country" | "curriculum" | "grade" | "subject", value: string, countryKey?: string) => void;
  analytics: {
    visitorsCount: number;
    activeStudents: number;
    activeVolunteers: number;
  };
  volunteerApplications: VolunteerApplication[];
  submitVolunteerApplication: (app: Omit<VolunteerApplication, "id" | "date" | "status">) => void;
  approveVolunteerApplication: (id: string) => void;
  rejectVolunteerApplication: (id: string, note: string) => void;
  partnerRequests: PartnerRequest[];
  submitPartnerRequest: (req: Omit<PartnerRequest, "id" | "date" | "status">) => void;
  updatePartnerRequestStatus: (id: string, status: PartnerRequest["status"]) => void;
  supportTickets: SupportTicket[];
}

// All resources now come from database API - no hardcoded resources
const initialResources: Resource[] = [];

const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to Project Astera Library!",
    content: "Our volunteer catalog now spans 6 continents. Explore the tabs to view resources curated directly for your school curriculum.",
    date: "2026-06-01",
    type: "success"
  },
  {
    id: "ann-2",
    title: "Call for Math Volunteers",
    content: "We are currently short on high school mathematics worksheets for Canada and Australia. If you have quality materials, please upload them!",
    date: "2026-06-10",
    type: "info"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [heroResourceIds, setHeroResourceIds] = useState<string[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<{ resourceId: string; timestamp: string }[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [brokenReports, setBrokenReports] = useState<BrokenLinkReport[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [categories, setCategories] = useState<{
    countries: string[];
    curricula: { [key: string]: string[] };
    grades: string[];
    subjects: string[];
  }>({
    countries: [
      "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia",
      "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia",
      "Bosnia and Herzegovina", "Botswana", "Brazil", "Bulgaria", "Cambodia", "Cameroon",
      "Canada", "Chile", "China", "Colombia", "Congo", "Costa Rica", "Croatia", "Cuba",
      "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
      "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece",
      "Guatemala", "Honduras", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland",
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
      "Kyrgyzstan", "Latvia", "Lebanon", "Libya", "Lithuania", "Malaysia", "Mexico",
      "Moldova", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Nepal", "Netherlands",
      "New Zealand", "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan",
      "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
      "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia",
      "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea",
      "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
      "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan",
      "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
      "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ],
    curricula: {},
    grades: [
      "Kindergarten",
      "Elementary",
      "Junior High School",
      "Senior High School",
      "Undergraduate",
      "Master's Degree",
      "Doctorate / PhD",
    ],
    subjects: [
      "Accounting", "Agriculture", "Architecture", "Art", "Biology",
      "Business Studies", "Chemistry", "Computer Science", "Criminology",
      "Economics", "Education", "Engineering", "English", "English Literature",
      "Environmental Science", "Filipino", "Finance", "Geography", "Health",
      "History", "Home Economics", "Law", "Mathematics", "Music",
      "Nursing", "Philosophy", "Physical Education", "Physics",
      "Political Science", "Psychology", "Religion", "Science",
      "Social Studies", "Sociology", "Statistics", "Technology",
      "Others"
    ]
  });

  // Mock site analytics
  const [analytics, setAnalytics] = useState({
    visitorsCount: 1542,
    activeStudents: 91400,
    activeVolunteers: 640
  });

  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);

  // Sample support tickets for Tech Admin demo
  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: "ticket-1",
      subject: "Cannot download PDF files on mobile",
      description: "When I tap the download button on my phone, nothing happens. The file doesn't open or save.",
      userEmail: "mia.r@student.org",
      date: "2026-06-20",
      status: "open",
      priority: "high"
    },
    {
      id: "ticket-2",
      subject: "Search filter not working for 'Chemistry'",
      description: "Using the subject filter for Chemistry returns no results even though there are chemistry materials listed.",
      userEmail: "james.t@school.edu",
      date: "2026-06-19",
      status: "in_progress",
      priority: "medium"
    },
    {
      id: "ticket-3",
      subject: "Account registration email not received",
      description: "Registered 2 days ago with my school email but haven't received the confirmation. Tried resending.",
      userEmail: "lena.s@gmail.com",
      date: "2026-06-18",
      status: "resolved",
      priority: "low"
    }
  ]);

  // Load from localStorage on client side mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("astera_user");
    const cachedSaved = localStorage.getItem("astera_saved");
    const cachedHistory = localStorage.getItem("astera_history");
    const cachedRecent = localStorage.getItem("astera_recent");
    const cachedReports = localStorage.getItem("astera_reports");
    const cachedAnnouncements = localStorage.getItem("astera_announcements");
    const cachedCategories = localStorage.getItem("astera_categories");
    const cachedPartnerReqs = localStorage.getItem("astera_partner_requests");
    const cachedHeroResources = localStorage.getItem("astera_hero_resources");

    if (cachedUser) setUser(JSON.parse(cachedUser));
    if (cachedSaved) setSavedResources(JSON.parse(cachedSaved));
    if (cachedHistory) setDownloadHistory(JSON.parse(cachedHistory));
    if (cachedRecent) setRecentlyViewed(JSON.parse(cachedRecent));
    if (cachedReports) setBrokenReports(JSON.parse(cachedReports));
    if (cachedAnnouncements) setAnnouncements(JSON.parse(cachedAnnouncements));
    if (cachedCategories) setCategories(JSON.parse(cachedCategories));
    if (cachedHeroResources) setHeroResourceIds(JSON.parse(cachedHeroResources));
    const cachedVolApps = localStorage.getItem("astera_vol_applications");
    if (cachedVolApps) setVolunteerApplications(JSON.parse(cachedVolApps));
    if (cachedPartnerReqs) setPartnerRequests(JSON.parse(cachedPartnerReqs));

    // Fetch resources from API - ONLY database resources, no hardcoded fallback
    const fetchResources = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch("/api/resources", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        if (data.resources && Array.isArray(data.resources)) {
          // Use only actual database resources
          setResources(data.resources);
          saveToLocal("astera_resources", data.resources);
        } else {
          // If API returns no resources, show empty (no fallback)
          setResources([]);
        }
      } catch (error) {
        console.warn("Failed to fetch resources from API", error);
        // On error, show empty - user can still see other parts of app
        setResources([]);
      }
    };

    fetchResources();

    // Simulate ticking visitors count for live feel
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        visitorsCount: prev.visitorsCount + Math.floor(Math.random() * 3) + 1
      }));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const saveToLocal = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const login = (id: string, name: string, email: string, role: "student" | "volunteer" | "admin", adminRole?: "general" | "tech" | "staff") => {
    const newUser: User = { id, name, email, role, adminRole };
    setUser(newUser);
    saveToLocal("astera_user", newUser);

    // Increase user counts in analytics on login
    if (role === "student") {
      setAnalytics(prev => ({ ...prev, activeStudents: prev.activeStudents + 1 }));
    } else if (role === "volunteer") {
      setAnalytics(prev => ({ ...prev, activeVolunteers: prev.activeVolunteers + 1 }));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("astera_user");
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updates };
    setUser(nextUser);
    saveToLocal("astera_user", nextUser);
  };

  const addResource = (res: Omit<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments"> & Partial<Pick<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments">>) => {
    const newRes: Resource = {
      ...res,
      id: res.id ?? `res-${Date.now()}`,
      uploadDate: res.uploadDate ?? new Date().toISOString().split("T")[0],
      downloadsCount: res.downloadsCount ?? 0,
      likes: res.likes ?? 0,
      status: res.status ?? (user?.role === "admin" ? "approved" : "pending"),
      comments: res.comments ?? []
    };

    const newResList = [newRes, ...resources];
    setResources(newResList);
    saveToLocal("astera_resources", newResList);
  };

  const updateHeroResourceIds = (ids: string[]) => {
    const nextIds = [ids[0] ?? "", ids[1] ?? "", ids[2] ?? ""];
    setHeroResourceIds(nextIds);
    saveToLocal("astera_hero_resources", nextIds);
  };

  const updateResourceStatus = (id: string, status: "approved" | "pending" | "rejected", reason?: string) => {
    const updated = resources.map(res => {
      if (res.id === id) {
        return { ...res, status, rejectionReason: reason };
      }
      return res;
    });
    setResources(updated);
    saveToLocal("astera_resources", updated);
  };

  const editResource = (id: string, updatedFields: Partial<Resource>) => {
    const updated = resources.map(res => {
      if (res.id === id) {
        return { ...res, ...updatedFields, status: user?.role === "admin" ? res.status : "pending" }; // goes back to pending if volunteer edits it
      }
      return res;
    });
    setResources(updated);
    saveToLocal("astera_resources", updated);
  };

  const deleteResource = (id: string) => {
    const filtered = resources.filter(res => res.id !== id);
    setResources(filtered);
    saveToLocal("astera_resources", filtered);
  };

  const toggleFavorite = useCallback((id: string) => {
    setSavedResources(prev => {
      let nextSaved = [...prev];
      if (nextSaved.includes(id)) {
        nextSaved = nextSaved.filter(favId => favId !== id);
      } else {
        nextSaved.push(id);
      }
      saveToLocal("astera_saved", nextSaved);
      return nextSaved;
    });
  }, []);

  const recordDownload = useCallback((id: string) => {
    // Increment download count
    setResources(prevResources => {
      const updated = prevResources.map(res => {
        if (res.id === id) {
          return { ...res, downloadsCount: res.downloadsCount + 1 };
        }
        return res;
      });
      saveToLocal("astera_resources", updated);
      return updated;
    });

    // Record history
    setDownloadHistory(prevHistory => {
      const historyItem = { resourceId: id, timestamp: new Date().toISOString() };
      const nextHistory = [historyItem, ...prevHistory.filter(h => h.resourceId !== id)].slice(0, 50); // limit 50
      saveToLocal("astera_history", nextHistory);
      return nextHistory;
    });
  }, []);

  const recordView = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const nextRecent = [id, ...prev.filter(viewedId => viewedId !== id)].slice(0, 10); // limit 10
      saveToLocal("astera_recent", nextRecent);
      return nextRecent;
    });
  }, []);

  const addComment = (resourceId: string, text: string, rating?: number) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: user ? user.name : "Anonymous Student",
      role: user ? user.role : "student",
      text,
      date: new Date().toISOString().split("T")[0],
      rating
    };

    const updated = resources.map(res => {
      if (res.id === resourceId) {
        // compute optional likes bump for ratings of 4 or 5
        let likesBump = 0;
        if (rating && rating >= 4) likesBump = 1;
        return {
          ...res,
          likes: res.likes + likesBump,
          comments: [...res.comments, newComment]
        };
      }
      return res;
    });
    setResources(updated);
    saveToLocal("astera_resources", updated);
  };

  const reportBrokenLink = (resourceId: string, description: string) => {
    const targetRes = resources.find(r => r.id === resourceId);
    const newReport: BrokenLinkReport = {
      id: `rep-${Date.now()}`,
      resourceId,
      resourceTitle: targetRes ? targetRes.title : "Unknown Resource",
      userEmail: user ? user.email : "anonymous@astera.org",
      description,
      date: new Date().toISOString().split("T")[0],
      status: "open"
    };
    const nextReports = [newReport, ...brokenReports];
    setBrokenReports(nextReports);
    saveToLocal("astera_reports", nextReports);
  };

  const resolveReport = (reportId: string) => {
    const updated = brokenReports.map(rep => {
      if (rep.id === reportId) return { ...rep, status: "resolved" as const };
      return rep;
    });
    setBrokenReports(updated);
    saveToLocal("astera_reports", updated);
  };

  const addAnnouncement = (title: string, content: string, type: "info" | "warning" | "success") => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      type
    };
    const nextAnn = [newAnn, ...announcements];
    setAnnouncements(nextAnn);
    saveToLocal("astera_announcements", nextAnn);
  };

  const deleteAnnouncement = (id: string) => {
    const filtered = announcements.filter(a => a.id !== id);
    setAnnouncements(filtered);
    saveToLocal("astera_announcements", filtered);
  };

  const addCategory = (type: "country" | "curriculum" | "grade" | "subject", value: string, countryKey?: string) => {
    const nextCats = { ...categories };
    if (type === "country") {
      if (!nextCats.countries.includes(value)) {
        nextCats.countries.push(value);
        nextCats.curricula[value] = [];
      }
    } else if (type === "curriculum" && countryKey) {
      if (nextCats.curricula[countryKey] && !nextCats.curricula[countryKey].includes(value)) {
        nextCats.curricula[countryKey].push(value);
      }
    } else if (type === "grade") {
      if (!nextCats.grades.includes(value)) nextCats.grades.push(value);
    } else if (type === "subject") {
      if (!nextCats.subjects.includes(value)) nextCats.subjects.push(value);
    }
    setCategories(nextCats);
    saveToLocal("astera_categories", nextCats);
  };

  const submitVolunteerApplication = (app: Omit<VolunteerApplication, "id" | "date" | "status">) => {
    const newApp: VolunteerApplication = {
      ...app,
      id: `vol-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    const next = [newApp, ...volunteerApplications];
    setVolunteerApplications(next);
    saveToLocal("astera_vol_applications", next);
  };

  const approveVolunteerApplication = (id: string) => {
    const next = volunteerApplications.map((a) =>
      a.id === id ? { ...a, status: "approved" as const } : a
    );
    setVolunteerApplications(next);
    saveToLocal("astera_vol_applications", next);
  };

  const rejectVolunteerApplication = (id: string, note: string) => {
    const next = volunteerApplications.map((a) =>
      a.id === id ? { ...a, status: "rejected" as const, rejectionNote: note } : a
    );
    setVolunteerApplications(next);
    saveToLocal("astera_vol_applications", next);
  };

  const submitPartnerRequest = (req: Omit<PartnerRequest, "id" | "date" | "status">) => {
    const newReq: PartnerRequest = {
      ...req,
      id: `partner-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    const next = [newReq, ...partnerRequests];
    setPartnerRequests(next);
    saveToLocal("astera_partner_requests", next);
  };

  const updatePartnerRequestStatus = (id: string, status: PartnerRequest["status"]) => {
    const next = partnerRequests.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setPartnerRequests(next);
    saveToLocal("astera_partner_requests", next);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        resources,
        heroResourceIds,
        addResource,
        updateHeroResourceIds,
        updateResourceStatus,
        editResource,
        deleteResource,
        savedResources,
        toggleFavorite,
        downloadHistory,
        recordDownload,
        recentlyViewed,
        recordView,
        addComment,
        brokenReports,
        reportBrokenLink,
        resolveReport,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        categories,
        addCategory,
        analytics,
        volunteerApplications,
        submitVolunteerApplication,
        approveVolunteerApplication,
        rejectVolunteerApplication,
        partnerRequests,
        submitPartnerRequest,
        updatePartnerRequestStatus,
        supportTickets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
}
