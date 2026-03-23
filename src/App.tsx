/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SearchForm } from "./components/SearchForm";
import { Footer } from "./components/Footer";
import "./index.css";
import PopularCar from "./components/PopularCar";
import RecommendedCar from "./components/RecommendedCar";
import AllCars from "./pages/AllCars";
import Contact from "./pages/Contact";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Featured from "./pages/Featured";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Partnership from "./pages/Partnership";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchResults from "./pages/SearchResults";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./pages/AdminLayout";
import AdminCars from "./pages/AdminCars";
import AdminCustomers from "./pages/AdminCustomers";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import AdminBookings from "./pages/AdminBookings";
import Wishlist from "./pages/Wishlist";
import AdminRoute from "./components/AdminRoute";
import useTheme from "./core/hooks/useTheme";
import { fetchCars } from "./core/car/carSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { getWishlist } from "./core/wishlist/wishlistSlice";
import Profile from "./pages/Profile";
import { getSingleUser } from "./core/auth/userSlice";
import BookNow from "./pages/BookNow";
import MyBookings from "./pages/MyBookings";
import MyFeedbacks from "./pages/MyFeedbacks";
import MyNotifications from "./pages/MyNotifications";
import AdminNotifications from "./pages/AdminNotifications";
import { fetchAllBookings, getBooking } from "./core/booked/bookSlice";
import { setOffline, setOnline } from "./core/appSlice/appSlice";
import { toast } from "react-toastify";
import { fetchAllContacts } from "./core/contact/contactSlice";
import {
  fetchAllNotifications,
  getUserNotifications,
} from "./core/notification/notificationSlice";

function HomePage() {
  const [filters, setFilters] = useState({
    pickup: "",
    dropoff: "",
    category: "",
    date: "",
  });
  const navigate = useNavigate();

  const handleFilterChange = (name: string, value: string) => {
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.pickup) params.set("pickup", filters.pickup);
    if (filters.dropoff) params.set("dropoff", filters.dropoff);
    if (filters.category) params.set("category", filters.category);
    if (filters.date) params.set("date", filters.date);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main className="parent pt-20">
      <Hero />
      <SearchForm
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <PopularCar></PopularCar>
      <RecommendedCar></RecommendedCar>
    </main>
  );
}

function App() {
  const { toggleTheme, theme } = useTheme();

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.user);

  const handleAPICallMethod = () => {
    dispatch(fetchCars())
      .unwrap()
      .then(() => {})
      .catch((error) => {
        toast.error(error.message);
        console.log(error.message);
      });

    const localData = localStorage.getItem("marentUser");
    if (localData !== null) {
      dispatch(getWishlist())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
        });
      dispatch(getBooking())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
        });

      dispatch(getSingleUser(auth?.userId))
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
        });

      dispatch(fetchAllBookings())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
        });

      dispatch(fetchAllContacts())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message);
        });

      dispatch(fetchAllNotifications())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message ?? error);
        });

      dispatch(getUserNotifications())
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error.message ?? error);
        });
    }
  };

  useEffect(() => {
    handleAPICallMethod();

    // handle online and offline
    const handleOffline = () => {
      dispatch(setOffline());
      toast.error("No internet connection ❌");
    };

    const handleOnline = () => {
      dispatch(setOnline());
      toast.success("Back online ✅");
      handleAPICallMethod();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
  }, [auth?.userId, dispatch]);

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <button
        className="fixed bottom-1 right-1 z-[1100] bg-black text-white dark:bg-gray-50 rounded-full
       dark:text-black size-8 flex items-center justify-center"
        onClick={toggleTheme}
      >
        {
          theme === "dark"
            ? "🌞"
            : // <i className="fa fa-sun-o"></i>
              "🌙"
          // <i className="fa fa-moon-o"></i>
        }
      </button>
      <Router>
        <ScrollToTop></ScrollToTop>
        <div className="w-full min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* additional routes can go here */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/all-cars" element={<AllCars />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/book-now" element={<BookNow />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-feedbacks" element={<MyFeedbacks />} />
            <Route path="/notifications" element={<MyNotifications />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
