import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import { http } from "../../../../../Services/Api/httpInstance";
import { TASK_URLS, USERS_URL, PROJECT_URLS } from "../../../../../Services/Api/ApisUrls";
import styles from "./TaskForm.module.css";
import styles2 from '../../../ProjectsModule/Components/ProjectForm/ProjectForm.module.css'
import { useMode } from "../../../../../Context/ModeContext";


type User = { id: number; userName: string };
type Project = { id: number; title: string };

type FormValues = {
  title: string;
  description: string;
  employeeId: number;
  projectId: number;
};

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // if present → edit mode
  const isEdit = Boolean(id);

  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loaded = useRef(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const { darkMode } = useMode();

  // Load users & projects
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          http.get(USERS_URL.GET_ALL_USERS),
          http.get(PROJECT_URLS.GET_ALL_PROJECTS),
        ]);
        setUsers(usersRes.data.data ?? []);
        setProjects(projectsRes.data.data ?? []);
      } catch (err) {
        console.error("Failed to load users/projects:", err);
        toast.error("Failed to load users or projects");
      }
    };

    fetchData();
  }, []);

  // Load task if editing
  useEffect(() => {
    if (!id) return;

    const loadTask = async () => {
      const taskId = Number(id);
      if (isNaN(taskId)) {
        toast.error("Invalid task ID");
        return;
      }

      try {
        const res = await http.get(TASK_URLS.GET_TASK(taskId));
        const task = res.data;
        reset({
          title: task.title,
          description: task.description,
          employeeId: task.employee?.id ?? 0,
          projectId: task.project?.id ?? 0,
        });
      } catch (err) {
        console.error("Failed to load task:", err);
        toast.error("Failed to load task data");
      }
    };

    loadTask();
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!data.employeeId || !data.projectId) {
      toast.error("Please select both a user and a project");
      return;
    }

    setIsSubmitting(true);

    try {
      let savedTask;
      if (isEdit) {
        const taskId = Number(id);
        const res = await http.put(TASK_URLS.UPDATE_TASK(taskId), data);
        toast.success("Task updated successfully!");
        savedTask = res.data;
      } else {
        const res = await http.post(TASK_URLS.CREATE_TASK, data);
        toast.success("Task created successfully!");
        savedTask = res.data;
        console.log("saved task",savedTask)
      }

      // Navigate back to tasks list with refresh signal
      navigate("/dashboard/tasks", { state: { newTask: savedTask } });

    } catch (err: any) {
      console.error("Task submission failed:", err);
      toast.error(err.response?.data?.message || "Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (


    
   <div className={darkMode ? "app-dark" : "app-light"}>
    <div className="container-fluid">
      <div className={styles2["page-header"]}>
        <button
          className={styles2["back-btn"]}
          onClick={() => navigate("/dashboard/tasks")}
          type="button"
        >
          ‹ View All Pages
        </button>

        <h4 className="primary-color2 small">
          {isEdit ? "Edit Task" : "Add A New Task"}
        </h4>
      </div>

      <div className={`container w-75 ${styles.backgroundPage}`}>
        <div className="card-surface p-4 rounded shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Title */}
            <div className="mb-4">
              <label className="form-label text-muted">Title *</label>
              <input
                type="text"
                className={`form-control rounded-4 py-3 ${
                  errors.title ? "is-invalid" : ""
                }`}
                placeholder="Enter task title"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" },
                  maxLength: { value: 150, message: "Title is too long" },
                })}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title.message}</div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="form-label text-muted">Description *</label>
              <textarea
                rows={4}
                className={`form-control rounded-4 py-3 ${
                  errors.description ? "is-invalid" : ""
                }`}
                placeholder="Describe the task..."
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                })}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description.message}</div>
              )}
            </div>

            {/* User & Project */}
            <div className="row mb-4 g-4">
              <div className="col-md-6">
                <label className="form-label text-muted">Assigned To *</label>
                <select
                  className={`form-select rounded-4 py-3 ${
                    errors.employeeId ? "is-invalid" : ""
                  }`}
                  {...register("employeeId", {
                    required: "Please select an assignee",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select team member...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.userName}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <div className="invalid-feedback">{errors.employeeId.message}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted">Project *</label>
                <select
                  className={`form-select rounded-4 py-3 ${
                    errors.projectId ? "is-invalid" : ""
                  }`}
                  {...register("projectId", {
                    required: "Please select a project",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <div className="invalid-feedback">{errors.projectId.message}</div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between align-items-center pt-4 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn rounded-pill px-5 text-white border-0"
                style={{ backgroundColor: "#f59e0b" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update Task" : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
