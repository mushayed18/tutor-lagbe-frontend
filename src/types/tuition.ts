export interface TuitionParent {
  id: string;
  name: string;
  photo: string | null;
  subscriptionType: "FREE" | "PREMIUM";
}

export interface TuitionPost {
  id: string;
  title: string;
  description: string;
  subject: string;
  classLevel: string;
  salary: number;
  location: string;
  daysPerWeek: number;
  timeSlot: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  parent: TuitionParent;
}

export interface TuitionDetails extends TuitionPost {
  applicationsCount: number;
  parent: TuitionParent & {
    location: string | null;
    phone: string | null;
    email: string | null;
  };
}