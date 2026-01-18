import { useEffect, useState } from "react";
import NoData from "../../../../../SharedComponents/Components/NoData/NoData";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import SearchBox from "../AllProjects/SearchBox";
import PaginationBar from "../AllProjects/PaginationBar";
import { getSystemProjectsFun } from "./getSystemProjects";
import styles from "../../../UsersModule/Components/UsersForm.module.css";
import globalStyles from "../../../../../GlobalTable.module.css";
import { Button, Modal } from "react-bootstrap";
import { useMode } from "../../../../../Context/ModeContext";

export default function ProjectsSystem() {
  const { darkMode } = useMode();
  const [projects, setProectsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getSystemProjectsFun({
        pageSize,
        pageNumber,
        title: search,
      });
      setProectsList(res?.data ?? []);
      setTotalResults(res?.totalNumberOfRecords ?? 0);
    } catch (err) {
      setProectsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    load();
  }, [search, pageNumber, pageSize]);

  const handleShowView = (project: any) => {
    setSelectedProject(project);
    setShowViewModal(true);
    setShowMenu(null);
  };

  return (
    <div className={globalStyles.marginFix}>
      <header className="bg-white overflow-hidden rounded rounded-4 my-2">
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-between p-3">
            <h3 className={`text-black m-3 ${globalStyles.title}`}>
              Projects System
            </h3>
          </div>
        </div>
      </header>

      <div className="mx-4">
        <SearchBox
          onSearch={(q) => {
            setSearch(q);
            setPageNumber(1);
          }}
          debounceMs={400}
        />
      </div>

      {/* عرض الجدول للشاشات الكبيرة */}
      <div className={`${globalStyles.tableResponsive} table-responsive mx-4 d-none d-md-block`}>
        <table className="table table-striped">
          <thead>
            <tr className="table-header-row primary-color-bg2">
              <th className={styles.tableHeaderCell}>Title</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Manager</th>
              <th className={styles.tableHeaderCell}>Manager Mail</th>
              <th className={styles.tableHeaderCell}>Date Created</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" variant="success" /></td></tr>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{project.title}</td>
                  <td className={styles.tableCell}>
                    <span className="bg-success px-3 py-1 rounded-pill text-white" style={{ fontSize: "0.75rem" }}>
                      Active
                    </span>
                  </td>
                  <td className={styles.tableCell}>{project.manager?.userName ?? "-"}</td>
                  <td className={styles.tableCell}>{project.manager?.email ?? "-"}</td>
                  <td className={styles.tableCell}>{new Date(project.creationDate).toLocaleDateString("en-GB")}</td>
                  <td className={styles.tableCell} style={{ position: "relative" }}>
                    <div 
                      className={styles.dotsWrapper} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(showMenu === project.id ? null : project.id);
                      }}
                    >
                      <i className="fa-solid fa-ellipsis-vertical cursor-pointer" />
                    </div>
                    {showMenu === project.id && (
                      <div className={styles.actionMenuCustom}>
                        <button className={styles.menuItem} onClick={() => handleShowView(project)}>
                          <i className="fa-solid fa-eye me-2"></i> View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-5"><NoData /></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* عرض الكروت للموبايل (مطابق للصورة المرفقة) */}
      <div className="d-block d-md-none mx-4 mt-3">
        {isLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className={`card mb-3 border-0 shadow-sm rounded-4 p-3 ${styles.cardCustom}`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="fw-bold m-0">{project.title}</h5>
                <div style={{ position: "relative" }}>
                   <div 
                    className={styles.dotsWrapper}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(showMenu === project.id ? null : project.id);
                    }}
                  >
                    <i className="fa-solid fa-ellipsis-vertical" />
                  </div>
                  {showMenu === project.id && (
                    <div className={styles.actionMenuCustom}>
                      <button className={styles.menuItem} onClick={() => handleShowView(project)}>
                        <i className="fa-solid fa-eye me-2"></i> View
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <span className="bg-success px-2 py-1 rounded-2 text-white mb-3" style={{ fontSize: "0.7rem", width: 'fit-content' }}>
                Active
              </span>

              <div className="small mt-2">
                <div className="d-flex mb-2">
                  <span className={styles.labelMuted} style={{width: '80px'}}>Manager:</span>
                  <span className="fw-medium">{project.manager?.userName ?? "-"}</span>
                </div>
                <div className="d-flex mb-2">
                  <span className={styles.labelMuted} style={{width: '80px'}}>Email:</span>
                  <span className="fw-medium text-truncate">{project.manager?.email ?? "-"}</span>
                </div>
                <div className="d-flex">
                  <span className={styles.labelMuted} style={{width: '80px'}}>Joined:</span>
                  <span className="fw-medium">{new Date(project.creationDate).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            </div>
          ))
        ) : <NoData />}
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

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div className="p-2">
              <p><strong>Title:</strong> {selectedProject.title}</p>
              <p><strong>Manager:</strong> {selectedProject.manager?.userName || "-"}</p>
              <p><strong>Email:</strong> {selectedProject.manager?.email || "-"}</p>
              <p><strong>Date:</strong> {new Date(selectedProject.creationDate).toLocaleDateString("en-GB")}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}