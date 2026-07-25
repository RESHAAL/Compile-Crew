import { Outlet } from "react-router-dom";
import { useDiagnosis } from "../context/DiagnosisContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LanguageModal from "./LanguageModal";

export default function Layout() {
  const { languageChosen } = useDiagnosis();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {!languageChosen && <LanguageModal />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
