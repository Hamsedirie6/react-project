import { FormEvent, useEffect, useState } from "react";
import { get, post, put } from "../api/client";
import { Booking } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";

type FormState = Omit<Booking, "id" | "createdAt">;

export default function BookingForm() {
  const { id } = useParams(); // "new" eller numeriskt id
  const isEdit = id !== "new";
  const [state, setState] = useState<FormState>({ userId: 0, date: "", time: "", guests: 1, note: "" });
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Sätt userId för ny bokning till inloggad användare
    if (!isEdit && user) {
      setState(s => ({ ...s, userId: user.id }));
    }
  }, [isEdit, user]);

  useEffect(() => {
    // Hämta befintlig bokning vid edit
    (async () => {
      if (isEdit && id && /^\d+$/.test(id)) {
        try {
          const data = await get<Booking>(`/api/bookings/${id}`);
          const { userId, date, time, guests, note } = data;
          setState({ userId, date, time, guests, note: note ?? "" });
        } catch (e: any) {
          setErr(e.message ?? "Kunde inte hämta bokningen");
        }
      }
    })();
  }, [id, isEdit]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState(s => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      // enkel validering
      if (!state.date || !state.time || !state.userId) {
        throw new Error("Fyll i datum, tid och userId");
      }
      if (isEdit && id) {
        await put(`/api/bookings/${id}`, state);
      } else {
        await post("/api/bookings", state);
      }
      nav("/bookings");
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte spara");
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 560 }}>
      <h1 className="h4 mb-3">{isEdit ? "Redigera bokning" : "Ny bokning"}</h1>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control type="number" value={state.userId}
            onChange={e => update("userId", Number(e.target.value))} required />
          <Form.Text>Vanligtvis förifyllt till inloggad användare.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Datum</Form.Label>
          <Form.Control type="date" value={state.date} onChange={e => update("date", e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tid</Form.Label>
          <Form.Control type="time" value={state.time} onChange={e => update("time", e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Gäster</Form.Label>
          <Form.Control type="number" min={1} value={state.guests}
            onChange={e => update("guests", Number(e.target.value))} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notering</Form.Label>
          <Form.Control as="textarea" rows={3} value={state.note ?? ""}
            onChange={e => update("note", e.target.value)} />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit">{isEdit ? "Spara" : "Skapa"}</Button>
          <Button variant="secondary" onClick={() => nav("/bookings")}>Avbryt</Button>
        </div>
      </Form>
    </Container>
  );
}
