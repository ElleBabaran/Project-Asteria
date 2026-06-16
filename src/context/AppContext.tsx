"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  name: string;
  email: string;
  role: "student" | "volunteer" | "admin" | "guest";
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
  login: (email: string, role: "student" | "volunteer" | "admin") => void;
  logout: () => void;
  resources: Resource[];
  addResource: (resource: Omit<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments">) => void;
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
}

const initialResources: Resource[] = [
  {
    id: "res-1",
    title: "Crop Production and Management",
    country: "India",
    curriculum: "CBSE",
    grade: "Class 8",
    subject: "Science",
    topic: "Crop Production",
    description: "Detailed study notes covering agricultural practices, sowing, adding manure & fertilizers, irrigation, harvesting, and storage of grains. Includes diagrams of irrigation systems.",
    fileType: "PDF",
    uploadDate: "2026-05-12",
    contributorName: "Aarav Sharma",
    downloadsCount: 1420,
    likes: 85,
    status: "approved",
    fileSize: "2.4 MB",
    comments: [
      { id: "c1", user: "Sneha Patel", role: "student", text: "Extremely helpful summary for exams! The drip irrigation diagram is very clean.", date: "2026-05-20", rating: 5 },
      { id: "c2", user: "Vikram Sen", role: "volunteer", text: "Nice work, Aarav. Very simple language.", date: "2026-05-22", rating: 4 }
    ]
  },
  {
    id: "res-2",
    title: "Linear Equations in One Variable",
    country: "United States",
    curriculum: "Common Core",
    grade: "Grade 8",
    subject: "Mathematics",
    topic: "Linear Equations",
    description: "Practice worksheet with step-by-step solutions for solving linear equations with variables on both sides, parentheses, and fractional coefficients.",
    fileType: "Worksheet",
    uploadDate: "2026-05-15",
    contributorName: "Sarah Miller",
    downloadsCount: 935,
    likes: 64,
    status: "approved",
    fileSize: "1.2 MB",
    comments: [
      { id: "c3", user: "Jason D.", role: "student", text: "The step-by-step answer key at the back saved me.", date: "2026-05-18", rating: 5 }
    ]
  },
  {
    id: "res-3",
    title: "Cell Structure & Organisation",
    country: "United Kingdom",
    curriculum: "GCSE",
    grade: "Key Stage 4",
    subject: "Biology",
    topic: "Cell Structure",
    description: "Classroom presentation slides on animal cells, plant cells, eukaryotic vs prokaryotic cells, and specialization of cells (sperm, nerve, and root hair cells).",
    fileType: "PPT",
    uploadDate: "2026-05-20",
    contributorName: "David Jenkins",
    downloadsCount: 1120,
    likes: 92,
    status: "approved",
    fileSize: "5.7 MB",
    comments: [
      { id: "c4", user: "Emma Watson", role: "student", text: "Perfect slides to revise cell division too!", date: "2026-05-28", rating: 5 }
    ]
  },
  {
    id: "res-4",
    title: "The Solar System — Diagram Pack",
    country: "Philippines",
    curriculum: "DepEd",
    grade: "Grade 6",
    subject: "Science",
    topic: "The Solar System",
    description: "A pack of high-resolution educational diagrams of the solar system, planet statistics, and orbit patterns. Great for classroom printing and projects.",
    fileType: "Image",
    uploadDate: "2026-06-01",
    contributorName: "Maria Santos",
    downloadsCount: 780,
    likes: 41,
    status: "approved",
    fileSize: "12.4 MB",
    comments: []
  },
  {
    id: "res-5",
    title: "Photosynthesis Exam Prep Pack",
    country: "Australia",
    curriculum: "ACARA",
    grade: "Year 9",
    subject: "Science",
    topic: "Photosynthesis",
    description: "Comprehensive exam prep package for plant biology, covering chemical formulas, limiting factors of photosynthesis, and leaf structure adaptations.",
    fileType: "PDF",
    uploadDate: "2026-06-03",
    contributorName: "Lachlan G.",
    downloadsCount: 540,
    likes: 38,
    status: "approved",
    fileSize: "3.1 MB",
    comments: []
  },
  {
    id: "res-6",
    title: "Algebraic Expressions Revision Notes",
    country: "Canada",
    curriculum: "Ontario Curriculum",
    grade: "Grade 9",
    subject: "Mathematics",
    topic: "Algebraic Expressions",
    description: "Brief reference sheets summarizing expanding binomials, factoring quadratics, exponent laws, and basic simplification techniques.",
    fileType: "DOC",
    uploadDate: "2026-06-05",
    contributorName: "Jean-Pierre",
    downloadsCount: 620,
    likes: 56,
    status: "approved",
    fileSize: "0.8 MB",
    comments: []
  },
  // Pending submissions for Admin Dashboard
  {
    id: "res-7",
    title: "Quadratic Equations Guide",
    country: "United States",
    curriculum: "Common Core",
    grade: "Grade 10",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    description: "A complete visual guide explaining the quadratic formula, finding vertex points, and factoring methods. Submitted for review.",
    fileType: "PDF",
    uploadDate: "2026-06-11",
    contributorName: "Alice Harper",
    downloadsCount: 0,
    likes: 0,
    status: "pending",
    fileSize: "1.8 MB",
    comments: []
  },
  {
    id: "res-8",
    title: "Chemical Reactions Study Notes",
    country: "India",
    curriculum: "CBSE",
    grade: "Class 10",
    subject: "Science",
    topic: "Chemical Reactions",
    description: "Brief revision notes for balancing chemical equations, types of reactions (combination, decomposition, displacement, redox), and everyday corrosion examples.",
    fileType: "PDF",
    uploadDate: "2026-06-12",
    contributorName: "Rajesh Kumar",
    downloadsCount: 0,
    likes: 0,
    status: "pending",
    fileSize: "1.4 MB",
    comments: []
  },
  {
    id: "res-9",
    title: "Shakespeare's Macbeth Summary",
    country: "United Kingdom",
    curriculum: "GCSE",
    grade: "Key Stage 4",
    subject: "English Literature",
    topic: "Macbeth",
    description: "Detailed character profiles, key scene analyses, and quotes pack with critical context notes for the AQA GCSE exam.",
    fileType: "Worksheet",
    uploadDate: "2026-06-13",
    contributorName: "Chloe Jenkins",
    downloadsCount: 0,
    likes: 0,
    status: "pending",
    fileSize: "2.1 MB",
    comments: []
  },
{
  id: "res-10",
  title: "Atoms, Elements and Compounds",
  country: "India",
  curriculum: "CBSE",
  grade: "Class 9",
  subject: "Chemistry",
  topic: "About the Atoms in each and every body and their chemistry with compunds and elemnts ",
  description: "Key Structure of an atom, Difference between molecules and compounds, Practise Questions",
  fileType: "PDF",
  uploadDate: "2026-06-16",
  contributorName: "Nitara Singh",
  downloadsCount: 0,
  likes: 0,
  status: "approved",
  fileSize: "1 MB",
  fileUrl: "/resources/atoms-elements-and-compounds-handwritten-notes.pdf",
  comments: []
},
{
  id: "res-11",
  title: "Forces And Laws Of Motion",
  country: "India",
  curriculum: "CBSE",
  grade: "Class 9",
  subject: "Physics",
  topic: "Force",
  description: "Newton's Laws of Motion||Inertia||Momentum",
  fileType: "DOC",
  uploadDate: "2026-06-16",
  contributorName: "Arjun Singh",
  downloadsCount: 0,
  likes: 0,
  status: "approved",
  fileSize: "500 KB",
  fileUrl: "/resources/Force-and-Laws-of-Motion.docx",
  comments: []
}
];

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
    countries: ["India", "United States", "United Kingdom", "Philippines", "Australia", "Canada"],
    curricula: {
      "India": ["CBSE", "ICSE", "State Board"],
      "United States": ["Common Core", "AP", "IB"],
      "United Kingdom": ["GCSE", "A-Levels", "Key Stage 3"],
      "Philippines": ["DepEd", "K-12"],
      "Australia": ["ACARA", "HSC", "VCE"],
      "Canada": ["Ontario Curriculum", "BC Curriculum", "Quebec Curriculum"]
    },
    grades: [
      "Grade 6", "Class 8", "Grade 8", "Year 9", "Grade 9", "Class 10", "Grade 10", "Key Stage 3", "Key Stage 4"
    ],
    subjects: ["Science", "Mathematics", "Biology", "English Literature", "History", "Physics", "Chemistry"]
  });

  // Mock site analytics
  const [analytics, setAnalytics] = useState({
    visitorsCount: 1542,
    activeStudents: 91400,
    activeVolunteers: 640
  });

  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>([]);

  // Load from localStorage on client side mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("astera_user");
    const cachedResources = localStorage.getItem("astera_resources");
    const cachedSaved = localStorage.getItem("astera_saved");
    const cachedHistory = localStorage.getItem("astera_history");
    const cachedRecent = localStorage.getItem("astera_recent");
    const cachedReports = localStorage.getItem("astera_reports");
    const cachedAnnouncements = localStorage.getItem("astera_announcements");
    const cachedCategories = localStorage.getItem("astera_categories");

    if (cachedUser) setUser(JSON.parse(cachedUser));
    if (cachedResources) setResources(JSON.parse(cachedResources));
    if (cachedSaved) setSavedResources(JSON.parse(cachedSaved));
    if (cachedHistory) setDownloadHistory(JSON.parse(cachedHistory));
    if (cachedRecent) setRecentlyViewed(JSON.parse(cachedRecent));
    if (cachedReports) setBrokenReports(JSON.parse(cachedReports));
    if (cachedAnnouncements) setAnnouncements(JSON.parse(cachedAnnouncements));
    if (cachedCategories) setCategories(JSON.parse(cachedCategories));
    const cachedVolApps = localStorage.getItem("astera_vol_applications");
    if (cachedVolApps) setVolunteerApplications(JSON.parse(cachedVolApps));

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

  const login = (email: string, role: "student" | "volunteer" | "admin") => {
    const name = email.split("@")[0];
    const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);
    const newUser: User = { name: uppercaseName, email, role };
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

  const addResource = (res: Omit<Resource, "id" | "uploadDate" | "downloadsCount" | "likes" | "status" | "comments">) => {
    const newRes: Resource = {
      ...res,
      id: `res-${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadsCount: 0,
      likes: 0,
      status: user?.role === "admin" ? "approved" : "pending",
      comments: []
    };

    const newResList = [newRes, ...resources];
    setResources(newResList);
    saveToLocal("astera_resources", newResList);
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

  const toggleFavorite = (id: string) => {
    let nextSaved = [...savedResources];
    if (nextSaved.includes(id)) {
      nextSaved = nextSaved.filter(favId => favId !== id);
    } else {
      nextSaved.push(id);
    }
    setSavedResources(nextSaved);
    saveToLocal("astera_saved", nextSaved);
  };

  const recordDownload = (id: string) => {
    // Increment download count
    const updated = resources.map(res => {
      if (res.id === id) {
        return { ...res, downloadsCount: res.downloadsCount + 1 };
      }
      return res;
    });
    setResources(updated);
    saveToLocal("astera_resources", updated);

    // Record history
    const historyItem = { resourceId: id, timestamp: new Date().toISOString() };
    const nextHistory = [historyItem, ...downloadHistory.filter(h => h.resourceId !== id)].slice(0, 50); // limit 50
    setDownloadHistory(nextHistory);
    saveToLocal("astera_history", nextHistory);
  };

  const recordView = (id: string) => {
    const nextRecent = [id, ...recentlyViewed.filter(viewedId => viewedId !== id)].slice(0, 10); // limit 10
    setRecentlyViewed(nextRecent);
    saveToLocal("astera_recent", nextRecent);
  };

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

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        resources,
        addResource,
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
