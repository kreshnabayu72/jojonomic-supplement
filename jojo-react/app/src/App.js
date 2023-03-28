import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import OldAddBagiOrderPage from "./pages/OldAddBagiOrderPage";
import DetailOrderPage from "./pages/DetailOrderPage";
import HomePage from "./pages/HomePage";
import UploadXMLPage from "./pages/UploadXMLPage";
import AddBagiOrderPage from "./pages/AddBagiOrderPage";
import BagiOrderListPage from "./pages/BagiOrderListPage";
import DetailPemenuhanOrderPage from "./pages/DetailPemenuhanOrderPage";
import LoginPage from "./pages/LoginPage";

function setCookie(cname, cvalue, exphours) {
  const d = new Date();
  d.setTime(d.getTime() + exphours * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const Navbar = () => {
  const nav = useNavigate();
  const logoutHandler = () => {
    setCookie("auth", null, 0);
    nav(0);
  };
  return (
    <nav>
      <a href="/">List Order</a>
      <a href="/upload">Upload</a>
      <a href="/bagi-order">Pembagian Order</a>
      <button onClick={logoutHandler}>Logout</button>
    </nav>
  );
};

function App() {
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  const IsLoggedIn = ({ children }) => {
    const loggedInUser = getCookie("auth") && JSON.parse(getCookie("auth"));

    return loggedInUser ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <IsLoggedIn>
              <Navbar />
              <HomePage />
            </IsLoggedIn>
          }
        />
        <Route exact path="/login" element={<LoginPage />} />
        <Route
          exact
          path="/upload"
          element={
            <IsLoggedIn>
              <Navbar />
              <UploadXMLPage />
            </IsLoggedIn>
          }
        />
        <Route
          exact
          path="/order/:id"
          element={
            <IsLoggedIn>
              <Navbar />
              <DetailOrderPage />
            </IsLoggedIn>
          }
        />
        <Route
          exact
          path="/old-bagi-order"
          element={
            <IsLoggedIn>
              <Navbar />
              <OldAddBagiOrderPage />
            </IsLoggedIn>
          }
        />
        <Route
          exact
          path="/bagi-order"
          element={
            <IsLoggedIn>
              <Navbar />
              <AddBagiOrderPage />
            </IsLoggedIn>
          }
        />
        <Route
          exact
          path="/bagi-order/list"
          element={
            <IsLoggedIn>
              <Navbar />
              <BagiOrderListPage />
            </IsLoggedIn>
          }
        />
        <Route
          exact
          path="/pemenuhanOrder/:id"
          element={
            <IsLoggedIn>
              <Navbar />
              <DetailPemenuhanOrderPage />
            </IsLoggedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
