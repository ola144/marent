import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createTask, fetchAllTasks } from "../core/task/taskSlice";
import { toast } from "react-toastify";

const AdminLayout: React.FC = () => {
  const navItems = [
    { label: "Overview", to: "/admin" },
    { label: "Cars", to: "/admin/cars" },
    { label: "Bookings", to: "/admin/bookings" },
    { label: "Customers", to: "/admin/customers" },
    { label: "Feedbacks", to: "/admin/feedbacks" },
  ];

  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.task);

  const [showTaskForm, setshowTaskForm] = useState<boolean>(false);
  const [taskText, setTaskText] = useState<string>("");

  const toggleTaskForm = () => {
    setshowTaskForm(!showTaskForm);
  };

  const handleAddTask = () => {
    const payload = {
      task: taskText,
      isTaskCompleted: false,
    };

    dispatch(createTask(payload))
      .then(() => {
        toast.success("Task Created Successfully!");
        dispatch(fetchAllTasks());
        setTaskText("");
        setshowTaskForm(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="pt-20 mb-10 w-full">
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 dark:via-gray-600 to-blue-700 text-white py-10">
        <div className="parent flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-100">
              Admin console
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
              Marent Operations Hub
            </h1>
            <p className="text-blue-100 mt-2">
              Manage inventory, customers, and service insights.
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <div className="flex flex-wrap gap-3">
              {showTaskForm ? (
                <Button
                  className="capitalize"
                  variant="secondary"
                  onClick={toggleTaskForm}
                >
                  close Task Form
                </Button>
              ) : (
                <Button
                  className="capitalize"
                  variant="primary"
                  onClick={toggleTaskForm}
                >
                  Create task
                </Button>
              )}
            </div>
            {showTaskForm && (
              <div className="flex gap-1">
                <Input
                  placeholder="The task"
                  required
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                ></Input>
                <Button
                  type="button"
                  variant="primary"
                  className="disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-no-drop"
                  disabled={!taskText || task.loading}
                  onClick={handleAddTask}
                >
                  {task.loading ? "Loading..." : "Add Task"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="parent md:mt-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white dark:bg-gray-600 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-500 md:p-5 py-2 px-5 h-fit sticky md:top-24 top-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-white">
              Admin navigation
            </h2>
            <nav className="md:mt-4 mt-1 flex lg:flex-col flex-wrap lg:gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `px-4 md:py-3 py-1.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-500"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
