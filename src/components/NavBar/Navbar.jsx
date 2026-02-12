import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>

          <li>
            <Link to="/items">REGISTRY</Link>
          </li>

          <li>
            <Link to="/items/new">ADD ITEM</Link>
          </li>

          <li>
            <Link to="/" onClick={handleSignOut}>
              SIGN OUT
            </Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>

          <li>
            <Link to="/sign-up">SIGN UP</Link>
          </li>

          <li>
            <Link to="/sign-in">SIGN IN</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

