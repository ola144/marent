import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { register } from "../core/auth/authSlice";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const [signup, setSignup] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "client",
  });

  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [togglePasswordConfirm, setTogglePasswordConfirm] =
    useState<boolean>(false);

  const handleOnChange = (name: string, value: string) => {
    setSignup((f) => ({ ...f, [name]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.warning("You must accept the terms before continuing!");
      return;
    }

    const payload = {
      ...signup,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      avatar: "",
    };

    const user = dispatch(register(payload)).unwrap();

    user
      .then(() => {
        toast.success("Signup successfully!");
        setSignup({
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          firstName: "",
          lastName: "",
          role: "client",
        });

        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message);
        // toast.error("Something went wrong. Please try again!");
      });
  };

  const handleTogglePassword = () => {
    setTogglePassword((prev) => !prev);
  };

  const handleTogglePasswordConfirm = () => {
    setTogglePasswordConfirm((prev) => !prev);
  };

  return (
    <div className="pt-20">
      <Banner2
        title="Get started"
        subTitle="Create your Marent account"
        description="Join thousands of drivers booking premium rentals with flexible
              pickup locations."
      ></Banner2>

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-500 p-8">
              <h3 className="text-2xl font-bold mb-6">Sign up</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={signup.firstName}
                      onChange={(e) =>
                        handleOnChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Johnson"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={signup.lastName}
                      required
                      onChange={(e) =>
                        handleOnChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={signup.email}
                    onChange={(e) => handleOnChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={signup.phoneNumber}
                    onChange={(e) =>
                      handleOnChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={togglePassword ? "text" : "password"}
                      required
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={signup.password}
                      onChange={(e) =>
                        handleOnChange("password", e.target.value)
                      }
                    />
                    <button
                      className="bg-transparent"
                      type="button"
                      onClick={() => handleTogglePassword()}
                    >
                      {togglePassword ? (
                        <i className="fa fa-eye-slash absolute right-2 top-3.5"></i>
                      ) : (
                        <i className="fa fa-eye absolute right-2 top-3.5"></i>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={togglePasswordConfirm ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={signup.confirmPassword}
                      onChange={(e) =>
                        handleOnChange("confirmPassword", e.target.value)
                      }
                    />
                    <button
                      className="bg-transparent"
                      type="button"
                      onClick={() => handleTogglePasswordConfirm()}
                    >
                      {togglePasswordConfirm ? (
                        <i className="fa fa-eye-slash absolute right-2 top-3.5"></i>
                      ) : (
                        <i className="fa fa-eye absolute right-2 top-3.5"></i>
                      )}
                    </button>
                  </div>

                  {signup.password !== signup.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      Your passwords don’t match. Check and re-enter.
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-white">
                  <input
                    type="checkbox"
                    className="mt-1 rounded"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the
                    <Link to="/terms"> Terms & Conditions </Link>
                    and <Link to="/privacy">Privacy Policy.</Link>
                  </span>
                </div>
                <Button
                  className="w-full rounded-full  py-3 disabled:bg-gray-500 disabled:cursor-no-drop"
                  type="button"
                  variant="primary"
                  onClick={handleSignup}
                  disabled={
                    auth.loading ||
                    !signup.email ||
                    !signup.password ||
                    !signup.firstName ||
                    !signup.lastName ||
                    !signup.phoneNumber ||
                    !signup.confirmPassword ||
                    signup.password !== signup.confirmPassword
                  }
                >
                  {auth.loading ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader />
                      Loading...
                    </span>
                  ) : (
                    <span>Create Account</span>
                  )}
                </Button>
              </form>
              <div className="mt-6 text-sm text-gray-600 dark:text-white">
                Already have an account?{" "}
                <Link
                  className="text-blue-600 dark:text-blue-100 font-semibold"
                  to="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Why create an account?
              </h2>
              <p className="text-gray-600 dark:text-white mb-6">
                Build your profile once and enjoy faster bookings, saved
                preferences, and dedicated support from the Marent team.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Personalized offers",
                    body: "Get notified about cars and discounts tailored to your travel style.",
                  },
                  {
                    title: "Flexible reservations",
                    body: "Modify or extend bookings directly from your dashboard.",
                  },
                  {
                    title: "Trusted by drivers",
                    body: "Secure verification and protected payments for every rental.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-100 dark:border-gray-500 dark:bg-gray-700 bg-white p-5 shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-100 mt-2">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
