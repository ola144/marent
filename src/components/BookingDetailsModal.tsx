/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import type { IBooking } from "../core/car/carType";
import { updateBooking } from "../core/booked/bookService";
import { useAppDispatch } from "../hooks";
import { editCar, fetchCars } from "../core/car/carSlice";
import { toast } from "react-toastify";
import { createNotification } from "../core/notification/notificationService";
import {
  fetchAllNotifications,
  getUserNotifications,
} from "../core/notification/notificationSlice";

type BookingMode = "admin" | "client";

interface BookingDetailsModalProps {
  open: boolean;
  booking: IBooking | null;
  mode: BookingMode;
  onClose: () => void;
  onSaved?: () => void;
}

const statusOptions = [
  "pending",
  "confirmed",
  "in progress",
  "completed",
  "cancelled",
];

const clientStatusOptions = ["pending", "cancelled"];

const paymentStatusOptions = ["pending", "paid", "cancelled"];

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  open,
  booking,
  mode,
  onClose,
  onSaved,
}) => {
  const [savingPaymentStatus, setSavingPaymentStatus] = useState(false);
  const [savingBookingStatus, setSavingBookingStatus] = useState(false);
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!booking) return;
    setStatus(booking.status || "pending");
    setPaymentStatus(booking.paymentStatus || "pending");
  }, [booking]);

  const carSummary = useMemo(() => {
    if (!booking?.bookedCar) return null;
    return {
      id: booking.bookedCar.id,
      name: booking.bookedCar.name,
      category: booking.bookedCar.category,
      people: booking.bookedCar.numberOfPeople,
      price: booking.bookedCar.price,
      image: booking.bookedCar.image,
    };
  }, [booking]);

  console.log(carSummary?.id);

  const handleUpdateBookingStatus = async () => {
    if (!booking) return;
    setSavingBookingStatus(true);

    let userData: any;

    const localData = localStorage.getItem("marentUser");
    if (localData !== null) {
      userData = JSON.parse(localData);
    }

    try {
      if (mode === "admin") {
        await updateBooking(booking.id, { status }).then(() => {
          toast.success("Booking status updated successfully!");

          const notPayload = {
            type: "Update Booking Status",
            adminMsg: `You've updated the car booking status of ${booking.firstName} ${booking.lastName} booking of ${booking.bookedCar.name} to ${status}`,
            clientMsg: `${userData.firstName} ${userData.lastName} has updated your car booking status of ${booking.bookedCar.name} to ${status}`,
            userId: booking.userId,
          };

          createNotification(notPayload).then(() => {
            dispatch(fetchAllNotifications());
          });
        });
      } else {
        await updateBooking(booking.id, { clientStatusOptions }).then(() => {
          toast.success("Booking status updated successfully!");

          const notPayload = {
            type: "Update Booking Status",
            clientMsg: `You've updated your car booking status of ${booking.bookedCar.name} to ${status}`,
            adminMsg: `${userData.firstName} ${userData.lastName} has updated his/her car booking status of ${booking.bookedCar.name} to ${clientStatusOptions}`,
            userId: booking.userId,
          };

          createNotification(notPayload).then(() => {
            dispatch(getUserNotifications());
          });
        });
      }

      if (status === "in progress") {
        try {
          const payload: any = {
            status: false,
          };

          dispatch(editCar({ id: carSummary?.id, carData: payload })).then(
            () => {
              dispatch(fetchCars());
            },
          );
        } catch (error) {
          console.error("Failed to update car", error);
        }
      }

      if (status === "completed") {
        try {
          const payload: any = {
            status: true,
          };

          dispatch(editCar({ id: carSummary?.id, carData: payload })).then(
            () => {
              dispatch(fetchCars());
            },
          );
        } catch (error) {
          console.error("Failed to update car", error);
        }
      }

      onSaved?.();
      onClose();
    } finally {
      setSavingBookingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!booking) return;
    setSavingPaymentStatus(true);

    let userData: any;

    const localData = localStorage.getItem("marentUser");
    if (localData !== null) {
      userData = JSON.parse(localData);
    }

    try {
      if (mode === "admin") {
        await updateBooking(booking.id, { paymentStatus }).then(() => {
          toast.success("Payment status updated successfully!");

          const notPayload = {
            type: "Update Booking Payment Status",
            adminMsg: `You've updated the payment status of ${booking.firstName} ${booking.lastName} booking of ${booking.bookedCar.name} to ${paymentStatus}`,
            clientMsg: `${userData.firstName} ${userData.lastName} has updated your booking payment status of ${booking.bookedCar.name} to ${paymentStatus}`,
            userId: booking.userId,
          };

          createNotification(notPayload).then(() => {
            dispatch(fetchAllNotifications());
          });
        });
      }

      onSaved?.();
      onClose();
    } finally {
      setSavingPaymentStatus(false);
    }
  };

  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div
        className="fixed inset-0 top-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-700 shadow-xl border border-gray-100 dark:border-gray-500 overflow-y-auto h-[600px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-500">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
              Booking Details
            </p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {booking.id}
            </h2>
          </div>
          <button
            className="rounded-full border border-gray-200 dark:border-gray-400 px-3 py-1 text-sm text-black hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 p-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 p-5 bg-white dark:bg-gray-600">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Client Info
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-100">
                <div>
                  <p className="text-xs uppercase text-gray-400">Name</p>
                  <p className="font-medium">
                    {booking.firstName} {booking.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Contact</p>
                  <p className="font-medium">{booking.email}</p>
                  <p>{booking.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">License</p>
                  <p className="font-medium">{booking.license}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Address</p>
                  <p className="font-medium">{booking.address}</p>
                  <p>
                    {booking.city}, {booking.state} {booking.zip}
                  </p>
                </div>
              </div>
            </div>

            {mode === "client" && (
              <>
                {/* Booking Status */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {booking.status === "pending" && (
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-2">
                        Update Booking Status
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-500 dark:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        {clientStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="rounded-xl bg-blue-50 dark:bg-gray-500 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 capitalize">
                    Booking Status: {booking.status || "Pending"}
                  </div>
                </div>
              </>
            )}

            {mode === "admin" && (
              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 p-5 bg-white dark:bg-gray-600">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white capitalize">
                  Update payment and booking status
                </h3>
                <div className="flex items-center gap-4 justify-between flex-wrap">
                  {/* Payment Status */}
                  <div className="grid sm:grid-cols-3 gap-2 text-sm items-end">
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-2">
                        Payment Status
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-500 dark:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize"
                        value={paymentStatus}
                        onChange={(event) =>
                          setPaymentStatus(event.target.value)
                        }
                      >
                        {paymentStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-xl bg-blue-50 dark:bg-gray-500 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 capitalize">
                      Payment: {booking.paymentMethod || "Card"} (
                      {booking.paymentStatus || "Pending"})
                    </div>
                    <button
                      className="rounded-full bg-blue-600 px-2 py-1 w-fit h-fit text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      onClick={handleUpdatePaymentStatus}
                      disabled={savingPaymentStatus}
                    >
                      {savingPaymentStatus ? "Updating..." : "Update"}
                    </button>
                  </div>

                  {/* Booking Status */}
                  <div className="grid sm:grid-cols-3 gap-2 text-sm items-end">
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-2">
                        Booking Status
                      </label>
                      <select
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-500 dark:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-xl bg-blue-50 dark:bg-gray-500 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 capitalize">
                      Booking: {booking.status || "Pending"}
                    </div>
                    <button
                      className="rounded-full bg-blue-600 px-2 py-1 w-fit text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 h-fit"
                      onClick={handleUpdateBookingStatus}
                      disabled={savingBookingStatus}
                    >
                      {savingBookingStatus ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 p-5 bg-white dark:bg-gray-600">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Vehicle Summary
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-20 w-28 rounded-xl bg-gray-100 dark:bg-gray-500 overflow-hidden flex items-center justify-center capitalize">
                  {carSummary?.image ? (
                    <img
                      src={carSummary.image}
                      alt={carSummary.name}
                      className="h-full w-full"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-200">
                    {carSummary?.category || "Category"}
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {carSummary?.name || "Reserved car"}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {carSummary?.people
                      ? `${carSummary.people} seats`
                      : "Capacity"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-200">
                <div>
                  <p className="text-xs uppercase text-gray-400">Pickup</p>
                  <p>{booking.pickupLocation}</p>
                  <p>{booking.pickupDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Dropoff</p>
                  <p>{booking.dropoffLocation}</p>
                  <p>{booking.dropoffDate}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-500 px-4 py-3 text-sm text-gray-700 dark:text-gray-100 flex items-center justify-between">
                <span>Total estimate</span>
                <span className="font-semibold">
                  {booking.estimatedPrice.toLocaleString() || "--"}
                </span>
              </div>
            </div>

            {/* <div className="rounded-2xl border border-gray-100 dark:border-gray-500 p-5 bg-white dark:bg-gray-600">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  className="rounded-full border border-gray-200 dark:border-gray-400 px-5 py-2 text-sm font-semibold  text-black hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
