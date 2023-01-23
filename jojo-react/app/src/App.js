import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailOrderPage from "./pages/DetailOrderPage";
import HomePage from "./pages/HomePage";
import UploadXMLPage from "./pages/UploadXMLPage";
import BetterUploadPage from "./pages/BetterUploadPage";

const Navbar = () => {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/upload">Upload</a>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        {/* <Route exact path="/upload" element={<UploadXMLPage />} /> */}
        <Route exact path="/upload" element={<BetterUploadPage />} />
        <Route exact path="/order/:id" element={<DetailOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
