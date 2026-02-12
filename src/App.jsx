import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./components/NavBar/Navbar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { UserContext } from "./contexts/UserContext.jsx";

import * as hootService from "./services/hootService.js";

import HootList from "./components/HootList/HootList.jsx";
import HootDetails from "./components/HootDetails/HootDetails.jsx";
import HootForm from "./components/HootForm/HootForm.jsx";

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  const fetchAllHoots = async () => {
    const hootsData = await hootService.index();
    setHoots(Array.isArray(hootsData) ? hootsData : []);
  };

  useEffect(() => {
    if (user) fetchAllHoots();
    if (!user) setHoots([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);

    // safest update pattern
    setHoots((prev) => [newHoot, ...prev]);

    // optional: refresh from server to guarantee latest
    // await fetchAllHoots();

    navigate("/hoots");
  };

  const handleDeleteHoot = async (hootId) => {
    const deleted = await hootService.deleteHoot(hootId);

    setHoots((prev) => prev.filter((h) => h.id !== deleted.id));

    // optional: refresh from server
    // await fetchAllHoots();

    navigate("/hoots");
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updated = await hootService.updateHoot(hootId, hootFormData);

    setHoots((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));

    // optional: refresh from server
    // await fetchAllHoots();

    navigate(`/hoots/${hootId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />

        {user ? (
          <>
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route
              path="/hoots/:hootId"
              element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}
            />
            <Route
              path="/hoots/new"
              element={<HootForm handleAddHoot={handleAddHoot} />}
            />
            <Route
              path="/hoots/:hootId/edit"
              element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
            />
          </>
        ) : (
          <>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;

