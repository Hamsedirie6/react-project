import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { get, post, put } from "../api/client";
import type { Product } from "../types";
import { useAuth } from "../auth/AuthContext";

type FormState = Pick<Product, "name" | "description" | "price" | "image">;

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const nav = useNavigate();
  const { user } = useAuth();

  const [state, setState] = useState<FormState>({
    name: "",
    description: "",
    price: 0,
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(isEdit);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (isEdit && id && /^\d+$/.test(id)) {
        try {
          const data = await get<Product>(`/api/products/${id}`);
          setState({
            name: data.name ?? "",
            description: data.description ?? "",
            price: Number(data.price) || 0,
            image: data.image ?? "",
          });
        } catch (e: any) {
          setErr(e.message ?? "Kunde inte hämta rätten");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      if (!state.name.trim()) throw new Error("Namn krävs");
      if (state.price < 0) throw new Error("Pris kan inte vara negativt");

      if (isEdit && id) {
        await put(`/api/products/${id}`, state);
      } else {
        await post("/api/products", state);
      }
      nav("/products");
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte spara");
    }
  }

  if (isEdit && loading) {
    return (
      <Container className="py-4">
        <Spinner animation="border" size="sm" className="me-2" />
        Laddar...
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <h1 className="h4 mb-3">{isEdit ? "Redigera rätt" : "Ny rätt"}</h1>
      {err && <Alert variant="danger">{err}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Namn</Form.Label>
          <Form.Control
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Beskrivning</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={state.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pris (kr)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            step="1"
            value={Number.isFinite(state.price) ? state.price : 0}
            onChange={(e) => update("price", Number(e.target.value))}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bild-URL</Form.Label>
          <Form.Control
            value={state.image ?? ""}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://…"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit">{isEdit ? "Spara" : "Skapa"}</Button>
          <Button variant="secondary" onClick={() => nav("/products")}>
            Avbryt
          </Button>
        </div>
      </Form>
    </Container>
  );
}
