import React, { useMemo } from "react";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import Loader from "../components/Loader";
import type { INotification } from "../core/auth/authTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import {
  getUserNotifications,
  markNotAsRead,
} from "../core/notification/notificationSlice";
import { toast } from "react-toastify";

const badgeClass: Record<string, string> = {
  Contact: "bg-amber-50 text-amber-700",
  Booking: "bg-blue-50 text-blue-700",
  Payment: "bg-emerald-50 text-emerald-700",
};

const MyNotifications: React.FC = () => {
  const notification = useAppSelector((state) => state.notification);

  const dispatch = useAppDispatch();

  const stats = useMemo(() => {
    const total = notification.userNotifications.length;
    const unread = notification.userNotifications.filter(
      (item) => item.isClientRead === false,
    ).length;
    const read = total - unread;

    return { total, unread, read };
  }, [notification.userNotifications]);

  const handleToggleNotification = (id?: string, status?: boolean) => {
    if (status) {
      const payload = {
        isClientRead: false,
      };

      dispatch(markNotAsRead({ id: id, status: payload }))
        .unwrap()
        .then(() => {
          dispatch(getUserNotifications());
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      const payload = {
        isClientRead: true,
      };

      dispatch(markNotAsRead({ id: id, status: payload }))
        .unwrap()
        .then(() => {
          dispatch(getUserNotifications());
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  return (
    <div className="pt-20">
      <Banner2
        title="Notifications"
        subTitle="Stay on top of every update"
        description="Booking confirmations, feedback replies, and payment alerts
          all show up here."
      />

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your notifications</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {stats.total} total updates. {stats.unread} unread.
                  </p>
                </div>
                <Link to="/my-feedbacks">
                  <Button variant="primary">View feedback</Button>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <div className="rounded-xl border border-gray-100 dark:border-gray-500 p-4 bg-gray-50 dark:bg-gray-600">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-200">
                    Total
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-500 p-4 bg-gray-50 dark:bg-gray-600">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-200">
                    Unread
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.unread}</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-500 p-4 bg-gray-50 dark:bg-gray-600">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-200">
                    Read
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.read}</p>
                </div>
              </div>

              {notification.loading ? (
                <div className="bg-white dark:bg-gray-700 p-12 rounded-xl shadow-md text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                    Loading...
                  </p>
                </div>
              ) : notification.userNotifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-500 p-10 text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    You are all caught up
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-200 mt-2">
                    New booking updates will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notification.userNotifications.map((item: INotification) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-600 p-5 shadow-sm"
                    >
                      <div className="">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                            {item.createdAt ?? "Date not available"}
                          </p>
                          {!item.isClientRead && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                              Unread
                            </span>
                          )}
                          {item.isClientRead && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                              Read
                            </span>
                          )}
                        </div>
                        <div className="flex items-start gap-2 flex-col">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              badgeClass[item.type ?? ""] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.type ?? "General"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-200 mt-4">
                        {item.clientMsg}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                          variant="primary"
                          className="px-4 py-2"
                          onClick={() =>
                            handleToggleNotification(item.id, item.isClientRead)
                          }
                        >
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">Need help fast?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  Chat with support if you need booking changes or urgent
                  assistance.
                </p>
                <div className="rounded-xl bg-blue-50 dark:bg-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                  Support line: +1 (555) 481-0021
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">
                  Take action quickly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  Review recent bookings or leave new feedback from the
                  shortcuts below.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/my-bookings">
                    <Button variant="outline">My bookings</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="primary">Send feedback</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyNotifications;
