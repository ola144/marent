import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import Loader from "../components/Loader";
import { getUserContacts } from "../core/contact/contactSlice";
import type { IContact } from "../core/auth/authTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toast } from "react-toastify";

const statusClass: Record<string, string> = {
  replied: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
};

const MyFeedbacks: React.FC = () => {
  const dispatch = useAppDispatch();
  const contact = useAppSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getUserContacts())
      .unwrap()
      .then(() => {})
      .catch((error) => {
        toast.error(error.message ?? error);
      });
  }, [dispatch]);

  const stats = useMemo(() => {
    const pending = contact.userContacts.filter(
      (item) => item.status === "pending",
    ).length;
    const replied = contact.userContacts.filter(
      (item) => item.status === "replied",
    ).length;

    return {
      total: contact.userContacts.length,
      pending,
      replied,
    };
  }, [contact.userContacts]);

  return (
    <div className="pt-20">
      <Banner2
        title="Feedback Center"
        subTitle="Your Feedback and Replies"
        description="Track every message you've sent and see when our team
          responds."
      />

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your feedback history</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {stats.total} feedback items. {stats.pending} pending,{" "}
                    {stats.replied} replied.
                  </p>
                </div>
                <Link to="/contact">
                  <Button variant="primary">Send New Feedback</Button>
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
                    Pending
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.pending}</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-500 p-4 bg-gray-50 dark:bg-gray-600">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-200">
                    Replied
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.replied}</p>
                </div>
              </div>

              {contact.loading ? (
                <div className="bg-white dark:bg-gray-700 p-12 rounded-xl shadow-md text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                    Loading...
                  </p>
                </div>
              ) : contact.userContacts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-500 p-10 text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    No feedback yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-200 mt-2">
                    Send a message to our team and it will show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contact.userContacts.map((item: IContact) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-600 p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                            {item.createdDate ?? "Date not available"}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {item.subject}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusClass[item.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status ?? "pending"}
                        </span>
                      </div>

                      <div className="mt-4 text-sm text-gray-600 dark:text-gray-200">
                        <p className="font-semibold text-gray-500 dark:text-gray-200 uppercase text-xs">
                          Message
                        </p>
                        <p className="mt-2">{item.message}</p>
                      </div>

                      <div className="mt-5 rounded-xl border border-dashed border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-200">
                          Admin reply
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-100 mt-2">
                          {item.adminReply
                            ? item.adminReply
                            : "We haven't replied yet. Our team will reach out soon."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">
                  How responses work
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  We review feedback within 24 hours. Urgent issues are
                  prioritized and you will receive an email when a reply is
                  posted.
                </p>
                <div className="rounded-xl bg-blue-50 dark:bg-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-100">
                  For urgent help: +1 (555) 481-0021
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-3">
                  Share another issue
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  Need a new booking update or want to share another concern?
                </p>
                <Link to="/contact" className="inline-flex">
                  <Button variant="primary" className="px-5 py-3 text-sm">
                    Go to contact form
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyFeedbacks;
