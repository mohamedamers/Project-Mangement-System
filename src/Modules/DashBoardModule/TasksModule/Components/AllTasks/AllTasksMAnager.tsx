import { useEffect, useState } from "react";
import {
  TASK_URLS,
  USERS_URL,
  PROJECT_URLS,
} from "../../../../../Services/Api/ApisUrls";
import { http } from "../../../../../Services/Api/httpInstance";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../../SharedComponents/Components/NoData/NoData";

import styles from "./AllTasks.module.css";
import { Button, Modal, Spinner } from "react-bootstrap";
import DeleteConfirmation from "../../../../../SharedComponents/Components/DeleteConfirmation/DeleteConfirmation";
import { toast } from "react-toastify";
import PaginationBar from "../../../ProjectsModule/Components/AllProjects/PaginationBar";
import SearchBox from "../../../ProjectsModule/Components/AllProjects/SearchBox";
import Header from "../../../../../SharedComponents/Components/Header/Header";
//  التنسيقات الجديدة
import globalStyles from "../../../../../GlobalTable.module.css";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  employee: { id: number } | null;
  project: { id: number } | null;
  creationDate: string;
};

type User = { id: number; userName: string };
type Project = { id: number; title: string };

export default function AllTasksMAnager() {
  const navigate = useNavigate();
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState<number | null>(null);
   const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [taskId, setTaskId] = useState(0);
  const [taskName, setTaskName] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTask, setViewTask] = useState<any>(null);
  const [loadingView, setLoadingView] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");

  const handleSearch = (q: string) => {
    if (q === search) return;
    setSearch(q);
    setPageNumber(1);
  };

  const openStatusModal = (task: Task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedTask(null);
  };

  const changeTaskStatus = async () => {
    if (!selectedTask) return;

    try {
      await http.put(
        TASK_URLS.CHANGE_STATUS(selectedTask.id),
        { status: newStatus }, // BODY
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // update UI instantly
      setTasksList((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, status: newStatus } : t
        )
      );

      toast.success("Status updated successfully");
      closeStatusModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change status");
    }
  };

  const getTaskById = async (id: number) => {
    try {
      setLoadingView(true);
      const res = await http.get(TASK_URLS.GET_TASK(id));
      setViewTask(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task details");
    } finally {
      setLoadingView(false);
    }
  };
  const handleShow = (ts: any) => {
    setTaskId(ts.id);
    setTaskName(ts.title);
    setShow(true);
  };

  const getAllTasks = async () => {
    try {
       setIsLoading(true);
      const response = await http.get(TASK_URLS.GET_TASKS_BY_MANAGER, {
        params: { pageNumber: 1, pageSize: 10, title: search },
      });
      setTasksList(response.data.data ?? []);
      setTotalResults(response?.data.totalNumberOfRecords ?? 0);
      setTotalPages(response?.data.totalPages ?? 1);
    } catch (error) {
      console.error("Failed to load tasks", error);
      setTotalResults(0);
      setTotalPages(1);
    }
    finally {
      setIsLoading(false);
    }
  };

  const getUsersAndProjects = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        http.get(USERS_URL.GET_ALL_USERS),
        http.get(PROJECT_URLS.GET_ALL_PROJECTS),
      ]);
      setUsers(usersRes.data.data ?? []);
      setProjects(projectsRes.data.data ?? []);
    } catch (err) {
      console.error("Failed to load users/projects", err);
    }
  };

  const deleteTask = async () => {
    try {
      
      const response = await http.delete(TASK_URLS.DELETE_TASK(taskId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

        
        
      });
      handleClose();
    toast.success("Task deleted successfully");
      await getAllTasks();
      

    } catch (error) {}
  };

  useEffect(() => {
    getAllTasks();
    getUsersAndProjects();
  }, [search, pageNumber, pageSize]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Helper to map IDs to names
  const getUserName = (id: number | undefined) =>
    users.find((u) => u.id === id)?.userName ?? "-";

  const getProjectTitle = (id: number | undefined) =>
    projects.find((p) => p.id === id)?.title ?? "-";

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return styles.statusTodo;
      case "inprogress":
        return styles.statusProgress;
      case "done":
        return styles.statusDone;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <>
      <div className="header-wrapper ">
        <Header
          btn_text="Add New Task"
          title="Tasks"
          onBtnClick={() =>
            navigate("/dashboard/tasks/add", {
              state: { mode: "add" },
            })
          }
        />
      </div>
      {/* <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center bg-white border border-1 p-3">
          <h1>Tasks</h1>
          <button
            className="p-2 px-5 bg-warning rounded-5 border-0"
            onClick={() => navigate("/dashboard/tasks/add")}
          >
            + Add New Task
          </button>
        </div>
      </div> */}

      <div className={`container-fluid ${styles.backgroundPage}`}>
        {/* Search & Filter */}
        {/* <div className="container d-flex justify-content-start align-items-center bg-white rounded-3 p-3 mb-3">
          <div className={`${styles.searchWrapper} me-3`}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search tasks"
              className={`form-control rounded-4 ms-2 ${styles.searchInput}`}
            />
          </div>
          <button className="rounded-5 bg-white px-4">Filter</button>
        </div> */}

        <div className="mx-4">
          <SearchBox onSearch={handleSearch} debounceMs={500} />
        </div>
        {/* Tasks Table */}
        <div
          className={`${globalStyles.tableContainer} d-none d-md-block mx-4 mt-0`}
        >
          <table className="table table-striped">
            <thead className="py-3">
              <tr className="table-header-row primary-color-bg2 py-3">
                <th scope="col">
                  Title<i className="fa-solid fa-sort ms-2"></i>
                </th>
                <th scope="col">
                  Status<i className="fa-solid fa-sort ms-2"></i>
                </th>
                <th scope="col">
                  User<i className="fa-solid fa-sort ms-2"></i>
                </th>
                <th scope="col">
                  Project<i className="fa-solid fa-sort ms-2"></i>
                </th>
                <th scope="col">
                  Date Created<i className="fa-solid fa-sort ms-2"></i>
                </th>
                <th scope="col">
                  Actions<i className="fa-solid fa-sort ms-2"></i>
                </th>
              </tr>
            </thead>
            <tbody>

                       {isLoading ? (
   <div
      className="position-absolute top-50 start-50 translate-middle"
      style={{ zIndex: 10 }}
    >
      <Spinner animation="border" variant="success" />
    </div>
            ) : 
              tasksList.length > 0 ? (
                tasksList.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>{getUserName(task.employee?.id)}</td>
                    <td>{getProjectTitle(task.project?.id)}</td>
                    <td>{formatDate(task.creationDate)}</td>
                    <td>
                      <div className="dropdown">
                        <i
                          className="fa-solid fa-ellipsis-vertical cursor-pointer"
                          data-bs-toggle="dropdown"
                        />
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => getTaskById(task.id)}
                            >
                              <i className="fa-solid fa-eye"></i> View
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(`/dashboard/tasks/edit/${task.id}`)
                              }
                            >
                              <i className="fa-solid fa-edit"></i> Edit
                            </button>
                          </li>
                          <li>
                            {/* <button
                              className="dropdown-item"
                              onClick={() => openStatusModal(task)}
                            >
                              <i className="fa-solid fa-arrows-rotate"></i>{" "}
                              Change Status
                            </button> */}
                          </li>
                          <li>
                            <button
                              onClick={() => handleShow(task)}
                              className="dropdown-item text-danger"
                            >
                              <i className="fa-solid fa-trash"></i> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <NoData />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Cards for Mobile View */}
        <div className="d-block d-md-none mx-4 mt-3">
          {tasksList.length > 0 ? (
            tasksList.map((task) => (
              <div
                key={task.id}
                className="card mb-3 border-0 shadow-sm rounded-4 p-3"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold  m-0">{task.title}</h6>
                  <div className="dropdown">
                    <i
                      className="fa-solid fa-ellipsis-vertical cursor-pointer p-1"
                      data-bs-toggle="dropdown"
                    />
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => getTaskById(task.id)}
                        >
                          View
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            navigate(`/dashboard/tasks/edit/${task.id}`)
                          }
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => openStatusModal(task)}
                        >
                          Change Status
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleShow(task)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    task.status
                  )} mb-3`}
                  style={{ width: "fit-content" }}
                >
                  {task.status}
                </span>

                <div className="small text-muted border-top pt-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>User:</span>
                    <span className="text-dark fw-medium">
                      {getUserName(task.employee?.id)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Project:</span>
                    <span className="text-dark fw-medium">
                      {getProjectTitle(task.project?.id)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Joined:</span>
                    <span className="text-dark fw-medium">
                      {formatDate(task.creationDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-5">
                <NoData />
              </td>
            </tr>
          )}
        </div>
      </div>

  <Modal show={show} onHide={handleClose} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Delete Task</Modal.Title>
  </Modal.Header>

  <Modal.Body className="py-3">
    <DeleteConfirmation name={taskName} deleteItem="Task" />
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="danger" onClick={deleteTask}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

      

      <Modal
        show={showStatusModal}
        onHide={closeStatusModal}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Task Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-2 fw-bold">{selectedTask?.title}</p>

          <select
            className="form-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeStatusModal}>
            Cancel
          </Button>
          <Button variant="warning" onClick={changeTaskStatus}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loadingView ? (
            <p>Loading...</p>
          ) : viewTask ? (
            <>
              <p>
                <b>Title:</b> {viewTask.title}
              </p>
              <p>
                <b>Description:</b> {viewTask.description}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    viewTask.status
                  )}`}
                >
                  {viewTask.status}
                </span>
              </p>

              <p>
                <b>Assigned To:</b> {viewTask.employee?.userName || "-"}
              </p>

              <p>
                <b>Project:</b> {viewTask.project?.title || "-"}
              </p>

              <p>
                <b>Created:</b> {formatDate(viewTask.creationDate)}
              </p>
            </>
          ) : (
            <p>No data</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
