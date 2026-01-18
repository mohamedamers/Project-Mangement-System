import { useNavigate } from "react-router-dom";
import { Button, Container, Image } from "react-bootstrap";
import notFoundGif from "../../../assets/images/notfound.gif";
import { useMode } from "../../../Context/ModeContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useMode();

  return (
  <div
    className={`min-vh-100 d-flex align-items-center ${
      darkMode ? "bg-dark text-light" : "bg-light"
    }`}
  >
    <Container className="text-center py-5">
      <Image
        src={notFoundGif}
        alt="404 Not Found"
        fluid
        style={{ maxWidth: 760 }}
        className="mb-4"
      />

      <h2 className="fw-bold mb-2">Page Not Found</h2>

      <p className={`${darkMode ? "text-secondary" : "text-muted"} mb-4`}>
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <div className="d-flex gap-2 justify-content-center">
        <Button  className="primarycolorbg" onClick={() => navigate("/dashboard")}>
          Go to Home
        </Button>

        <Button
          variant={darkMode ? "outline-light" : "outline-secondary"}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    </Container>
  </div>
);
}