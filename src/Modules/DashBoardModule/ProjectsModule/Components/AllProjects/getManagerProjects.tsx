import { http } from "../../../../../Services/Api/httpInstance";
import { Employee_URLS, USERS_URL } from "../../../../../Services/Api/ApisUrls";
import type { AxiosError } from "axios";

// --- التعريفات (Types) ---

type Task = {
  id: number;
  title: string;
  description: string;
  status: "ToDo" | "InProgress" | "Done" | string;
  creationDate: string;
  modificationDate: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  modificationDate: string;
  task: Task[];
};

// ضبط الاستجابة لتكون مطابقة لنظام الـ Pagination اللي شغالين بيه
type ProjectsResponse = {
  pageNumber: number;
  pageSize: number;
  data: Project[];
  totalNumberOfRecords: number; // جعلناها إجبارية لضمان ظهور أرقام الصفحات
  totalPages: number;
};

// --- الدالة (Function) ---

export async function getManagerProjectsFun(
  params: {
    pageNumber: number;
    pageSize: number;
    title?: string;
    userName?: string;
    phoneNumber?: string;
  },
  role?: string
): Promise<ProjectsResponse> {
  try {
    const url =
      role === "Manager"
        ? USERS_URL.GetAllProjects
        : Employee_URLS.GET_PROJECTSEMPLOYEE;

    const res = await http.get<ProjectsResponse>(url, { params });

    return {
      ...res.data,
      totalNumberOfRecords: res.data.totalNumberOfRecords ?? 0,
      totalPages: res.data.totalPages ?? 1,
    };
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Failed to fetch projects";

    throw new Error(message);
  }
}
