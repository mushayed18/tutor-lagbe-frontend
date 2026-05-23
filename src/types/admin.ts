export type UserRole = "ADMIN" | "PARENT" | "TUTOR";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isBanned: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface AdminSingleUserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  role: UserRole;
  location: string | null;
  isBanned: boolean;
  isVerified: boolean;
  subscriptionType: "FREE" | "PREMIUM";
  subscriptionExpiresAt: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  count: number;
}

export interface GetUsersApiResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: AdminUserRecord[];
}

export interface GetSingleUserApiResponse {
  success: boolean;
  message: string;
  data: AdminSingleUserDetail;
}

export interface AdminTuitionParent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface AdminTuitionRecord {
  id: string;
  title: string;
  class: string;
  subjects: string;
  salary: number;
  location: string;
  createdAt: string;
  parentId: string;
  parent: AdminTuitionParent;
  _count: {
    applications: number;
  };
}

export interface AdminPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  count: number;
}

export interface GetAdminTuitionsApiResponse {
  success: boolean;
  message: string;
  meta: AdminPaginationMeta;
  data: AdminTuitionRecord[];
}
