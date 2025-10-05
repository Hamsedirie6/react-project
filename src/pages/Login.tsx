import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button, Form, Alert, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/"; // <- Start som fallback

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav(from, { replace: true }); // <- tillbaka eller Start
    } catch (e: any) {
      setErr(e.message ?? "Fel vid inloggning");
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 420 }}>
      <h1 className="h3 mb-3">Logga in</h1>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>E-post</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} required type="email" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Lösenord</Form.Label>
          <Form.Control value={password} onChange={e => setPassword(e.target.value)} required type="password" />
        </Form.Group>
        <Button type="submit" className="w-100">Logga in</Button>
      </Form>
    </Container>
  );
}
