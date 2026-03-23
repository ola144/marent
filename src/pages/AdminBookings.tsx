import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteBookingById, fetchAllBookings } from "../core/booked/bookSlice";
import type { IBooking } from "../core/car/carType";
import Loader from "../components/Loader";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { Button } from "../components/Button";
import { toast } from "react-toastify";

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  "In progress": "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const AdminBookings: React.FC = () => {
  const dispatch = useAppDispatch();
  const bookingState = useAppSelector((state) => state.bookings);

  const [activeBooking, setActiveBooking] = useState<IBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedDeleteBooking, setselectedDeleteBooking] =
    useState<IBooking | null>(null);

  const handleOnOpenConfirmDeleteBooking = (selectedBooking: IBooking) => {
    setselectedDeleteBooking(selectedBooking);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDeleteBooking = () => {
    dispatch(deleteBookingById(selectedDeleteBooking?.id))
      .unwrap()
      .then(() => {
        toast.success("Booking deleted successfully!");
        dispatch(fetchAllBookings());
        setIsConfirmDeleteModalOpen(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const stats = useMemo(() => {
    const total = bookingState.allBookings.length;
    const confirmed = bookingState.allBookings.filter(
      (booking) => booking.status === "confirmed",
    ).length;
    const inProgress = bookingState.allBookings.filter(
      (booking) => booking.status === "in progress",
    ).length;
    const completed = bookingState.allBookings.filter(
      (booking) => booking.status === "completed",
    ).length;
    const cancelled = bookingState.allBookings.filter(
      (booking) => booking.status === "cancelled",
    ).length;

    return [
      { label: "Total bookings", value: total },
      { label: "Confirmed", value: confirmed },
      { label: "In progress", value: inProgress },
      { label: "Completed", value: completed },
      { label: "Cancelled", value: cancelled },
    ];
  }, [bookingState.allBookings]);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-gray-600 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-500"
          >
            <p className="text-sm text-gray-500 dark:text-gray-50">
              {item.label}
            </p>
            <h2 className="text-3xl font-bold mt-4">{item.value}</h2>
          </div>
        ))}
      </section>

      <section className="bg-white dark:bg-gray-600 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-500 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold">All booked cars</h3>
            <p className="text-sm text-gray-500 dark:text-gray-50">
              Review every reservation placed across the platform.
            </p>
          </div>
          <button className="rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
            Export report
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          {bookingState.loading ? (
            <div className="bg-white dark:bg-gray-700 p-12 rounded-xl shadow-md text-center">
              <div className="mx-auto flex items-center justify-center">
                <Loader></Loader>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                Loading Bookings...
              </p>
            </div>
          ) : bookingState.allBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
              <div className="mx-auto mb-4 size-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <i className="fa fa-briefcase text-2xl"></i>
              </div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                No bookings yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-200 mt-2">
                Once clients reserve cars, they will show up here.
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead className="w-full">
                  <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-white">
                    <th className="py-2 px-1">Index</th>
                    <th className="py-2 px-1">Client</th>
                    <th className="py-2 px-1">Car</th>
                    <th className="py-2 px-1">Dates</th>
                    <th className="py-2 px-1">Route</th>
                    <th className="py-2 px-1">Status</th>
                    <th className="py-2 px-1">Amount</th>
                    <th className="py-2 px-1 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 dark:text-gray-50 w-full">
                  {bookingState.allBookings.map((booking: IBooking, index) => (
                    <tr
                      key={booking.id}
                      className="border-t border-gray-100 dark:border-gray-500"
                    >
                      <td className="py-3 px-1 font-semibold text-gray-900 dark:text-white">
                        {index + 1}.
                      </td>
                      <td className="py-3 px-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-100">
                          {booking.email}
                        </div>
                      </td>
                      <td className="py-3 px-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {booking.bookedCar?.name ?? "Reserved car"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-100">
                          {booking.bookedCar?.category ?? "Category"}
                        </div>
                      </td>
                      <td className="py-3 px-1">
                        {booking.pickupDate} - {booking.dropoffDate}
                      </td>
                      <td className="py-3 px-1">
                        {booking.pickupLocation} to {booking.dropoffLocation}
                      </td>
                      <td className="py-3 px-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-1 font-semibold text-gray-900 dark:text-gray-100">
                        #
                        {Number(booking.estimatedPrice).toLocaleString() ||
                          "--"}
                      </td>
                      <td className="py-3 px-1 text-right flex items-center gap-1 text-lg">
                        <button
                          className="text-blue-500 font-bold  bg-gray-300 px-1 hover:bg-gray-200 rounded-sm"
                          onClick={() => {
                            setActiveBooking(booking);
                            setIsModalOpen(true);
                          }}
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                        <button
                          className="text-red-500 font-bold bg-gray-300 px-1 hover:bg-gray-200 rounded-sm"
                          onClick={() =>
                            handleOnOpenConfirmDeleteBooking(booking)
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>

      <BookingDetailsModal
        open={isModalOpen}
        booking={activeBooking}
        mode="admin"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => dispatch(fetchAllBookings())}
      />

      {isConfirmDeleteModalOpen && (
        <div className="fixed bg-black/50 flex items-center justify-center h-screen w-full -top-5 inset-0 z-[1000]">
          <div className="bg-white dark:bg-gray-500 text-center flex items-center justify-center w-full max-w-[500px] h-[150px] rounded-md">
            <div className="flex flex-col gap-2">
              <p className="dark:text-white text-gray-500">
                Are you sure want to delete {selectedDeleteBooking?.firstName}{" "}
                {selectedDeleteBooking?.lastName} booking?
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleDeleteBooking}
                  disabled={bookingState.loading}
                >
                  {bookingState.loading ? (
                    <span>
                      <Loader /> Loading...
                    </span>
                  ) : (
                    <span>Delete</span>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
