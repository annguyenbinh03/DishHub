import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <Container className="text-center p-5 shadow rounded bg-white" style={{ maxWidth: "500px" }}>
        <FaExclamationTriangle size={50} className="text-danger mb-3" />
        <h2 className="text-danger">Access Denied</h2>
        <p className="text-muted">You do not have permission to view this page.</p>
        <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
      </Container>
    </div>
  );
};

export default UnauthorizedPage;