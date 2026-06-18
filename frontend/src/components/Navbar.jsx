import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1
  className="text-2xl font-bold cursor-pointer"
  onClick={() => navigate("/")}
>
  JioMart
</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="w-96 px-4 py-2 rounded-lg bg-white text-black outline-none"
        />

        <div className="flex gap-6">

          {!token ? (
           <button
  onClick={() => navigate("/login")}
  className="hover:underline transition"
>
  Login
</button>
          ) 
          : (
           <button
  onClick={handleLogout}
  className="hover:underline transition"
>
  Logout
</button>
          )}

          <button
 className="hover:underline transition"
>
  Cart
</button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;