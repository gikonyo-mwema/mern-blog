import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.trim(),
    }));

    // Clear previous error message when user edits input
    if (errorMessage) {
      dispatch(signInFailure(null));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Simple client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      return dispatch(signInFailure("Please fill in all fields."));
    }

    if (!emailRegex.test(email)) {
      return dispatch(signInFailure("Please enter a valid email address."));
    }

    if (password.length < 6) {
      return dispatch(signInFailure("Password must be at least 6 characters."));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorText = "Something went wrong.";
        if (res.status === 401) errorText = "Invalid credentials. Please try again.";
        else if (res.status === 500) errorText = "Server error. Please try again later.";
        else if (data?.message) errorText = data.message;

        return dispatch(signInFailure(errorText));
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.error("Sign-in error:", err);
      dispatch(signInFailure("Network error. Please check your connection."));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Section */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-lg text-white">
              Ecodeed
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5 text-gray-600 dark:text-gray-300">
            Welcome to Ecodeed Blog! Sign in to join our community and share
            your thoughts on sustainable living and environmental conservation.
            You can sign in with your email and password or with Google.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" value="Your email" className="text-gray-700 dark:text-gray-300" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                value={formData.email}
                required
                className="border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <Label htmlFor="password" value="Your password" className="text-gray-700 dark:text-gray-300" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                value={formData.password}
                required
                className="border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5 text-gray-600 dark:text-gray-300">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
