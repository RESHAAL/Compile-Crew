import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiagnosisProvider } from "./context/DiagnosisContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Predictions from "./pages/Predictions";
import Treatment from "./pages/Treatment";

function App() {
  return (
    <DiagnosisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/treatment" element={<Treatment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiagnosisProvider>
  );
}

export default App;
