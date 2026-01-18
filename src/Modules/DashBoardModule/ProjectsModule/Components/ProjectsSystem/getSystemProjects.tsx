import { http } from "../../../../../Services/Api/httpInstance";
import { PROJECT_URLS } from "../../../../../Services/Api/ApisUrls";
import type { AxiosError } from "axios";

type Manager = {
  id: number;
  userName: string;
  imagePath?: string | null;
  email: string;
  country?: string | null;
  phoneNumber?: string | null;
  verificationCode?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
};

type Project = {
  id: number;
  title: string;
  description: string;
  status?: "ToDo" | "InProgress" | "Done" | string;
  creationDate: string;
  modificationDate: string;
  manager: Manager;
};

export type ProjectsResponse = {
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
  totalNumberOfRecords?: number;
  data: Project[];
};

export async function getSystemProjectsFun(params: {
  pageNumber: number;
  pageSize: number;
  title?: string;
}): Promise<ProjectsResponse> {
  try {
    const res = await http.get<ProjectsResponse>(
      PROJECT_URLS.GET_ALL_PROJECTS,
      { params }
    );

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;

    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Failed to fetch projects";

    console.error("getSystemProjectsFun failed:", {
      status: error.response?.status,
      message,
    });

    throw new Error(message);
  }
}
