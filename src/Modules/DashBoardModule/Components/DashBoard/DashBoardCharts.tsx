import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { http } from "../../../../Services/Api/httpInstance";
import { TASK_URLS, USERS_URL } from "../../../../Services/Api/ApisUrls";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useMode } from "../../../../Context/ModeContext";

type CountResponse = {
  toDo: number;
  inProgress: number;
  done: number;
};
type UsersCountResponse = {
  activatedEmployeeCount: number;
  deactivatedEmployeeCount: number;
};

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashBoardCharts() {
  const role = localStorage.getItem("userGroup");
  const isManager = role === "Manager";
  const [counts, setCounts] = useState<CountResponse | null>(null);
  const [userscounts, setusersCounts] = useState<UsersCountResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { darkMode } = useMode();

  const getCount = async (): Promise<CountResponse> => {
    try {
      const res = await http.get<CountResponse>(TASK_URLS.COUNT_TASKS);
      // setCounts(res.data)
      return res.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        "Failed to fetch";
      throw new Error(message);
    }
  };

  const getUsersCount = async (): Promise<UsersCountResponse> => {
    try {
      const res = await http.get<UsersCountResponse>(USERS_URL.GET_COUNT);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        "Failed to fetch users count";
      throw new Error(message);
    }
  };

// DashBoardCharts.tsx
useEffect(() => {
  let mounted = true;

  const fetchData = async () => {
    setLoading(true);
    try {
      // نطلب بيانات المهام دائماً
      const tasksData = await getCount();
      
      // نطلب بيانات المستخدمين فقط لو هو Manager
      let usersData = null;
      if (isManager) {
        usersData = await getUsersCount();
      }

      if (mounted) {
        setCounts(tasksData);
        if (usersData) setusersCounts(usersData);
      }
    } catch (e) {
      if (mounted) setErrorMsg((e as Error).message);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchData();

  return () => { mounted = false; };
}, [isManager]); // أضف isManager هنا



  const chartData = {
    labels: ["To Do ", "In Progress", "Done"],

    datasets: [
      {
        label: "Tasks",
        data: [counts?.toDo ?? 0, counts?.inProgress ?? 0, counts?.done ?? 0],

        backgroundColor: ["#7d83aeff", "#417999ff'", "#904873ff"],
        // borderColor: [
        // 'rgba(154, 183, 195, 1)',
        // 'rgba(54, 162, 235, 1)',
        // 'rgba(255, 206, 86, 1)',],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      tooltip: { enabled: true },
    },
    cutout: "70%",
  };

  return (
    <>
      <div className="container-fluid py-3">
        <div className="row g-4">
          {/* Tasks */}
          <div className="col-md-6">
            <div
              className=" rounded-4 p-3 shadow-sm"
              style={{
                backgroundColor: darkMode ? "#0b1220" : "#fff",
                boxShadow: darkMode
                  ? "0 2px 4px rgba(255, 255, 255, 0.65)"
                  : "none",
              }}
            >
              <div className="d-flex gap-3">
                <div
                  style={{
                    width: 4,
                    height: 60,
                    borderRadius: 8,
                    background: "#F4A21B",
                  }}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold">Tasks</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    Lorem ipsum dolor sit amet,consecteture
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="rounded-4 p-3"
                        style={{
                          backgroundColor: darkMode ? "#065684ff" : "#F5F7E6",
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: "rgba(0,0,0,0.06)",
                          }}
                        >
                          <i className="bi bi-graph-up" />
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: darkMode ? "#fff" : "#000",
                          }}
                        >
                          Progress
                        </div>
                        <div className="fw-bold" style={{ fontSize: 20 }}>
                          {counts?.inProgress}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="rounded-4 p-3"
                        style={{
                          backgroundColor: darkMode ? "#158bceff" : "#EEF0FF",
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: "rgba(0,0,0,0.06)",
                          }}
                        >
                          <i className="bi bi-clipboard-check" />
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: darkMode ? "#fff" : "#000",
                          }}
                        >
                          Tasks Number
                        </div>
                        <div className="fw-bold" style={{ fontSize: 20 }}>
                          {counts?.toDo}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="rounded-4 p-3"
                        style={{
                          backgroundColor: darkMode ? "#4999c7ff" : "#F8E9F2",
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: "rgba(0,0,0,0.06)",
                          }}
                        >
                          <i className="bi bi-folder2-open" />
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: darkMode ? "#fff" : "#000",
                          }}
                        >
                          Projects Number
                        </div>
                        <div className="fw-bold" style={{ fontSize: 20 }}>
                          {counts?.done}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users */}
          {isManager ? (
            <div className="col-md-6">
              <div
                className=" rounded-4 p-3 shadow-sm"
                style={{
                  backgroundColor: darkMode ? "#0b1220" : "#fff",
                  boxShadow: darkMode
                    ? "0 2px 4px rgba(255, 255, 255, 0.65)"
                    : "none",
                }}
              >
                <div className="d-flex gap-3">
                  <div
                    style={{
                      width: 4,
                      height: 50,
                      borderRadius: 8,
                      background: "#F4A21B",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Users</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      Lorem ipsum dolor sit amet,consecteture
                    </div>

                    <div className="row g-3 mt-3">
                      <div className="col-md-6">
                        <div
                          className="rounded-4 p-3"
                          style={{
                            backgroundColor: darkMode ? "#39275aff" : "#EEF0FF",
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center mb-2"
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 14,
                              background: "rgba(0,0,0,0.06)",
                            }}
                          >
                            <i className="bi bi-person-check" />
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: darkMode ? "#fff" : "#000",
                            }}
                          >
                            active
                          </div>
                          <div className="fw-bold" style={{ fontSize: 20 }}>
                            {userscounts?.activatedEmployeeCount}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div
                          className="rounded-4 p-3"
                          style={{
                            backgroundColor: darkMode ? "#174864" : "#fff",
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center mb-2"
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 14,
                              background: "rgba(0,0,0,0.06)",
                            }}
                          >
                            <i className="bi bi-person-x" />
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: darkMode ? "#fff" : "#000",
                            }}
                          >
                            inactive
                          </div>
                          <div className="fw-bold" style={{ fontSize: 20 }}>
                            {userscounts?.deactivatedEmployeeCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {!loading && !errorMsg && counts && (
        <div className="mx-5 my-2" style={{ width: 320, height: 320 }}>
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </>
  );
}
