import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAllUser } from "../core/auth/userSlice";
import { Button } from "../components/Button";
import Loader from "../components/Loader";

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.users);
  const bookings = useAppSelector((state) => state.bookings);

  const searchResults = useMemo(() => {
    return customers.users.filter(
      (c) =>
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [customers.users, searchTerm]);

  const userStats = (userId?: string) => {
    if (!bookings.allBookings || !userId) return null;

    // filter bookigns for this user
    const userBookings = bookings.allBookings.filter(
      (b) => b.userId === userId && b.paymentStatus === "paid",
    );

    // total rentas
    const totalRentals = userBookings.length;

    // Get last tring (latest date);
    const lastTrip =
      userBookings
        .slice() // avoid mutating original array
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0] || null;

    return {
      totalRentals,
      lastTrip,
    };
  };

  const clientStats = useMemo(() => {
// ["1,420 total users", "86 VIP customers", "32 flagged accounts"]
    const totalUsers = customers.users.length;

    return [
      `${totalUsers} total users`,
    ]

  }, [customers.users.length]);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-gray-600 dark:text-gray-50">
          Manage customer profiles, loyalty status, and rental history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clientStats.map(
          (item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500"
            >
              <p className="text-sm text-gray-500 dark:text-white capitalize">
                {item}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-gray-600 dark:border-gray-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <input
            className="w-full lg:w-72 rounded-xl border border-gray-200 px-4 py-2 text-sm dark:bg-gray-600 dark:border-gray-500 outline-none"
            placeholder="Search customers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3 text-sm">
            <Button className="capitalize" variant="primary">
              Export list
            </Button>
          </div>
        </div>

        {customers.loading ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
            <div className="mx-auto flex items-center justify-center">
              <Loader></Loader>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
              Loading...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-100">
                  <th className="py-2 px-2">Customer</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Rentals</th>
                  <th className="py-2 px-2">Last trip</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-600">
                {searchResults.length === 0 ? (
                  <>
                    <tr className="text-center col-span-8 text-black dark:text-white">
                      <td className="col-span-full"> No Customer.</td>
                    </tr>
                  </>
                ) : (
                  <>
                    {searchResults.map((customer) => (
                      <tr
                        key={customer.userId}
                        className="border-t border-gray-100"
                      >
                        <td className="py-3 px-2">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {customer.firstName} {customer.lastName}
                          </div>
                        </td>
                        <td className="py-3 px-2 dark:text-white">
                          {customer.email}
                        </td>
                        <td className="py-3 px-2 dark:text-white">
                          {userStats(customer.userId)?.totalRentals || "NIL"}
                        </td>
                        <td className="py-3 px-2 dark:text-white">
                          {userStats(customer.userId)?.lastTrip
                            ?.pickupLocation || "NIL"}{" "}
                          -{" "}
                          {userStats(customer.userId)?.lastTrip
                            ?.dropoffLocation || "NIL"}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
