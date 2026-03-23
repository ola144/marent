import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../core/auth/authSlice";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isNavMenu, setIsNavMenu] = useState<boolean>(false);
  const [isProfilePopup, setIsProfilePopup] = useState<boolean>(false);
  const [isConfirmLogoutPopup, setIsConfirmLogoutPopup] =
    useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const auth = useAppSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.users.user);
  const allNotification = useAppSelector(
    (state) => state.notification.allNotifications,
  );
  const userNotification = useAppSelector(
    (state) => state.notification.userNotifications,
  );

  const allUnreadNotification = useMemo(() => {
    return allNotification.filter((n) => !n.isAdminRead);
  }, [allNotification]);

  const userUnreadNotification = useMemo(() => {
    return userNotification.filter((n) => !n.isClientRead);
  }, [userNotification]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleMobileNav = () => {
    if (navRef.current?.classList.contains("showNavMenu")) {
      navRef.current.classList.remove("showNavMenu");
      setIsNavMenu(false);
    } else {
      navRef.current?.classList.add("showNavMenu");
      setIsNavMenu(true);
    }
    if (isProfilePopup) setIsProfilePopup(false);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(logout())
      .then(() => {
        setIsProfilePopup(false);
        setIsConfirmLogoutPopup(false);

        localStorage.removeItem("marentUser");
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleProfilePopup = () => {
    setIsProfilePopup(!isProfilePopup);
  };

  return (
    <>
      <nav className="bg-white text-black dark:bg-gray-900 dark:text-white shadow-md dark:shadow-white fixed top-0 left-0 w-full z-[1000]">
        <div className="parent">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-blue-600">
                MARENT
              </Link>
            </div>
            <div className="hidden md:flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-white hover:text-blue-600 ${isActive ? "border-b-black border-b dark:border-b-white" : ""}`
                }
                onClick={() => setIsProfilePopup(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-white hover:text-blue-600 ${isActive ? "border-b-black border-b dark:border-b-white" : ""}`
                }
                onClick={() => setIsProfilePopup(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-gray-700 dark:text-white hover:text-blue-600 ${isActive ? "border-b-black border-b dark:border-b-white" : ""}`
                }
                onClick={() => setIsProfilePopup(false)}
              >
                Contact
              </NavLink>
              {auth?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-gray-700 dark:text-white hover:text-blue-600 ${isActive ? "border-b-black border-b dark:border-b-white" : ""}`
                  }
                  onClick={() => setIsProfilePopup(false)}
                >
                  Dashboard
                </NavLink>
              )}
            </div>
            <div className="flex items-center space-x-2 relative">
              {!auth?.userId ? (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-block"
                    onClick={() => {
                      if (isNavMenu) toggleMobileNav();
                    }}
                  >
                    <Button variant="secondary">Sign in</Button>
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden sm:inline-block"
                    onClick={() => {
                      if (isNavMenu) toggleMobileNav();
                    }}
                  >
                    <Button variant="primary">Sign up</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-full bg-gray-400 text-white dark:bg-white dark:text-black text-lg size-10 flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-100"
                      onClick={handleProfilePopup}
                    >
                      <span className="sr-only">User Icon</span>
                      {/* <i className="fa fa-user"></i> */}
                      {user?.avatar ? (
                        <img
                          src={user?.avatar}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg dark:text-gray-500 font-semibold text-white">
                          {user?.firstName && user?.firstName.slice(0, 1)}
                          {user?.lastName && user?.lastName.slice(0, 1)}
                        </span>
                      )}
                    </button>
                    {auth?.role === "client" ? (
                      <>
                        <Link
                          to="/notifications"
                          className="p-2 rounded-full bg-gray-400 text-white dark:bg-white dark:text-black text-xl size-10 flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-100"
                          onClick={() => setIsProfilePopup(false)}
                        >
                          <span className="sr-only">Notification Icon</span>
                          <div className="relative">
                            <i className="fa fa-bell"></i>

                            <span className="font-semibold text-white bg-red-500 absolute top-0 -right-2 size-4 p-2 text-xs rounded-full flex items-center justify-center">
                              {userUnreadNotification.length}
                            </span>
                          </div>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/admin/notifications"
                          className="p-2 rounded-full bg-gray-400 text-white dark:bg-white dark:text-black text-xl size-10 flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-100"
                          onClick={() => setIsProfilePopup(false)}
                        >
                          <span className="sr-only">Notification Icon</span>
                          <div className="relative">
                            <i className="fa fa-bell"></i>

                            <span className="font-semibold text-white bg-red-500 absolute top-0 -right-2 size-4 p-2 text-xs rounded-full flex items-center justify-center">
                              {allUnreadNotification.length}
                            </span>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>

                  {isProfilePopup && (
                    <div
                      className="bg-white dark:bg-gray-600 flex flex-col gap-3 p-3 w-[200px] absolute right-0 top-12 z-[9000] transition-all duration-300 "
                      data-aos="fade-in"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-1 text-lg bg-transparent text-gray-600 dark:text-white text-[10px]"
                        onClick={() => setIsProfilePopup(false)}
                      >
                        <i className="fa fa-user"></i>
                        <span>My Profile</span>
                      </Link>
                      {auth?.role === "client" && (
                        <>
                          <Link
                            to="/my-feedbacks"
                            className="flex items-center gap-1 text-lg bg-transparent text-gray-600 dark:text-white"
                            onClick={() => setIsProfilePopup(false)}
                          >
                            <i className="fa fa-mail-reply"></i>
                            <span>My Feedbacks</span>
                          </Link>
                          <Link
                            to="/my-bookings"
                            className="flex items-center gap-1 text-lg bg-transparent text-gray-600 dark:text-white"
                            onClick={() => setIsProfilePopup(false)}
                          >
                            <i className="fa fa-briefcase"></i>
                            <span>My Booked</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-1 text-lg bg-transparent text-gray-600 dark:text-white"
                            onClick={() => setIsProfilePopup(false)}
                          >
                            <i className="fa fa-heart-o"></i>
                            <span>My Wishlist</span>
                          </Link>
                        </>
                      )}
                      <button
                        className="flex items-center gap-1 text-lg bg-transparent"
                        onClick={() => {
                          setIsConfirmLogoutPopup(true);
                          setIsProfilePopup(false);
                        }}
                      >
                        <i className="fa fa-sign-out"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="md:hidden">
              {/* mobile menu button */}
              {isNavMenu ? (
                <button
                  className="px-2 py-1 rounded-md text-lg dark:bg-gray-100 dark:text-black bg-gray-600 text-gray-50"
                  onClick={() => toggleMobileNav()}
                >
                  <i className="fa fa-close"></i>
                </button>
              ) : (
                <button
                  className="px-2 py-1 rounded-md text-lg dark:bg-gray-100 dark:text-black bg-gray-600 text-gray-50"
                  onClick={() => toggleMobileNav()}
                >
                  <i className="fa fa-navicon"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className="md:hidden block bg-white dark:bg-gray-900 w-full h-fit px-10 py-5 transition-all duration-300 absolute -top-96 overflow-y-hidden z-[900]"
          ref={navRef}
        >
          <div className="flex flex-col gap-4 justify-center w-full items-center">
            <Link
              to="/"
              className="text-gray-700 dark:text-white hover:text-blue-600"
              onClick={() => toggleMobileNav()}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-white hover:text-blue-600"
              onClick={() => toggleMobileNav()}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-white hover:text-blue-600"
              onClick={() => toggleMobileNav()}
            >
              Contact
            </Link>
            {auth?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-white hover:text-blue-600"
                onClick={() => toggleMobileNav()}
              >
                Dashboard
              </Link>
            )}
            {!auth?.userId && (
              <>
                <Link
                  to="/login"
                  className="sm:hidden block"
                  onClick={() => toggleMobileNav()}
                >
                  <Button variant="secondary">Sign in</Button>
                </Link>
                <Link
                  to="/signup"
                  className="sm:hidden block"
                  onClick={() => toggleMobileNav()}
                >
                  <Button variant="primary">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {isNavMenu && (
          <div
            className="bg-black/50 h-screen w-full fixed inset-0 top-14 md:hidden"
            onClick={() => toggleMobileNav()}
          ></div>
        )}
      </nav>
      {isProfilePopup && (
        <div
          className="bg-black/50 dark:bg-black/90 fixed inset-0 w-full h-screen z-[900] transition-all duration-300"
          data-aos="fade-in"
          onClick={handleProfilePopup}
        ></div>
      )}

      {isConfirmLogoutPopup && (
        <div className="fixed bg-black/50 flex items-center justify-center h-screen w-full -top-5 inset-0 z-[1000] px-10">
          <div className="bg-white dark:bg-gray-500 text-center flex items-center justify-center w-full max-w-[500px] h-[150px] rounded-md">
            <div className="flex flex-col gap-2">
              <p className="dark:text-white text-gray-500">
                Are you sure want to logout?
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button variant="primary" onClick={handleLogout}>
                  Logout
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsConfirmLogoutPopup(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
