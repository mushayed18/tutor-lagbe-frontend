export type ApplicationStatus = "PENDING" | "HIRED" | "REJECTED";

export interface Applicant {
  applicationId: string;
  tutorId: string;
  name: string;
  photo: string | null;
  status: ApplicationStatus;
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      count: number;
    };
    data: Applicant[];
  };
}
