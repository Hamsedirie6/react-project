import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { get, post, put } from "../api/client";
import type { Booking } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Form, Spinner, Badge } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";

type FormState = Pick<Booking, "date" | "time" | "guests" | "note">;

const OPEN_HOUR = 11;
const CLOSE_HOUR = 21;
const CAPACITY = 6;

export default function BookingForm() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const nav = useNavigate();
  const { user } = useAuth();

  const today = useMemo(() => new Date(), []);
  const yyyy = today.getFullYear();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${yyyy}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const maxDateStr = `${yyyy}-12-31`;

  const [state, setState] = useState<FormState>({
    date: todayStr,
    time: "",
    guests: 1,
    note: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(isEdit);

 
  const [originalDate, setOriginalDate] = useState<string | null>(null);
  const [originalTime, setOriginalTime] = useState<string | null>(null);

  const [slotCount, setSlotCount] = useState<number>(0);

  const times = useMemo(() => {
    const list: string[] = [];
    for (let h = OPEN_HOUR; h <= CLOSE_HOUR; h++) list.push(`${pad(h)}:00`);
    return list;
  }, []);

  useEffect(() => {
    (async () => {
      if (isEdit && id && /^\d+$/.test(id)) {
        try {
          const data = await get<Booking>(`/bookings/${id}`);
          setState({
            date: data.date,
            time: data.time,
            guests: data.guests,
            note: data.note ?? "",
          });
          setOriginalDate(data.date);
          setOriginalTime(data.time);
        } catch (e: any) {
          setErr(e.message ?? "Kunde inte hämta bokningen");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);


  useEffect(() => {
    (async () => {
      setSlotCount(0);
      if (!state.date || !state.time) return;
      try {
        const rows = await get<Booking[]>(`/bookings?date=${encodeURIComponent(state.date)}`);
        const sameTime = rows.filter((b) => b.time === state.time);

      
        const adjusted = isEdit && id
          ? sameTime.filter((b) => String(b.id) !== String(id))
          : sameTime;

        setSlotCount(adjusted.length);
      } catch {
        setSlotCount(0);
      }
    })();
  }, [state.date, state.time, id, isEdit]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function validate(): string | null {
    if (!state.date) return "Välj ett datum.";
    if (state.date < todayStr) return "Datum kan inte vara bakåt i tiden.";
    if (state.date > maxDateStr) return `Datum får inte vara efter ${maxDateStr}.`;
    if (!state.time) return "Välj en tid.";
    if (state.guests < 1) return "Antal gäster måste vara minst 1.";

    const isSameOriginalSlot = isEdit && originalDate === state.date && originalTime === state.time;
    if (!isSameOriginalSlot && slotCount >= CAPACITY) return "Den valda tiden är fullbokad.";
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const v = validate();
    if (v) { setErr(v); return; }

    try {
      const payload = {
        userId: user?.id ?? 0,
        date: state.date,
        time: state.time,
        guests: state.guests,
        note: state.note ?? "",
      };

      if (isEdit && id) {
        await put(`/bookings/${id}`, payload);
      } else {
        await post("/bookings", payload);
      }
      nav("/bookings");
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

  const isSameOriginalSlot = isEdit && originalDate === state.date && originalTime === state.time;
  const isSlotFull = slotCount >= CAPACITY && !isSameOriginalSlot;

  return (
    <Container className="py-4" style={{ maxWidth: 560 }}>
      <h1 className="h4 mb-3">{isEdit ? "Redigera bokning" : "Ny bokning"}</h1>
      {err && <Alert variant="danger">{err}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Datum</Form.Label>
          <Form.Control
            type="date"
            value={state.date}
            min={todayStr}
            max={maxDateStr}
            onChange={(e) => update("date", e.target.value)}
            placeholder={todayStr}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tid</Form.Label>
          <Form.Select
            value={state.time}
            onChange={(e) => update("time", e.target.value)}
            required
          >
            <option value="">Välj tid</option>
            {times.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Form.Select>
          <div className="mt-2">
            <Badge bg={isSlotFull ? "danger" : "secondary"}>
              {slotCount}/{CAPACITY} bord bokade
            </Badge>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gäster</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={state.guests}
            onChange={(e) => update("guests", Number(e.target.value))}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notering</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={state.note ?? ""}
            onChange={(e) => update("note", e.target.value)}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" disabled={isSlotFull}>
            {isEdit ? "Spara" : "Skapa"}
          </Button>
          <Button variant="secondary" onClick={() => nav("/bookings")}>
            Avbryt
          </Button>
        </div>
      </Form>
    </Container>
  );
}
