import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login } from "../core/auth/authSlice";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import Loader from "../components/Loader";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleOnChange = (name: string, value: string | boolean) => {
    setUserLogin((f) => ({ ...f, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await dispatch(login(userLogin)).unwrap();

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }

    setUserLogin({
      email: "",
      password: "",
      remember: false,
    });
  };

  const handleTogglePassword = () => {
    setTogglePassword((prev) => !prev);
  };

  return (
    <div className="pt-20">
      <Banner2
        title="Welcome back"
        subTitle="Sign in to manage your rentals"
        description="Track reservations, save favorite cars, and access exclusive offers for members."
      ></Banner2>

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Member benefits</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enjoy faster checkout, personalized recommendations, and 24/7
                support whenever you are on the road.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Faster booking in one click",
                  "Priority support during trips",
                  "Exclusive weekly deals",
                  "Saved payment methods",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-gray-100 dark:border-gray-400 bg-white dark:bg-gray-500 p-5 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-100 mt-2">
                      Stay organized with a single place for every reservation.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-600 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-500 dark:broder-gray-500 p-8">
              <h3 className="text-2xl font-bold mb-6">Sign in</h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={userLogin.email}
                    onChange={(e) => handleOnChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={togglePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={userLogin.password}
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
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 dark:text-gray-50">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={userLogin.remember}
                      onChange={(e) =>
                        handleOnChange("remember", e.target.checked)
                      }
                    />
                    Remember me
                  </label>
                  {/* <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button> */}
                </div>
                <Button
                  className="w-full rounded-full py-4 disabled:bg-gray-500 disabled:cursor-no-drop"
                  type="button"
                  onClick={handleLogin}
                  disabled={
                    auth.loading || !userLogin.email || !userLogin.password
                  }
                  variant="primary"
                >
                  {auth.loading ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader />
                      Loading...
                    </span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </Button>
              </form>
              <div className="mt-6 text-sm text-gray-600 dark:text-white">
                New to Marent?{" "}
                <Link
                  className="text-blue-600 dark:text-blue-50 font-semibold"
                  to="/signup"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
