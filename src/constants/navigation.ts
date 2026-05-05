import { 
  LayoutGrid, 
  Bell, 
  Bookmark, 
  Send, 
  Briefcase, 
  UserCircle, 
  FileText, 
  Users, 
  UserRoundPen,
  UsersRound,
} from "lucide-react";

export const NAV_LINKS = {
  TUTOR: [
    { label: "Home", href: "/feed", icon: LayoutGrid, priority: true },
    { label: "Applications", href: "/my-applications", icon: Send, priority: true },
    { label: "Notifications", href: "/notifications", icon: Bell, priority: true },
    { label: "My Jobs", href: "/my-jobs", icon: Briefcase, priority: false },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, priority: false },
    { label: "Portfolio", href: "/portfolio", icon: UserRoundPen, priority: true },
    { label: "Profile", href: "/profile", icon: UserCircle, priority: true },
  ],
  PARENT: [
    { label: "Home", href: "/feed", icon: LayoutGrid, priority: true },
    { label: "My Tuitions", href: "/my-tuitions", icon: FileText, priority: true },
    { label: "Notifications", href: "/notifications", icon: Bell, priority: true },
    { label: "My Tutors", href: "/my-tutors", icon: Users, priority: false },
    { label: "Profile", href: "/profile", icon: UserCircle, priority: true },
  ],
  ADMIN: [
    { label: "Users", href: "/admin/users", icon: UsersRound, priority: true },
    { label: "Tuitions", href: "/admin/tuitions", icon: FileText, priority: true },
  ],
};