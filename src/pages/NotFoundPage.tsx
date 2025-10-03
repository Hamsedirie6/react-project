import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const path = useLocation().pathname;

  return (
    <>
      <h2>Sidan kunde inte hittas (404)</h2>
      <p>
        Tyvärr finns det ingen sida som matchar adressen:
      </p>
      <p><strong>{path}</strong></p>
      <p>
        Gå tillbaka till <Link to="/">startsidan</Link>.
      </p>
    </>
  );
}
