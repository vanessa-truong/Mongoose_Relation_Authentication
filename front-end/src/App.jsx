import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { User } from "../pages/User";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Nav />} />
        <Route path="/userprofil" element={<User />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
