import { AnimatePresence } from "framer-motion";
import { Routes, useLocation, Route } from "react-router-dom";
import Discord from "./callbacks/Discord";
import Login from "./pages/Login";
import SelectAccount from "./pages/SelectAccount";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/callbacks/discord" element={<Discord />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SelectAccount />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
