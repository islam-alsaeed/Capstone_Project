import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import AddEmployee from "./pages/AddEmployee";
// import Camera from "./pages/Camera";
// import Recognition from "./pages/Recognition";
// import Employees from "./pages/Employees";
import Home from "./pages/Home";
// import Login from "./components/Login";
import Login from "./pages/LoginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {
          <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
