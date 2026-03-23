/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addBooking } from "../core/booked/bookSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { bookingCarId, updateBooking } from "../core/booked/bookService";
import { createNotification } from "../core/notification/notificationService";
import { getUserNotifications } from "../core/notification/notificationSlice";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const BookNow: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.users.user);
  const booking = useAppSelector((state) => state.bookings);
  const dispatch = useAppDispatch();

  const [localCar, setLocarCar] = useState<any>(() => {
    const data = localStorage.getItem("marentBookNowCar");
    return data ? JSON.parse(data) : { days: 0 };
  });

  const [form, setForm] = useState({
    firstName: user?.firstName ? user?.firstName : "",
    lastName: user?.lastName ? user?.lastName : "",
    email: user?.email ? user?.email : "",
    phone: user?.phoneNumber ? user?.phoneNumber : "",
    address: user?.address ? user?.address : "",
    city: user?.city ? user?.city : "",
    state: user?.state ? user?.state : "",
    zip: user?.zip ? user?.zip : "",
    license: "",
    pickupLocation: localCar.pickup ? localCar.pickup : "",
    dropoffLocation: localCar.dropoff ? localCar.dropoff : "",
    pickupDate: "",
    dropoffDate: "",
    payment: "card",
    notes: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.firstName.trim()) {
      toast.error("First name is required!");
      return null;
    }
    if (!form.lastName.trim()) {
      toast.error("LastName name is required!");
      return null;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required!");
      return null;
    }
    if (!form.address.trim()) {
      toast.error("Address is required!");
      return null;
    }
    if (!form.city.trim()) {
      toast.error("City is required!");
      return null;
    }
    if (!form.state.trim()) {
      toast.error("State is required!");
      return null;
    }
    if (!form.zip.trim()) {
      toast.error("Zipcode is required!");
      return null;
    }
    if (!form.license.trim()) {
      toast.error("Driving licence number is required!");
      return null;
    }
    if (!form.pickupDate.trim()) {
      toast.error("Pickup date is required!");
      return null;
    }
    if (!form.dropoffDate.trim()) {
      toast.error("Dropoff date is required!");
      return null;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      license: form.license,
      pickupLocation: form.pickupLocation,
      dropoffLocation: form.dropoffLocation,
      pickupDate: form.pickupDate,
      dropoffDate: form.dropoffDate,
      paymentMethod: form.payment,
      paymentStatus: "pending",
      notes: form.notes,
      status: "pending",
      estimatedPrice: estimatePrice,
      createdAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
      time: new Date().toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),

      bookedCar: localCar,
    };

    dispatch(addBooking({ userId: user?.userId, bookingData: payload }))
      .unwrap()
      .then(() => {
        if (form.payment === "card") {
          initializePaystackPayment(payload);
        } else {
          toast.success(
            "Car booked successfully! Please prepare cash on delivery!",
          );
          setTimeout(() => {
            navigate("/my-bookings");
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const initializePaystackPayment = (booking: any) => {
    if (!window.PaystackPop) {
      console.error("Paystack not loaded");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: "pk_test_c075b3f482a9a757a8c83aa8868ba5852fc9a255", // Replace with your Paystack public key,
      name: `${booking.firstName} ${booking.lastName}`,
      email: booking.email,
      amount: booking.estimatedPrice * 100, // Paystack expects amount in kobo
      currency: "NGN",
      ref: `ref_${Date.now()}`, // Unique reference for the transaction
      callback: (_response: any) => {
        // Handle successful payment here
        (async () => {
          await updateBooking(bookingCarId, { paymentStatus: "paid" });
          toast.success("Payment successful!");
          navigate("/my-bookings");

          const notPayload = {
            type: "Online Payment",
            adminMsg: `${booking.firstName} ${booking.lastName} make payment through online payment for booking of ${booking.bookedCar.name} car.`,
            clientMsg: `You just make online payment for booking of ${booking.bookedCar.name} car.`,
          };

          createNotification(notPayload).then(() => {
            dispatch(getUserNotifications());
          });
        })();
      },
      onClose: () => {
        // Handle payment cancellation here
        toast.info("Payment cancelled.");
      },
    });

    handler.openIframe();
  };

  const discountPrice = useMemo(() => {
    return localCar?.price - (localCar?.price * localCar?.discount) / 100;
  }, [localCar?.discount, localCar?.price]);

  const estimatePrice = useMemo(() => {
    return discountPrice * localCar?.days;
  }, [discountPrice, localCar?.days]);

  const handleIncreaseDay = () => {
    const updateCar = {
      ...localCar,
      days: (localCar.days || 0) + 1,
    };

    setLocarCar(updateCar);

    localStorage.setItem("marentBookNowCar", JSON.stringify(updateCar));
  };

  const handleDecreaseDay = () => {
    if (localCar.days > 1) {
      const updatedCar = {
        ...localCar,
        days: Math.max((localCar.days || 0) - 1, 0),
      };

      setLocarCar(updatedCar);

      localStorage.setItem("marentBookNowCar", JSON.stringify(updatedCar));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      firstName: user?.firstName ? user?.firstName : "",
      lastName: user?.lastName ? user?.lastName : "",
      email: user?.email ? user?.email : "",
      phone: user?.phoneNumber ? user?.phoneNumber : "",
      address: user?.address ? user?.address : "",
      city: user?.city ? user?.city : "",
      state: user?.state ? user?.state : "",
      zip: user?.zip ? user?.zip : "",
      license: "",
      pickupLocation: localCar?.pickup ? localCar?.pickup : "",
      dropoffLocation: localCar?.dropoff ? localCar?.dropoff : "",
      pickupDate: "",
      dropoffDate: "",
      payment: "card",
      notes: "",
    });
  }, [
    localCar?.dropoff,
    localCar?.pickup,
    user?.address,
    user?.city,
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.phoneNumber,
    user?.state,
    user?.zip,
  ]);

  return (
    <div className="pt-20">
      <Banner2
        title="Book now"
        subTitle="Reserve your rental in minutes"
        description="Share your details so we can confirm availability, prepare
          the vehicle, and get you on the road."
      />

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-2">Client information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-6">
                Provide contact details and pickup preferences for your rental.
              </p>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.firstName}
                      onChange={(event) =>
                        handleChange("firstName", event.target.value)
                      }
                      placeholder="Alex"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.lastName}
                      onChange={(event) =>
                        handleChange("lastName", event.target.value)
                      }
                      placeholder="Johnson"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.email}
                      disabled
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.phone}
                      onChange={(event) =>
                        handleChange("phone", event.target.value)
                      }
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                    Driver license number
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={form.license}
                    onChange={(event) =>
                      handleChange("license", event.target.value)
                    }
                    placeholder="D123-456-7890"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Pickup location
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled
                      value={form.pickupLocation}
                      onChange={(event) =>
                        handleChange("pickupLocation", event.target.value)
                      }
                      placeholder="Downtown hub"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Dropoff location
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled
                      value={form.dropoffLocation}
                      onChange={(event) =>
                        handleChange("dropoffLocation", event.target.value)
                      }
                      placeholder="Airport terminal"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Pickup date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.pickupDate}
                      onChange={(event) =>
                        handleChange("pickupDate", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Dropoff date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.dropoffDate}
                      onChange={(event) =>
                        handleChange("dropoffDate", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                    Home address
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={form.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
                    placeholder="74 MKO Abiola Road"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.city}
                      onChange={(event) =>
                        handleChange("city", event.target.value)
                      }
                      placeholder="Ikeja"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.state}
                      onChange={(event) =>
                        handleChange("state", event.target.value)
                      }
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      ZIP code
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.zip}
                      onChange={(event) =>
                        handleChange("zip", event.target.value)
                      }
                      placeholder="112233"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                    Payment method
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { id: "card", label: "Card" },
                      { id: "cash", label: "Pay at pickup" },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer ${
                          form.payment === option.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 dark:border-gray-100 text-gray-600 dark:text-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={form.payment === option.id}
                          onChange={(event) =>
                            handleChange("payment", event.target.value)
                          }
                          className="accent-blue-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                    Additional requests
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={4}
                    value={form.notes}
                    onChange={(event) =>
                      handleChange("notes", event.target.value)
                    }
                    placeholder="Child seat, GPS, flexible pickup time..."
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    variant="primary"
                    disabled={booking.loading}
                    className="rounded-full px-8 py-3 disabled:bg-gray-500 disabled:cursor-no-drop"
                  >
                    {booking.loading ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader /> Loading...
                      </span>
                    ) : (
                      <span> Submit Booking</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">Booking summary</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-200">
                  <div className="flex items-center justify-between">
                    <span>Vehicle</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {localCar?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily rate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      #{discountPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated days</span>
                    <div className="w-fit flex gap-2">
                      <button
                        className="bg-transparent text-lg"
                        type="button"
                        onClick={() => handleDecreaseDay()}
                      >
                        <i className="fa fa-minus-circle"></i>
                      </button>
                      <span className="font-semibold text-gray-900 dark:text-gray-100 border border-gray-500 py-0.5 px-1  rounded-sm">
                        {localCar?.days}
                      </span>
                      <button
                        className="bg-transparent text-lg"
                        onClick={() => handleIncreaseDay()}
                      >
                        <i className="fa fa-plus-circle"></i>
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-200 dark:border-gray-500 pt-3 flex items-center justify-between text-base">
                    <span>Total estimate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      #{estimatePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">Need help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  Our support team can help you confirm availability or update
                  your reservation details.
                </p>
                <div className="rounded-xl bg-blue-50 dark:bg-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                  Call us: +1 (555) 203-9988
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookNow;
