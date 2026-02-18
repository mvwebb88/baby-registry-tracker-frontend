import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as userService from "../../services/userService";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  if (!user) return <main>Loading...</main>;

  return (
    <main>
      <h1>Welcome, {user.username}</h1>

      {users.map((u) => (
        <p key={u.id}>{u.username}</p>
      ))}
    </main>
  );
};

export default Dashboard;

