import { useEffect, useRef, useState, useCallback } from "react";
import { Badge, Card, Col, Dropdown, Modal, Row } from "react-bootstrap";
import { useMode } from "../../../../../Context/ModeContext";
import NoData from "../../../../../SharedComponents/Components/NoData/NoData";
import PaginationBar from "../../../ProjectsModule/Components/AllProjects/PaginationBar";
import SearchBox from "../../../ProjectsModule/Components/AllProjects/SearchBox";
import styles from "../UsersForm.module.css";
import globalStyles from "../../../../../GlobalTable.module.css";

interface User {
  id: number;
  name: string;
  status: "Active" | "Not Active";
  phone: string;
  email: string;
  dateCreated: string;
}

// Simulated API function - replace with real API call
const getUsersAPI = async (params: {
  pageSize: number;
  pageNumber: number;
  search?: string;
}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { pageSize, pageNumber, search = "" } = params;
  const searchLower = search.toLowerCase();
  
  // Create all mock data (200 users for example)
  const allData: User[] = Array.from({ length: 200 }, (_, index) => ({
    id: index + 1,
    name:
      index % 3 === 0
        ? "Ahmed"
        : index % 2 === 0
        ? "Upskilling"
        : "Mohamed",
    status: index % 4 === 0 ? "Not Active" : "Active",
    phone: `0112432${String(index + 1000).padStart(4, '0')}`,
    email: `user${index + 1}@example.com`,
    dateCreated: `09-${String((index % 30) + 1).padStart(2, '0')}-2023`,
  }));

  // Filter by search term
  const filteredData = allData.filter((user) => {
    if (!searchLower) return true;
    
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  // Calculate totals
  const totalNumberOfRecords = filteredData.length;
  const totalPages = Math.ceil(totalNumberOfRecords / pageSize);
  
  return {
    data: paginatedData,
    totalNumberOfRecords,
    totalPages,
    pageNumber,
    pageSize
  };
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);
  
  const { darkMode } = useMode();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load function - uses useCallback with proper dependencies
  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getUsersAPI({
        pageSize,
        pageNumber: currentPage,
        search: searchTerm,
      });

      setUsers(res.data);
      setTotalResults(res.totalNumberOfRecords);
      setTotalPages(res.totalPages);
      
      // If current page is greater than total pages, go to last page
      if (currentPage > res.totalPages && res.totalPages > 0) {
        setCurrentPage(res.totalPages);
      }
    } catch (err) {
      console.error("load users failed:", err);
      setUsers([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, currentPage, searchTerm]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Separate effect for search term changes only
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Separate effect for page size changes only
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [pageSize]);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setShowMenu(null);
  };

  const handleBlock = async (id: number) => {
    try {
      // In reality, call API to update user status
      setUsers(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, status: u.status === "Active" ? "Not Active" : "Active" }
            : u
        )
      );
      setShowMenu(null);
    } catch (err) {
      console.error("Block user failed:", err);
    }
  };

  const getStatusStyle = (status: "Active" | "Not Active") => {
    return `${styles.statusBadge} ${
      status === "Active" ? styles.statusActive : styles.statusNotActive
    }`;
  };

  // Mobile Card View Component
  const MobileUserCard = ({ user }: { user: User }) => (
    <Card
      className="mb-3"
      bg={darkMode ? "dark" : "light"}
      text={darkMode ? "white" : "dark"}
      style={{
        border: darkMode ? "1px solid #373b3e" : "1px solid #dee2e6",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{user.name}</h5>
            <Badge bg={user.status === "Active" ? "success" : "danger"}>
              {user.status}
            </Badge>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id={`dropdown-${user.id}`}
              className="p-0"
              style={{
                color: darkMode ? "#fff" : "#000",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              className={darkMode ? "dropdown-menu-dark" : ""}
            >
              <Dropdown.Item onClick={() => handleView(user)}>
                <i className="fa-regular fa-eye me-2"></i>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleBlock(user.id)}>
                <i
                  className={`fa-solid ${
                    user.status === "Active"
                      ? "fa-user-slash text-danger"
                      : "fa-user-check text-success"
                  } me-2`}
                ></i>
                {user.status === "Active" ? "Block" : "Activate"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Row className="g-2">
          <Col xs={5}>
            <small className="text-muted">Phone:</small>
          </Col>
          <Col xs={7}>
            <small>{user.phone}</small>
          </Col>

          <Col xs={5}>
            <small className="text-muted">Email:</small>
          </Col>
          <Col xs={7}>
            <small className="text-truncate d-block">{user.email}</small>
          </Col>

          <Col xs={5}>
            <small className="text-muted">Joined:</small>
          </Col>
          <Col xs={7}>
            <small>{user.dateCreated}</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Page will be reset to 1 automatically by the separate useEffect
  };

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    // Page will be reset to 1 automatically by the separate useEffect
  };

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .table-responsive {
            font-size: 0.875rem;
          }
          
          .table th, .table td {
            padding: 0.5rem !important;
            white-space: nowrap;
          }

          .mx-4 {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
          }

          h3 {
            font-size: 1.25rem !important;
          }
        }

        @media (max-width: 576px) {
          .table {
            font-size: 0.75rem;
          }
        }

        /* Custom scrollbar for table on mobile */
        .table-responsive::-webkit-scrollbar {
          height: 6px;
        }

        .table-responsive::-webkit-scrollbar-track {
          background: ${darkMode ? "#212529" : "#f1f1f1"};
        }

        .table-responsive::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#495057" : "#888"};
          border-radius: 3px;
        }

        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "#6c757d" : "#555"};
        }
        
        /* Loading indicator */
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          border-radius: 8px;
        }
        
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        
        .empty-state {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        

      `}</style>


      <header className="bg-white overflow-hidden rounded rounded-4 my-2">
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-between p-3 text-white">
            <h3 className="text-black m-3">Users</h3>
          </div>
        </div>
      </header>

      <div className="mx-4">
        <SearchBox
          onSearch={handleSearch}
          debounceMs={500}
        />
      </div>

      <div className="position-relative">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Mobile Card View - Show on screens smaller than 768px */}
        {isMobile ? (
          <div className="mx-4 my-3">
            {users.length > 0 ? (
              users.map((user) => <MobileUserCard key={user.id} user={user} />)
            ) : (
              !isLoading && (
                <div className="empty-state">
                  <NoData />
                </div>
              )
            )}
          </div>
        ) : (
          /* Desktop Table View - Show on screens 768px and larger */
          <div className="table-responsive mx-4 my-0">
            <table className="table table-striped mb-0">
              <thead>
                <tr className="table-header-row primary-color-bg2">
                  <th className={styles.tableHeaderCell}>User Name</th>
                  <th className={styles.tableHeaderCell}>Statuses</th>
                  <th className={styles.tableHeaderCell}>Phone Number</th>
                  <th className={styles.tableHeaderCell}>Email</th>
                  <th className={styles.tableHeaderCell}>Date Created</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{user.name}</td>
                      <td className={styles.tableCell}>
                        <span className={getStatusStyle(user.status)}>
                          {user.status}
                        </span>
                      </td>
                      <td className={styles.tableCell}>{user.phone}</td>
                      <td className={styles.tableCell}>{user.email}</td>
                      <td className={styles.tableCell}>{user.dateCreated}</td>
                      <td
                        className={styles.tableCell}
                        style={{ position: "relative" }}
                      >
                        <div ref={showMenu === user.id ? menuRef : null}>
                          <button
                            onClick={() =>
                              setShowMenu(showMenu === user.id ? null : user.id)
                            }
                            className={styles.actionButton}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: darkMode ? "#fff" : "#000",
                            }}
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>

                          {showMenu === user.id && (
                            <div
                              className={styles.actionMenu}
                              style={{
                                position: "absolute",
                                right: "50%",
                                top: "80%",
                                zIndex: 1000,
                                backgroundColor: darkMode ? "#212529" : "#fff",
                                border: darkMode
                                  ? "1px solid #373b3e"
                                  : "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "8px 0",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                minWidth: "140px",
                              }}
                            >
                              <button
                                className="dropdown-item py-2 px-3"
                                style={{
                                  color: darkMode ? "#dee2e6" : "#000",
                                  fontSize: "14px",
                                }}
                                onClick={() => handleView(user)}
                              >
                                <i
                                  className="fa-regular fa-eye me-2"
                                  style={{
                                    color: darkMode ? "#dee2e6" : "#6c757d",
                                  }}
                                ></i>{" "}
                                View
                              </button>
                              <button
                                className="dropdown-item py-2 px-3"
                                style={{
                                  color: darkMode ? "#dee2e6" : "#000",
                                  fontSize: "14px",
                                }}
                                onClick={() => handleBlock(user.id)}
                              >
                                <i
                                  className={`fa-solid ${
                                    user.status === "Active"
                                      ? "fa-user-slash text-danger"
                                      : "fa-user-check text-success"
                                  } me-2`}
                                ></i>
                                {
                                user.status === "Active"
                                      ? "Block"
                                      : "Un Block"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  !isLoading && (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <NoData />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar - show only if there is data */}
        {totalResults > 0 && (
          <div className="mx-4 my-0 mt-0">
            <PaginationBar
              totalResults={totalResults}
              pageNumber={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      {/* View User Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        contentClassName={darkMode ? "bg-dark text-white" : ""}
      >
        <Modal.Header
          closeButton
          className={darkMode ? "border-secondary" : ""}
        >
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <strong>Name:</strong>
              <p className="mb-0">{selectedUser?.name}</p>
            </Col>
            <Col xs={12}>
              <strong>Email:</strong>
              <p className="mb-0">{selectedUser?.email}</p>
            </Col>
            <Col xs={12}>
              <strong>Phone:</strong>
              <p className="mb-0">{selectedUser?.phone}</p>
            </Col>
            <Col xs={12}>
              <strong>Status:</strong>
              <p className="mb-0">
                <Badge
                  bg={selectedUser?.status === "Active" ? "success" : "danger"}
                >
                  {selectedUser?.status}
                </Badge>
              </p>
            </Col>
            <Col xs={12}>
              <strong>Joined:</strong>
              <p className="mb-0">{selectedUser?.dateCreated}</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}