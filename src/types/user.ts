export interface ParentProfile {
  id: string;
  name: string;
  email: string | null; // Nullable due to privacy logic
  phone: string | null; // Nullable due to privacy logic
  photo: string | null;
  location: string;
  role: "PARENT";
  subscriptionType: "REGULAR" | "PREMIUM";
  isVerified: boolean;
  createdAt: string;
  _count?: {
    tuitions: number;
  };
}

export interface Review {
  id: string;
  reviewerId: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    photo: string | null;
  };
}
