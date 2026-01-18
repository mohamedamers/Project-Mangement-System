import { useMemo } from "react";
import { useAuth } from "../../../Context/AuthContext";

export default function DashHeader({
  username,
  description,
}: {
  username?: string;
  description?: string;
}) {
  const { loginData } = useAuth()!;
  const welcome = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 15 && hour > 6) {
      return "Good Morning";
    } else {
      return "Good Evening";
    }
  }, []);

  return (
    <>
      <div className="header-container d-flex justify-content-between align-items-center p-md-5 mb-4 m-4 py-5 ">
        <div className="caption text-white py-3 ">
          <div className="mb-3 ">
            <span className="h1 h1PaddingCustom  ">{`${welcome}`}</span>
            <span className="h2 changePassBtn ps-2 text-warning ">{loginData?.userName}</span>
            <p className="h3 headerPCustomize">
              You can add project and assign tasks to your team
            </p>
            <span className="fs-3 mx-3 text-capitalize">
              {username
                ? username
                    .replace(/[0-9]/g, "")
                    .replace(/^\w/, (c: string) => c.toUpperCase())
                : ""}
            </span>
          </div>

          <p>{description}</p>
        </div>
      </div>
    </>
  );
}
