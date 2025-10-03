import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { appRoutes } from "../routes";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const [expanded, setExpanded] = useState(false);
  const pathName = useLocation().pathname;
  const { user, logout } = useAuth();

 
  const currentRoute = appRoutes
    .slice()
    .sort((a, b) => (a.path.length > b.path.length ? -1 : 1))
    .find((x) => pathName.indexOf(x.path.split(":")[0]) === 0);

  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;


  const visibleRoutes = appRoutes.filter((r) => {
    if (!r.menuLabel) return false;
    if (r.visible === "guest") return !user;
    if (r.visible === "auth") return !!user;
    return true; 
  });

  return (
    <header>
      <Navbar
        expanded={expanded}
        expand="md"
        className="bg-primary"
        data-bs-theme="dark"
        fixed="top"
      >
        <Container fluid>
        
          <Navbar.Brand as={Link} to="/" className="me-5">
            Restaurang
          </Navbar.Brand>

         
          <Navbar.Toggle onClick={() => setExpanded(!expanded)} />

          <Navbar.Collapse id="basic-navbar-nav">
           
            <Nav className="me-auto">
              {visibleRoutes.map(({ menuLabel, path }, i) => (
                <Nav.Link
                  as={Link}
                  key={i}
                  to={path}
                  className={isActive(path) ? "active" : ""}
                  onClick={() => setTimeout(() => setExpanded(false), 200)}
                >
                  {menuLabel}
                </Nav.Link>
              ))}
            </Nav>

           
            <Nav className="ms-auto align-items-center">
              {user ? (
                <>
                  <Navbar.Text className="me-2">
                    Inloggad: {user.email} ({user.role})
                  </Navbar.Text>
                  <Nav.Link
                    as={Link}
                    to="/bookings/new"
                    className="btn btn-success btn-sm me-2"
                    onClick={() => setExpanded(false)}
                  >
                    Ny bokning
                  </Nav.Link>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={async () => {
                      await logout();
                      setExpanded(false);
                    }}
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setExpanded(false)}
                >
                  Logga in
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
