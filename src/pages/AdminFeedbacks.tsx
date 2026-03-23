/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toast } from "react-toastify";
import { editContact, fetchAllContacts } from "../core/contact/contactSlice";
import Loader from "../components/Loader";
import { Button } from "../components/Button";

const AdminFeedbacks: React.FC = () => {
  const feedbacks = useAppSelector((state) => state.contact);
  const dispatch = useAppDispatch();

  const [selectedFeedBack, setSelectedFeedback] = useState<any>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState<boolean>(false);

  const statusClass: Record<string, string> = {
    replied: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
  };

  const [formData, setFormData] = useState({
    name: selectedFeedBack?.name ? selectedFeedBack?.name : "",
    email: selectedFeedBack?.email ? selectedFeedBack?.email : "",
    subject: selectedFeedBack?.subject ? selectedFeedBack?.subject : "",
    message: selectedFeedBack?.message ? selectedFeedBack?.message : "",
    adminReply: "",
  });

  const handleOpenForm = (selectedContact: any) => {
    if (!selectedContact) return;

    const feedback = selectedContact;

    setSelectedFeedback(feedback);

    setFormData({
      name: feedback?.name ? feedback?.name : "",
      email: feedback?.email ? feedback?.email : "",
      subject: feedback?.subject ? feedback?.subject : "",
      message: feedback?.message ? feedback?.message : "",
      adminReply: "",
    });

    console.log(feedback);
    setIsContactFormOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      adminReply: formData.adminReply,
      status: "replied",
    };

    dispatch(editContact({ id: selectedFeedBack.id, contactData: payload }))
      .unwrap()
      .then(() => {
        toast.success("Reply sent successfully!.");
        dispatch(fetchAllContacts());
        closeForm();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const closeForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      adminReply: "",
    });
    setIsContactFormOpen(false);
  };

  const contactStat = useMemo(() => {
    const pendingContact = feedbacks.allContacts.filter(
      (f) => f.status === "pending",
    ).length;
    const repliendContact = feedbacks.allContacts.filter(
      (f) => f.status === "replied",
    ).length;

    return [
      `${feedbacks.allContacts.length} feedback total`,
      `${pendingContact} pending feedbacks`,
      `${repliendContact} replied feedbacks`,
    ];
  }, [feedbacks.allContacts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer feedback</h2>
          <p className="text-gray-600 dark:text-gray-50">
            Track satisfaction trends and respond to service issues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactStat.map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500"
          >
            <p
              className="text-sm text-gray-500 dark:text-gray-100
              "
            >
              {item}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-600 dark:border-gray-500 p-6 space-y-4">
        {feedbacks.allContacts.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 dark:border-gray-400 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center flex-wrap gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusClass[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <button
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  onClick={() => handleOpenForm(item)}
                >
                  {item.adminReply ? "Edit Response" : "Respond"}
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-50 mt-1">
                {item.createdDate}
              </p>
              <p className="text-gray-600 dark:text-gray-50 mt-3">
                <b>Subject:</b> {item.subject}
              </p>
              <p className="text-gray-600 dark:text-gray-50 mt-3">
                <b>Message:</b> {item.message}
              </p>
              {item.adminReply && (
                <p className="text-gray-600 dark:text-gray-50 mt-3">
                  <b>Your Response:</b> {item.adminReply}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isContactFormOpen && (
        <div className="fixed inset-0 -top-5 z-[1000] h-screen w-full flex items-center justify-center bg-black/50 px-10">
          <div className="bg-white dark:bg-gray-600 h-[500px] overflow-y-auto p-3 w-full max-w-[500px]">
            {/* Contact Form */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mb-6">
                  Reply To {selectedFeedBack?.name} Feedback
                </h2>
                <button
                  className="bg-transparent border-none outline-none text-xl"
                  onClick={closeForm}
                >
                  <i className="fa fa-close"></i>
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-100 disabled:cursor-no-drop"
                    disabled
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-100 disabled:cursor-no-drop"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    disabled
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-10 disabled:cursor-no-drop"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    disabled
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-100 resize-vertical disabled:cursor-no-drop"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
                  >
                    Reply
                  </label>
                  <textarea
                    id="message"
                    name="adminReply"
                    value={formData.adminReply}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200 dark:bg-gray-500 text-gray-500 dark:text-gray-100 resize-vertical"
                    placeholder="Write your reply..."
                  />
                </div>
                <Button
                  type="button"
                  className="w-full py-3 text-lg disabled:bg-gray-400 disabled:cursor-no-drop"
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!formData.adminReply || feedbacks.loading}
                >
                  {feedbacks.loading ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader /> Loading..
                    </span>
                  ) : (
                    <span>Reply</span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
