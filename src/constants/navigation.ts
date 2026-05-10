import { 
  Bell, 
  Bookmark, 
  Send, 
  Briefcase, 
  UserCircle, 
  FileText, 
  Users, 
  UserRoundPen,
  UsersRound,
  PencilLine,
  House,
} from "lucide-react";

export const NAV_LINKS = {
  TUTOR: [
    { label: "Home", href: "/tutor/feed", icon: House, priority: true },
    { label: "Applications", href: "/tutor/my-applications", icon: Send, priority: true },
    { label: "Notifications", href: "/tutor/notifications", icon: Bell, priority: true },
    { label: "My Jobs", href: "/tutor/my-jobs", icon: Briefcase, priority: true },
    { label: "Bookmarks", href: "/tutor/bookmarks", icon: Bookmark, priority: true },
    { label: "Portfolio", href: "/tutor/portfolio", icon: UserRoundPen, priority: true },
    { label: "Profile", href: "/tutor/profile", icon: UserCircle, priority: true },
  ],
  PARENT: [
    { label: "Home", href: "/parent/feed", icon: House, priority: true },
    { label: "Create a job post", href: "/parent/create-job-post", icon: PencilLine, priority: true },
    { label: "My Tuitions", href: "/parent/my-tuitions", icon: FileText, priority: true },
    { label: "Bookmarks", href: "/parent/bookmarks", icon: Bookmark, priority: true },
    { label: "Notifications", href: "/parent/notifications", icon: Bell, priority: true },
    { label: "My Tutors", href: "/parent/my-tutors", icon: Users, priority: true },
    { label: "Profile", href: "/parent/profile", icon: UserCircle, priority: true },
  ],
  ADMIN: [
    { label: "Users", href: "/admin/users", icon: UsersRound, priority: true },
    { label: "Tuitions", href: "/admin/tuitions", icon: FileText, priority: true },
    { label: "Profile", href: "/admin/profile", icon: UserCircle, priority: true },
  ],
};