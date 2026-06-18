function Navbar() {
  return (
    <nav className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold">
          JioMart
        </h1>

        <input
          type="text"
          placeholder="Search products..."
          className="w-96 px-4 py-2 rounded-lg bg-white text-black outline-none"
        />

        <div className="flex gap-6">
          <button>Login</button>
          <button>Cart</button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;