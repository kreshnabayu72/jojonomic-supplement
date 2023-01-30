import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailOrderPage from "./pages/DetailOrderPage";
import HomePage from "./pages/HomePage";
import UploadXMLPage from "./pages/UploadXMLPage";
import BetterUploadPage from "./pages/BetterUploadPage";
import BagiOrderPage from "./pages/BagiOrderPage";

const Navbar = () => {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/upload">Upload</a>
      <a href="/bagi-order">Bagi Order</a>
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
        <Route exact path="/bagi-order" element={<BagiOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
