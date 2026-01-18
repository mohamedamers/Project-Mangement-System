import styles from "./Welcome.module.css";
import { IMAGES } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/auth/login");
    }, 4000);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className={`${styles.herobg}container-fluid  vh-100`}>
      <div className={`${styles.herobg} position-relative  overflow-hidden`}>
        <div className={`${styles.corner} ${styles.topright}`}>
          <img src={IMAGES.topRight} alt="top right" className="img-fluid " />
        </div>

        <div className={`${styles.corner} ${styles.bottomleft}`}>
          <img
            src={IMAGES.bottomLeft}
            alt="bottom left"
            className="img-fluid "
          />
        </div>

        <div className="d-flex justify-content-center align-items-center  h-100">
          <img src={IMAGES.logo} alt="logo" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}
