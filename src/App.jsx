import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./components/NavBar/Navbar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { UserContext } from "./contexts/UserContext.jsx";

// Renamed service file (still returns items from /items)
import * as registryService from "./services/registryService.js";

// Renamed components
import RegistryList from "./components/RegistryList/RegistryList.jsx";
import RegistryDetails from "./components/RegistryDetails/RegistryDetails.jsx";
import RegistryForm from "./components/RegistryForm/RegistryForm.jsx";

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]); // keeping state name for now
  const navigate = useNavigate();

  const fetchAllItems = async () => {
    const data = await registryService.index();
    setHoots(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (user) fetchAllItems();
    if (!user) setHoots([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // CREATE
  const handleAddHoot = async (formData) => {
    const newItem = await registryService.create(formData);
    setHoots((prev) => [newItem, ...prev]);
    navigate("/items");
  };

  // DELETE
  const handleDeleteHoot = async (hootId) => {
    const deletedItem = await registryService.deleteHoot(hootId);
    setHoots((prev) => prev.filter((item) => item.id !== deletedItem.id));
    navigate("/items");
  };

  // UPDATE
  const handleUpdateHoot = async (hootId, formData) => {
    const updatedItem = await registryService.updateHoot(hootId, formData);
    setHoots((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    navigate(`/items/${hootId}`);
  };

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />

        {user ? (
          <>
            {/* LIST */}
            <Route path="/items" element={<RegistryList hoots={hoots} />} />

            {/* SHOW */}
            <Route
              path="/items/:hootId"
              element={
                <RegistryDetails handleDeleteHoot={handleDeleteHoot} />
              }
            />

            {/* CREATE */}
            <Route
              path="/items/new"
              element={<RegistryForm handleAddHoot={handleAddHoot} />}
            />

            {/* EDIT */}
            <Route
              path="/items/:hootId/edit"
              element={<RegistryForm handleUpdateHoot={handleUpdateHoot} />}
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


