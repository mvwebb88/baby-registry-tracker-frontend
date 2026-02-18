import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { UserContext } from "./contexts/UserContext.jsx";

import * as registryService from "./services/registryService.js";

import RegistryList from "./components/RegistryList/RegistryList.jsx";
import RegistryDetails from "./components/RegistryDetails/RegistryDetails.jsx";
import RegistryForm from "./components/RegistryForm/RegistryForm.jsx";

const App = () => {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Fetch all registry items
  const fetchAllItems = async () => {
    try {
      const data = await registryService.index();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setItems([]);
    }
  };

  useEffect(() => {
    if (user) fetchAllItems();
    if (!user) setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // CREATE
  const handleAddItem = async (formData) => {
    try {
      const newItem = await registryService.create(formData);
      setItems((prev) => [newItem, ...prev]);
      navigate("/items");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDeleteItem = async (itemId) => {
    try {
      const deletedItem = await registryService.remove(itemId);
      setItems((prev) => prev.filter((item) => item.id !== deletedItem.id));
      navigate("/items");
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE
  const handleUpdateItem = async (itemId, formData) => {
    try {
      const updatedItem = await registryService.update(itemId, formData);

      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );

      navigate(`/items/${itemId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />

        {user ? (
          <>
            {/* LIST */}
            <Route path="/items" element={<RegistryList items={items} />} />

            {/* SHOW */}
            <Route
              path="/items/:itemId"
              element={<RegistryDetails handleDeleteItem={handleDeleteItem} />}
            />

            {/* CREATE */}
            <Route
              path="/items/new"
              element={<RegistryForm handleAddItem={handleAddItem} />}
            />

            {/* EDIT */}
            <Route
              path="/items/:itemId/edit"
              element={<RegistryForm handleUpdateItem={handleUpdateItem} />}
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




