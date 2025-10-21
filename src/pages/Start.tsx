import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Start() {
  return (
    <Container className="py-5" style={{ maxWidth: 900 }}>
      <h1 className="mb-3">Välkommen till Elegante</h1>
      <p className="text-muted">Boka bord och kolla vår meny.</p>

      <div className="d-flex gap-2 mt-3">
        <Link to="/products" className="btn btn-primary">Se rätter</Link>
        <Link to="/bookings" className="btn btn-outline-primary">Boka bord</Link>
      </div>
    </Container>
  );
}
