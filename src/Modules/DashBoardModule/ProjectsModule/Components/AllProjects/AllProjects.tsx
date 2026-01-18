import { useEffect, useState } from "react";
import { getManagerProjectsFun } from "./getManagerProjects";
import Header from "../../../../../SharedComponents/Components/Header/Header";
import NoData from "../../../../../SharedComponents/Components/NoData/NoData";
import SearchBox from "./SearchBox";
import PaginationBar from "./PaginationBar";
import { Button, Modal } from "react-bootstrap";
import DeleteConfirmation from "../../../../../SharedComponents/Components/DeleteConfirmation/DeleteConfirmation";
import { http } from "../../../../../Services/Api/httpInstance";
import { USERS_URL } from "../../../../../Services/Api/ApisUrls";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useMode } from "../../../../../Context/ModeContext";
import { useAuth } from "../../../../../Context/AuthContext";

// التنسيقات الجديدة
import globalStyles from "../../../../../GlobalTable.module.css";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  creationDate: string;
  modificationDate: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  modificationDate: string;
  status?: string;
  task: Task[];
};

export default function AllProjects() {
  const auth = useAuth();
  const role = localStorage.getItem("userGroup");
  const isManager = role === "Manager";
  let navigate = useNavigate();
  const { darkMode } = useMode();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectDes, setProjectDesc] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectDatemod, setProjectDatemod] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProectsList] = useState<Project[]>([]);

  if (!auth) return null;

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getManagerProjectsFun(
        { pageSize, pageNumber, title: search },
        role,
      );
      setProectsList(res?.data ?? []);
      setTotalResults(res?.totalNumberOfRecords ?? 0);
      setTotalPages(res?.totalPages ?? 1);
    } catch (err) {
      setProectsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);

  const handleShow = (project: Project) => {
    setProjectId(project.id);
    setProjectName(project.title);
    setShow(true);
  };

  const handleShow2 = (project: Project) => {
    setProjectId(project.id);
    setProjectName(project.title);
    setProjectDate(project.creationDate);
    setProjectDatemod(project.modificationDate);
    setProjectDesc(project.description);
    setShow2(true);
  };

  const handleDelete = async () => {
    if (!projectId) return;
    setIsDeleting(true);
    try {
      await http.delete(USERS_URL.DeleteProject(projectId));
      handleClose();
      await load();
    } catch (err) {
      console.error("delete error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (q: string) => {
    if (q === search) return;
    setSearch(q);
    setPageNumber(1);
  };

  useEffect(() => {
    load();
  }, [search, pageNumber, pageSize]);

  const themeVars = {
    "--scrollbar-track": darkMode ? "#212529" : "#f1f1f1",
    "--scrollbar-thumb": darkMode ? "#495057" : "#888",
  } as React.CSSProperties;

  return (
    <div style={themeVars} className={globalStyles.marginFix}>
      {/* Modal Delete */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <DeleteConfirmation deleteItem="project " name={projectName} />
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete This item"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Details */}
      <Modal show={show2} onHide={handleClose2} size="lg" centered>
        <Modal.Header
          closeButton
          className={darkMode ? "bg-dark text-white border-secondary" : ""}
          closeVariant={darkMode ? "white" : undefined}
        >
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? "bg-dark text-white" : ""}>
          <div
            className={`p-3 rounded-4 ${darkMode ? "bg-black bg-opacity-25" : "bg-light"}`}
          >
            <div
              className={`rounded-4 p-3 shadow-sm mb-3 ${darkMode ? "bg-secondary bg-opacity-10 border border-secondary" : "bg-white"}`}
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h5 className="mb-1">{projectName}</h5>
                  <p
                    className={`mb-0 ${darkMode ? "text-white-50" : "text-muted"}`}
                  >
                    {projectDes}
                  </p>
                </div>
                <span
                  className={`badge px-3 py-2 rounded-pill ${darkMode ? "text-bg-light" : "text-bg-secondary"}`}
                >
                  Info
                </span>
              </div>
            </div>
            <div
              className={`rounded-4 p-3 shadow-sm ${darkMode ? "bg-secondary bg-opacity-10 border border-secondary" : "bg-white"}`}
            >
              <div
                className={`d-flex justify-content-between align-items-start py-2 ${darkMode ? "border-secondary" : "border-bottom"}`}
              >
                <span
                  className={`${darkMode ? "text-white-50" : "text-muted"} fw-semibold`}
                >
                  Title
                </span>
                <span className="fw-medium text-end">{projectName}</span>
              </div>
              <div
                className={`d-flex justify-content-between align-items-start py-2 border-bottom ${darkMode ? "border-secondary" : ""}`}
              >
                <span
                  className={`${darkMode ? "text-white-50" : "text-muted"} fw-semibold`}
                >
                  Description
                </span>
                <span className="fw-medium text-end" style={{ maxWidth: 420 }}>
                  {projectDes}
                </span>
              </div>
              <div
                className={`d-flex justify-content-between align-items-start py-2 border-bottom ${darkMode ? "border-secondary" : ""}`}
              >
                <span
                  className={`${darkMode ? "text-white-50" : "text-muted"} fw-semibold`}
                >
                  Created At
                </span>
                <span className="fw-medium text-end">
                  {new Date(projectDate).toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-start py-2">
                <span
                  className={`${darkMode ? "text-white-50" : "text-muted"} fw-semibold`}
                >
                  Last Updated
                </span>
                <span className="fw-medium text-end">
                  {new Date(projectDatemod).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className={darkMode ? "bg-dark border-secondary" : ""}>
          <Button
            variant={darkMode ? "outline-light" : "outline-danger"}
            onClick={handleClose2}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Header
        title="Projects"
        btn_text={isManager ? "Add New Project" : undefined}
        onBtnClick={() =>
          navigate("/dashboard/projects/add", { state: { mode: "add" } })
        }
      />

      <div className="mx-4">
        <SearchBox onSearch={handleSearch} debounceMs={500} />
      </div>

      {/* --- 1. الجدول (Desktop) --- */}
      <div
        className={`${globalStyles.tableResponsive} table-responsive d-none d-md-block mx-4`}
      >
        <table className="table table-striped">
          <thead>
            <tr className="table-header-row primary-color-bg2 py-3">
              <th className="py-2">
                Title <i className="fa-solid fa-sort ms-2"></i>
              </th>
              <th className="py-2">
                Status <i className="fa-solid fa-sort ms-2"></i>
              </th>
              <th className="py-2">
                Num Users <i className="fa-solid fa-sort ms-2"></i>
              </th>
              <th className="py-2">
                Num Tasks <i className="fa-solid fa-sort ms-2"></i>
              </th>
              <th className="py-2">
                Date Created <i className="fa-solid fa-sort ms-2"></i>
              </th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : projects.length > 0 ? (
              projects.map((project, idx) => (
                <tr key={project.id || idx}>
                  <td>{project.title}</td>
                  <td>
                    <span
                      className="primarycolorbg2 px-3 py-1 rounded-pill text-white"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Public
                    </span>
                  </td>
                  <td>2</td>
                  <td>{project.task.length}</td>
                  <td>
                    {new Date(project.creationDate).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </td>
                  <td>
                    {isManager && (
                      <div className="dropdown">
                        <button
                          className="btn btn-link p-0"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className={`fa-solid fa-ellipsis-vertical ${darkMode ? "text-white" : "text-dark"}`}
                          ></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleShow2(project)}
                            >
                              <i className="fa-regular fa-eye me-2"></i> View
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate("/dashboard/projects/add", {
                                  state: {
                                    mode: "edit",
                                    projectIdd: project.id,
                                  },
                                })
                              }
                            >
                              <i className="fa-regular fa-pen-to-square me-2"></i>{" "}
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleShow(project)}
                            >
                              <i className="fa-regular fa-trash-can me-2"></i>{" "}
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
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

      {/* --- 2. الكروت (Mobile) --- */}
      <div className="d-block d-md-none mx-4 mt-3">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : projects.length > 0 ? (
          projects.map((project, idx) => (
            <div
              key={project.id || idx}
              className={`card mb-3 border-0 shadow-sm rounded-4 p-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold m-0">{project.title}</h6>
                {isManager && (
                  <div className="dropdown">
                    <i
                      className="fa-solid fa-ellipsis-vertical p-2 cursor-pointer"
                      data-bs-toggle="dropdown"
                    />
                    <ul className="dropdown-menu shadow rounded-3">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleShow2(project)}
                        >
                          <i className="fa-regular fa-eye me-2"></i>View
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            navigate("/dashboard/projects/add", {
                              state: { mode: "edit", projectIdd: project.id },
                            })
                          }
                        >
                          <i className="fa-regular fa-pen-to-square me-2"></i>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleShow(project)}
                        >
                          <i className="fa-regular fa-trash-can me-2"></i>Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <span
                  className="primarycolorbg2 px-3 py-1 rounded-pill text-white"
                  style={{ fontSize: "0.75rem" }}
                >
                  Public
                </span>
              </div>
              <div className="small opacity-75 border-top pt-2 mt-2">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tasks:</span>
                  <span className="fw-medium">{project.task.length}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Created:</span>
                  <span className="fw-medium">
                    {new Date(project.creationDate).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <NoData />
          </div>
        )}
      </div>

      <div className="mx-4 my-0 mt-0">
        <PaginationBar
          totalResults={totalResults}
          pageNumber={pageNumber}
          pageSize={pageSize}
          onPageChange={(p) => setPageNumber(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageNumber(1);
          }}
        />
      </div>
    </div>
  );
}
