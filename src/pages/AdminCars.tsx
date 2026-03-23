/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { Button } from "../components/Button";
import CreateCarForm from "../components/CreateCarForm";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";
import Loader from "../components/Loader";
import { fetchCars, removeCar } from "../core/car/carSlice";
import { toast } from "react-toastify";

const AdminCars: React.FC = () => {
  // Record<string, string>
  const statusStyles = {
    active: "bg-emerald-50 text-emerald-700",
    maintenance: "bg-amber-50 text-amber-700",
    inactive: "bg-gray-100 text-gray-600",
  };

  const dispatch = useAppDispatch();

  const [showCarForm, setShowCarForm] = useState<boolean>(false);
  const [selectedEditCar, setSelectedEditCar] = useState<any>();

  const [isConfirmDeleteCarOpen, setIsConfirmDeleteCarOpen] = useState(false);
  const [selectedDeleteCar, setselectedDeleteCar] = useState<ICar | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");

  const cars = useAppSelector((state: any) => state.cars);

  const categories = Array.from(
    new Set(cars.cars.map((c: { category: any }) => c.category)),
  );

  const toggleCarForm = () => {
    setShowCarForm(!showCarForm);
  };

  const handleEditCar = (car: ICar) => {
    setSelectedEditCar(car);
    toggleCarForm();
  };

  const handleOnOpenConfirmDeleteCar = (selectedDeleteCar: ICar) => {
    setselectedDeleteCar(selectedDeleteCar);
    setIsConfirmDeleteCarOpen(true);
  };

  const handleDeleteCar = () => {
    dispatch(removeCar(selectedDeleteCar?.id))
      .unwrap()
      .then(() => {
        toast.success("Car deleted successfully!");
        dispatch(fetchCars())
          .then(() => {})
          .catch((error) => {
            toast.error(error.message);
          });
        setIsConfirmDeleteCarOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const carFilterResults = useMemo(() => {
    return cars.cars.filter((c: ICar) => {
      const searchQuery = c.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !searchCategory || c.category === searchCategory;

      return searchQuery && matchesCategory;
    });
  }, [cars.cars, searchCategory, searchTerm]);

  const activeCar = carFilterResults.filter((c: any) => c.status);
  const inactiveCar = carFilterResults.filter((c: any) => !c.status);

  return (
    <>
      <div className="space-y-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Car inventory</h2>
            <p className="text-gray-600 dark:text-gray-100">
              Track fleet availability, pricing, and maintenance status.
            </p>
          </div>
          <Button
            className="capitalize"
            variant="primary"
            onClick={toggleCarForm}
          >
            Add new car
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-gray-600 dark:border-gray-500">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex gap-3">
              <input
                className="w-full lg:w-72 rounded-xl border border-gray-200 px-4 py-2 text-sm dark:bg-gray-600 dark:border-gray-50 dark:placeholder:text-gray-50 dark:text-gray-50"
                placeholder="Search by model"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 dark:bg-gray-600 dark:border-gray-50 dark:placeholder:text-gray-50 dark:text-gray-50 capitalize"
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c: any, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 flex-wrap text-xs w-full">
              <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 font-semibold">
                {activeCar.length} active
              </span>
              <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 font-semibold">
                {inactiveCar.length} inactive
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {cars.loading ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
                <div className="mx-auto flex items-center justify-center">
                  <Loader></Loader>
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                  Loading...
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-400">
                    <th className="py-2">Index</th>
                    <th className="py-2">Model</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Location</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 dark:text-gray-100">
                  {carFilterResults.map((car: ICar, index: number) => (
                    <tr key={car.id} className="border-t border-gray-100">
                      <td className="py-3 font-semibold text-gray-900 dark:text-gray-50">
                        {index + 1}.
                      </td>
                      <td className="py-3">{car.name}</td>
                      <td className="py-3 capitalize">{car.category}</td>
                      <td className="py-3">{car.pickup}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            car.status
                              ? statusStyles.active
                              : statusStyles.inactive
                            // statusStyles[car.status]
                          }`}
                        >
                          {car.status ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-900 dark:text-gray-50">
                        #{car.price}
                      </td>
                      <td className="flex items-center justify-center text-xl font-bold gap-0.5">
                        <button
                          className="text-green-500 bg-transparent"
                          onClick={() => handleEditCar(car)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="text-red-500 bg-transparent"
                          onClick={() => handleOnOpenConfirmDeleteCar(car)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showCarForm && (
        <CreateCarForm
          onCloseCarForm={toggleCarForm}
          selectedEditCar={selectedEditCar}
          setSelectedEditCar={setSelectedEditCar}
        ></CreateCarForm>
      )}

      {isConfirmDeleteCarOpen && (
        <div className="fixed bg-black/50 flex items-center justify-center h-screen w-full -top-5 inset-0 z-[1000]">
          <div className="bg-white dark:bg-gray-500 text-center flex items-center justify-center w-full max-w-[500px] h-[150px] rounded-md">
            <div className="flex flex-col gap-2">
              <p className="dark:text-white text-gray-500">
                Are you sure want to delete {selectedDeleteCar?.name} car?
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleDeleteCar}
                  disabled={cars.loading}
                >
                  {cars.loading ? (
                    <span>
                      <Loader /> Loading...
                    </span>
                  ) : (
                    <span>Delete</span>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsConfirmDeleteCarOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCars;
