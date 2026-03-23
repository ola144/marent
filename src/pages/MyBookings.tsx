import React, { useEffect, useState } from "react";
import Banner2 from "../components/Banner2";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { IBooking } from "../core/car/carType";
import { Button } from "../components/Button";
import { getBooking } from "../core/booked/bookSlice";
import Loader from "../components/Loader";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { toast } from "react-toastify";

const statusStyles: Record<string, string> = {
  Pending: "bg-red-50 text-red-700",
  Confirmed: "bg-emerald-50 text-emerald-700",
  "In progress": "bg-blue-50 text-blue-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const MyBookings: React.FC = () => {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state) => state.bookings);
  const [activeBooking, setActiveBooking] = useState<IBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getBooking())
      .then(() => {})
      .catch((error) => {
        toast.error(error);
      });
  }, [dispatch]);

  return (
    <div className="pt-20">
      <Banner2
        title="My bookings"
        subTitle="All of your reserved cars"
        description="Track upcoming pickups, active rentals, and previous trips in
          one place."
      />

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your bookings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {bookings.userBooking.length} trips scheduled or completed.
                  </p>
                </div>
                <button className="rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                  Download history
                </button>
              </div>

              {bookings.loading ? (
                <div className="bg-white dark:bg-gray-700 p-12 rounded-xl shadow-md text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                    Loading...
                  </p>
                </div>
              ) : bookings.userBooking.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-500 p-10 text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    No bookings found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-200 mt-2">
                    Book a car to see your reservations here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.userBooking.map((booking: IBooking) => (
                    <div
                      key={booking?.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-600 p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                            {booking?.id}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {booking?.bookedCar?.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            Days: {booking?.bookedCar?.days}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking?.status}
                        </span>
                      </div>
                      <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-200">
                        <div>
                          <p className="text-xs uppercase text-gray-400">
                            Pickup
                          </p>
                          <p className="font-medium">
                            {booking?.pickupLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-gray-400">
                            Dropoff
                          </p>
                          <p className="font-medium">
                            {booking?.dropoffLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-gray-400">
                            Total
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            #{booking?.estimatedPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setActiveBooking(booking);
                            setIsModalOpen(true);
                          }}
                        >
                          View details
                        </Button>
                        <div className="">
                          <span>Payment Status: </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusStyles[booking.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {booking?.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">Upcoming pickup</h3>
                <div className="rounded-xl bg-blue-50 dark:bg-gray-600 p-4 text-sm text-gray-700 dark:text-gray-100 space-y-2">
                  <p className="font-semibold">
                    {bookings.bookings[0]?.bookedCar?.name}
                  </p>
                  <p>Pickup: {bookings.bookings[0]?.pickupDate}</p>
                  <p>Location: {bookings.bookings[0]?.pickupLocation}</p>
                </div>
                <button className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Get directions
                </button>
              </div> */}

              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">Need assistance?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  Update your reservation or request add-ons before pickup.
                </p>
                <div className="rounded-xl bg-amber-50 dark:bg-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                  Support line: +1 (555) 481-0021
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingDetailsModal
        open={isModalOpen}
        booking={activeBooking}
        mode="client"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => dispatch(getBooking())}
      />
    </div>
  );
};

export default MyBookings;
