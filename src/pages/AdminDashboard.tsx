/* eslint-disable react-hooks/purity */
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { IBooking, ITask } from "../core/car/carType";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { editTaskStatus, fetchAllTasks } from "../core/task/taskSlice";
import { toast } from "react-toastify";
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const bookings = useAppSelector((state) => state.bookings);

  const cars = useAppSelector((state) => state.cars.cars);
  const task = useAppSelector((state) => state.task);

  const [tasks, setTasks] = useState<ITask[]>([]);

  const latestBookings = useMemo(() => {
    return bookings.allBookings
      .slice() // avoid mutating original array
      .sort(
        (a: IBooking, b: IBooking) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [bookings.allBookings]);

  const stats = useMemo(() => {
    const now = Date.now();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let total = 0;

    bookings.allBookings.forEach((b) => {
      if (!b.createdAt || !b.estimatedPrice || b.paymentStatus !== "paid")
        return;

      const year = new Date(b.createdAt).getFullYear();
      const month = new Date(b.createdAt).getMonth();

      const isSameMonth = month === currentMonth && year === currentYear;

      if (isSameMonth) {
        total += b.estimatedPrice;
      }
    });

    const monthlyRevenue = total;

    const availableCar = cars.filter((c) => c.status);

    const activeRentals = bookings.allBookings.filter((b) => {
      const pickup = new Date(b.pickupDate).getTime();
      const dropoff = new Date(b.dropoffDate).getTime();

      return b.paymentStatus === "paid" && pickup <= now && dropoff >= now;
    });

    const upcomingRentals = bookings.allBookings.filter((b) => {
      const pickup = new Date(b.pickupDate).getTime();

      return b.paymentStatus === "paid" && pickup > now;
    });

    const completedRentals = bookings.allBookings.filter((b) => {
      const dropoff = new Date(b.dropoffDate).getTime();

      return b.paymentStatus === "paid" && dropoff < now;
    });

    return [
      {
        label: "Active Rentals",
        value: activeRentals.length,
      },
      {
        label: "Upcoming Rentals",
        value: upcomingRentals.length,
      },
      {
        label: "Completed Rentals",
        value: completedRentals.length,
      },
      {
        label: "Monthly Revenue",
        value: `#${monthlyRevenue.toLocaleString()}.00`,
      },
      {
        label: "Available Cars",
        value: availableCar.length,
      },
    ];
  }, [bookings.allBookings, cars]);

  const fleet = useMemo(() => {
    const totalSuv = cars.filter((c) => c.category === "suv");
    const availableSuv = cars.filter((c) => c.category === "suv" && c.status);
    const totalSedan = cars.filter((c) => c.category === "sedan");
    const availableSedan = cars.filter(
      (c) => c.category === "sedan" && c.status,
    );
    const totalSport = cars.filter((c) => c.category === "sport");
    const availableSport = cars.filter(
      (c) => c.category === "sport" && c.status,
    );
    const totalHatchback = cars.filter((c) => c.category === "hatchback");
    const availableHatchback = cars.filter(
      (c) => c.category === "hatchback" && c.status,
    );

    return [
      {
        label: "suv",
        total: totalSuv.length,
        available: availableSuv.length,
      },
      {
        label: "sedan",
        total: totalSedan.length,
        available: availableSedan.length,
      },
      {
        label: "sport",
        total: totalSport.length,
        available: availableSport.length,
      },
      {
        label: "hatchback",
        total: totalHatchback.length,
        available: availableHatchback.length,
      },
    ];
  }, [cars]);

  const topLocations = useMemo(() => {
    const locationCount: Record<string, number> = {};

    bookings.allBookings.forEach((b) => {
      const location = b.pickupLocation;

      if (!location) return;

      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    return Object.entries(locationCount)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((item) => ({
        location: item.location,
        total: `${item.count.toLocaleString()} rentals`,
      }));
  }, [bookings.allBookings]);

  const revenueByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    let totalRevenue = 0;

    bookings.allBookings.forEach((b) => {
      if (
        !b.bookedCar.category ||
        !b.estimatedPrice ||
        b.paymentStatus !== "paid"
      )
        return;

      categoryMap[b.bookedCar.category] =
        (categoryMap[b.bookedCar.category] || 0) + b.estimatedPrice;

      totalRevenue += b.estimatedPrice;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round((value / totalRevenue) * 100),
    }));
  }, [bookings.allBookings]);

  const handleUpdateTaskStatus = (taskStatus: boolean, id?: string) => {
    const previousTasks = [...tasks];

    if (taskStatus) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isTaskCompleted: false } : task,
        ),
      );

      const payload = {
        isTaskCompleted: false,
      };

      dispatch(editTaskStatus({ status: payload.isTaskCompleted, id: id }))
        .then(() => {
          toast.success("Task Updated Succesfully!");
          dispatch(fetchAllTasks());
        })
        .catch((error) => {
          toast.error(error);
          setTasks(previousTasks);
          dispatch(fetchAllTasks());
        });
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isTaskCompleted: true } : task,
        ),
      );

      const payload = {
        isTaskCompleted: true,
      };

      dispatch(editTaskStatus({ status: payload.isTaskCompleted, id: id }))
        .then(() => {
          toast.success("Task Updated Succesfully!");
          dispatch(fetchAllTasks());
        })
        .catch((error) => {
          toast.error(error);
          setTasks(previousTasks);
          dispatch(fetchAllTasks());
        });
    }
  };

  useEffect(() => {
    dispatch(fetchAllTasks())
      .unwrap()
      .then((res) => {
        setTasks(res);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [dispatch]);

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
            <div className="flex items-end justify-between mt-4">
              <h2 className="text-3xl font-bold">{item.value}</h2>
              {/* <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-50">
                {item.change}
              </span> */}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="flex flex-col gap-5">
          {/* Recet Bookings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent bookings</h3>
              <Button
                className="capitalize"
                variant="primary"
                onClick={() => navigate("/admin/bookings")}
              >
                View all
              </Button>
            </div>
            <div className="overflow-x-auto">
              {bookings.loading ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                    Loading Recent Booking...
                  </p>
                </div>
              ) : (
                <>
                  {latestBookings.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
                      <div className="mx-auto mb-4 size-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <i className="fa fa-briefcase text-2xl"></i>
                      </div>
                      <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                        There is not recent bookings.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-gray-400 dark:text-white">
                          <th className="py-2">Index</th>
                          <th className="py-2">Customer</th>
                          <th className="py-2">Route</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-600 dark:text-gray-50">
                        {latestBookings?.map((row, index) => (
                          <tr key={row.id} className="border-t border-gray-100">
                            <td className="py-3 font-semibold text-gray-900 dark:text-white">
                              {index + 1}.
                            </td>
                            <td className="py-3">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {row.firstName} {row.lastName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-100">
                                {row.bookedCar.name}
                              </div>
                            </td>
                            <td className="py-3">
                              {row.pickupLocation} to {row.dropoffLocation}
                            </td>
                            <td className="py-3">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                              #{Number(row.estimatedPrice).toLocaleString()}.00
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
            <h3 className="text-xl font-semibold mb-4">Fleet Availability</h3>
            <div className="space-y-4">
              {fleet.map((item) => (
                <div className="" key={item.label}>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-50 uppercase">
                    <span>{item.label}</span>
                    <span>
                      {item.available}/{item.total} available
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-300 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{
                        width: `${(item.available / item.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <h3 className="text-xl font-semibold mb-4">Top Locations</h3>

          <div className="space-y-4 text-sm text-gray-600 dark:text-white">
            {topLocations.length === 0 ? (
              <>
                <p className="text-center text-sm">
                  It seems that no locations has been booked yet.
                </p>
              </>
            ) : (
              <>
                {topLocations.map((item) => (
                  <div
                    key={item.location}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium ">{item.location}</span>
                    <span>{item.total}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Revenue by category */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <h3 className="text-xl font-semibold mb-4">Revenue by Category</h3>
          {revenueByCategory.length === 0 ? (
            <>
              <p className="text-center text-sm">
                There is no revenue by category yet.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {revenueByCategory.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-50 uppercase">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <h3 className="text-xl font-semibold mb-4">Admin Tasks</h3>
          {task.loading ? (
            <>
              <div className="flex items-center justify-center flex-col gap-2">
                <Loader />
                <span>Loading tasks...</span>
              </div>
            </>
          ) : (
            <>
              {tasks.length === 0 ? (
                <>
                  <p className="text-center text-sm">
                    You don't have any task yet.
                  </p>
                </>
              ) : (
                <>
                  <div className="space-y-4 text-sm ">
                    {tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-xs"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={task.isTaskCompleted}
                          onChange={() =>
                            handleUpdateTaskStatus(
                              task.isTaskCompleted,
                              task.id,
                            )
                          }
                        />
                        <span
                          className={
                            task.isTaskCompleted
                              ? "line-through text-gray-400 dark:text-white/50"
                              : "text-gray-500 dark:text-white"
                          }
                        >
                          {task.task}
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
