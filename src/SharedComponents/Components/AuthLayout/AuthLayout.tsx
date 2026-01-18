
import { Outlet, useLocation } from "react-router-dom";
import styles from "./Auth.module.css";
import { IMAGES } from "../../../assets/images";

export default function AuthLayout() {
  const { pathname } = useLocation();

  const topImg = pathname.includes("/auth/register")
    ? IMAGES.auth2
    : pathname.includes("/auth/login")
    ? IMAGES.auth5
    : pathname.includes("/auth/forget-password")
    ? IMAGES.auth2
    : pathname.includes("/auth/reset-password")
    ? IMAGES.auth8
    : pathname.includes("/auth/change-password")
    ? IMAGES.auth11
    : IMAGES.auth2;

  const bottomImg = pathname.includes("/auth/register")
    ? IMAGES.auth1
    : pathname.includes("/auth/login")
    ? IMAGES.auth1
    : pathname.includes("/auth/forget-password")
    ? IMAGES.auth6
    : pathname.includes("/auth/reset-password")
    ? IMAGES.auth9
    : pathname.includes("/auth/change-password")
    ? IMAGES.auth10
    : IMAGES.auth1;
  return (
    <div className={`${styles.herobg}container-fluid  vh-100`}>
      <div className={`${styles.herobg} position-relative  overflow-hidden`}>
        <div className={`${styles.corner} ${styles.topright}`}>
          <img src={topImg} alt="top right" className="img-fluid " />
        </div>

        <div className={`${styles.corner} ${styles.bottomleft}`}>
          <img src={bottomImg} alt="bottom left" className="img-fluid " />
        </div>

        <div className="d-flex  flex-column justify-content-center align-items-center  h-100">
          <img src={IMAGES.auth4} alt="logo" className="img-fluid" />

          <div className="col-12 col-sm-10 col-md-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
