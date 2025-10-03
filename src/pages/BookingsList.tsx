import { useEffect, useState } from "react";
import { get, del } from "../api/client";
import type { Booking } from "../types";
import { Button, Container, Table, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BookingsList() {
  const [items, setItems] = useState<Booking[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuth();

  async function load() {
    if (!user) return;
    try {
      const url =
        user.role === "admin"
          ? "/api/bookings"
          : `/api/bookings?userId=${encodeURIComponent(String(user.id))}`;

      const data = await get<Booking[]>(url);

      
      const safeData =
        user.role === "admin" ? data : data.filter((b) => b.userId === user.id);

      setItems(safeData);
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte hämta bokningar");
    }
  }

  useEffect(() => {
    load();
  }, [user]);

  async function onDelete(id: number) {
    if (!confirm("Ta bort bokning?")) return;
    try {
      await del(`/api/bookings/${id}`);
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Kunde inte ta bort");
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Bokningar</h1>
        <div>
          {user && <Link to="/bookings/new" className="btn btn-primary">Ny bokning</Link>}
        </div>
      </div>

      {err && <Alert variant="danger">{err}</Alert>}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Datum</th>
            <th>Tid</th>
            <th>Gäster</th>
            <th>Notering</th>
            <th>UserId</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {items.map(b => {
            const canEdit = !!user && (user.role === "admin" || user.id === b.userId);
            const canDelete = canEdit;

            return (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.guests}</td>
                <td>{b.note ?? ""}</td>
                <td>{b.userId}</td>
                <td className="d-flex gap-2">
                  {canEdit && (
                    <Link
                      to={`/bookings/${b.id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Redigera
                    </Link>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => onDelete(b.id)}
                    >
                      Ta bort
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr><td colSpan={7} className="text-center">Inga bokningar ännu</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
