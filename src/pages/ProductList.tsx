import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get, del } from "../api/client";
import type { Product } from "../types";
import { useAuth } from "../auth/AuthContext";

const PLACEHOLDER =
  "https://via.placeholder.com/600x400.png?text=Ingen+bild";

export default function ProductList() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const data = await get<Product[]>("/products");
      setItems(data);
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte hämta rätter");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: number) {
    if (!confirm("Ta bort rätten?")) return;
    try {
      await del(`/products/${id}`);
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte ta bort");
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Rätter</h1>
        {user?.role === "admin" && (
          <Link to="/products/new" className="btn btn-primary">
            Ny rätt
          </Link>
        )}
      </div>

      {err && <Alert variant="danger">{err}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-3">
        {items.map((p) => (
          <Col key={p.id}>
            <Card className="h-100 d-flex">
            <Card.Img
              variant="top"
              src={(p.image ?? "").trim() || PLACEHOLDER}
              alt={p.name}
              onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
            }}
              style={{ height: 160, objectFit: "cover" }}
            />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>{p.name}</span>
                  <span className="badge text-bg-secondary">{p.price} kr</span>
                </Card.Title>
                {p.description && (
                  <Card.Text className="text-muted mb-3">{p.description}</Card.Text>
                )}
                {user?.role === "admin" && (
                  <div className="mt-auto d-flex gap-2">
                    <Link
                      to={`/products/${p.id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Redigera
                    </Link>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => onDelete(p.id!)}
                    >
                      Ta bort
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {items.length === 0 && !err && (
        <p className="text-muted">Inga rätter ännu.</p>
      )}
    </Container>
  );
}
