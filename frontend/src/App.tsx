import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RegisterUserPage from "./pages/RegisterUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/register" element={<RegisterUserPage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </>
          /* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/recognition" element={<Recognition />} />
          <Route path="/employees" element={<Employees />} /> */
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
