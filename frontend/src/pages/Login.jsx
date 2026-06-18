import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-3xl shadow-md p-8">

      
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back!
        </h1>

        <p className="text-gray-600 mb-8">
          Sign in to continue shopping
        </p>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          By signing in, you agree to our Terms & Conditions and Privacy Policy.
        </p>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;