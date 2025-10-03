import { useLocation } from "react-router-dom";
import Header from "./partials/Header";
import Main from "./partials/Main";
import Footer from "./partials/Footer";
import BootstrapBreakpoints from "./parts/BootstrapBreakpoints";
import { AuthProvider } from "./auth/AuthContext";

const showBootstrapBreakpoints = true;

export default function App() {

  useLocation();
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  return (
    <AuthProvider>
      <Header />
      <Main /> 
      <Footer />
      {showBootstrapBreakpoints ? <BootstrapBreakpoints /> : null}
    </AuthProvider>
  );
}
