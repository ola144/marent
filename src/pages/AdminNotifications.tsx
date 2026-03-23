import React, { useMemo } from "react";
import { Button } from "../components/Button";
import Loader from "../components/Loader";
import type { INotification } from "../core/auth/authTypes";
import {
  fetchAllNotifications,
  markNotAsRead,
} from "../core/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toast } from "react-toastify";

const badgeClass: Record<string, string> = {
  Contact: "bg-amber-50 text-amber-700",
  Booking: "bg-blue-50 text-blue-700",
  Payment: "bg-emerald-50 text-emerald-700",
};

const AdminNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notification);

  const handleToggleNotification = (id?: string, status?: boolean) => {
    if (status) {
      const payload = {
        isAdminRead: false,
      };

      dispatch(markNotAsRead({ id: id, status: payload }))
        .unwrap()
        .then(() => {
          dispatch(fetchAllNotifications());
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      const payload = {
        isAdminRead: true,
      };

      dispatch(markNotAsRead({ id: id, status: payload }))
        .unwrap()
        .then(() => {
          dispatch(fetchAllNotifications());
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const stats = useMemo(() => {
    const total = notification.allNotifications.length;
    const unread = notification.allNotifications.filter(
      (item) => item.isAdminRead === false,
    ).length;
    const feedbacks = notification.allNotifications.filter(
      (item) => item.type === "Contact",
    ).length;

    return { total, unread, feedbacks };
  }, [notification.allNotifications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-gray-600 dark:text-gray-50">
            Monitor booking activity, feedback, and payment updates.
          </p>
        </div>
        <Button variant="outline">Export log</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <p className="text-sm text-gray-500 dark:text-gray-100">Total</p>
          <p className="text-2xl font-semibold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <p className="text-sm text-gray-500 dark:text-gray-100">Unread</p>
          <p className="text-2xl font-semibold mt-2">{stats.unread}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500">
          <p className="text-sm text-gray-500 dark:text-gray-100">
            Feedback alerts
          </p>
          <p className="text-2xl font-semibold mt-2">{stats.feedbacks}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500 p-6 space-y-4">
        {notification.loading ? (
          <div className="bg-white dark:bg-gray-700 p-12 rounded-xl shadow-md text-center">
            <div className="mx-auto flex items-center justify-center">
              <Loader></Loader>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
              Loading...
            </p>
          </div>
        ) : notification.allNotifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-500 p-10 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
              No notifications yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-200 mt-2">
              Activity updates will appear here.
            </p>
          </div>
        ) : (
          notification.allNotifications.map((item: INotification) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-400 p-5 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-start flex-col gap-1">
                  {/* <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.type ?? "Update"}
                  </h3> */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      badgeClass[item.type ?? ""] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.type ?? "General"}
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {!item.isAdminRead && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                        Unread
                      </span>
                    )}
                    {item.isAdminRead && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                        Read
                      </span>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-50 mt-1">
                      {item.createdAt ?? "Date not available"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-50 mt-3 text-sm">
                  {item.adminMsg}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="primary"
                  className="px-4 py-2"
                  onClick={() =>
                    handleToggleNotification(item.id, item.isAdminRead)
                  }
                >
                  {item.isAdminRead ? "Mark As Unread" : "Mark As Read"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
