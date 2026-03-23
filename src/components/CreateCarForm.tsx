/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { states } from "../data";
import { Input } from "./Input";
import { Select } from "./Select";
import { Button } from "./Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addCar, editCar, fetchCars } from "../core/car/carSlice";
import Loader from "./Loader";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

type FormType = {
  id?: string;
  name: string;
  category: string;
  type: string;
  numberOfPeople: string;
  fuel: string;
  price: string;
  discount: string;
  pickup: string;
  dropoff: string;
  image: string;
  status?: boolean;
};

const CreateCarForm = ({
  onCloseCarForm,
  selectedEditCar,
  setSelectedEditCar,
}: any) => {
  const dispatch = useAppDispatch();

  const car = useAppSelector((state) => state.cars);

  const [carImage, setCarImage] = useState<string>("");
  const [isCarAvailable, setIsCarAvailable] = useState<boolean>(
    selectedEditCar?.status ? true : false,
  );

  const [form, setForm] = useState<FormType>({
    name: selectedEditCar?.name ? selectedEditCar?.name : "",
    category: selectedEditCar?.category ? selectedEditCar?.category : "",
    type: selectedEditCar?.type ? selectedEditCar?.type : "",
    numberOfPeople: selectedEditCar?.numberOfPeople
      ? selectedEditCar?.numberOfPeople
      : "",
    fuel: selectedEditCar?.fuel ? selectedEditCar?.fuel : "",
    price: selectedEditCar?.price ? selectedEditCar?.price : "",
    discount: selectedEditCar?.discount ? selectedEditCar?.discount : "",
    pickup: selectedEditCar?.pickup ? selectedEditCar?.pickup : "",
    dropoff: selectedEditCar?.dropoff ? selectedEditCar?.dropoff : "",
    image: selectedEditCar?.image ? selectedEditCar?.image : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 400,
    });

    const reader = new FileReader();
    reader.readAsDataURL(compressed);

    reader.onloadend = () => {
      const image = reader.result as string;

      setCarImage(image);

      console.log(image);
    };
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        type: form.type,
        numberOfPeople: Number(form.numberOfPeople),
        fuel: Number(form.fuel),
        price: Number(form.price),
        discount: form.discount === "" ? 0 : Number(form.discount),
        pickup: form.pickup,
        dropoff: form.dropoff,
        days: 1,
        image: carImage,
        status: isCarAvailable,
        createdAt: Date.now(),
      };

      dispatch(addCar(payload))
        .unwrap()
        .then(() => {
          toast.success("Car Created Successfully!");
          closeForm();
          dispatch(fetchCars());
        });
    } catch (error) {
      console.error("Failed to create car", error);
      toast.error("Failed to create car");
    }
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = {
        name: form.name.trim(),
        category: form.category,
        type: form.type,
        numberOfPeople: Number(form.numberOfPeople),
        fuel: Number(form.fuel),
        price: Number(form.price),
        discount: form.discount === "" ? 0 : Number(form.discount),
        pickup: form.pickup,
        dropoff: form.dropoff,
        image: carImage,
        status: isCarAvailable,
        createdAt: Date.now(),
      };

      dispatch(editCar({ id: selectedEditCar.id, carData: payload }))
        .unwrap()
        .then(() => {
          toast.success("Car Updated Successfully!");
          closeForm();
          dispatch(fetchCars());
        });
    } catch (error) {
      console.error("Failed to update car", error);
      toast.error("Failed to update car");
    }
  };

  const closeForm = () => {
    setForm({
      name: "",
      category: "",
      type: "",
      numberOfPeople: "",
      fuel: "",
      price: "",
      discount: "",
      pickup: "",
      dropoff: "",
      image: "",
    });
    setIsCarAvailable(false);
    onCloseCarForm();
    setSelectedEditCar(null);
  };

  return (
    <div className="bg-black/50 h-full w-full fixed inset-0 z-[1000] flex items-center justify-center top-0 px-10">
      <div className="bg-white dark:bg-gray-600 rounded-2xl shadow-sm border border-gray-100 p-6 max-w-[600px] w-full h-[550px] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-6 sticky">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Create new car</h2>
            <p>Add a vehicle to your inventory and set rental details.</p>
            <span className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Fields marked with * are required.
            </span>
          </div>

          <button
            className="bg-transparent border-none outline-none text-xl"
            onClick={closeForm}
          >
            <i className="fa fa-close"></i>
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Car name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nissan GT-R"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>

            <div>
              <Input
                label="Image URL *"
                name="image"
                accept="image/*"
                type="file"
                onChange={handleUpload}
                placeholder="/images/nissan-gt-r.png"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>

            <div>
              <Select
                label="Category *"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                <option value="">Select category</option>
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="sport">Sport</option>
                <option value="hatchback">Hatchback</option>
              </Select>
            </div>

            <div>
              <Select
                label="Transmission *"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                <option value="">Select transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </Select>
            </div>

            <div>
              <Input
                label="Seats *"
                name="numberOfPeople"
                value={form.numberOfPeople}
                onChange={handleChange}
                placeholder="4"
                required
                type="number"
                min={1}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>

            <div>
              <Input
                label="Fuel Capacity (L) *"
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
                placeholder="70"
                required
                type="number"
                min={1}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>

            <div>
              <Input
                label="Price per day *"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="120"
                required
                type="number"
                min={0}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>

            <div>
              <Input
                label="Discount (%)"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="10"
                type="number"
                min={0}
                max="100"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              ></Input>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Pick-up Location *"
                name="pickup"
                value={form.pickup}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                <option value="">Select pickup</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label="Dropoff Location *"
                name="dropoff"
                value={form.dropoff}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                <option value="">Select dropoff</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isCarAvailable}
              onChange={(e) => setIsCarAvailable(e.target.checked)}
            />
            <label htmlFor="status">Is the car available?</label>
          </div>

          <div className="flex flex-col gap-3border-t border-gray-100 pt-6">
            <div className="text-sm">
              All changes are saved to the admin review queue.
            </div>
            <div className="flex justify-end gap-3">
              {selectedEditCar?.id ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleUpdateCar}
                >
                  {car.loading ? (
                    <span className="flex items-center gap-1">
                      <Loader></Loader> Loading...
                    </span>
                  ) : (
                    "Update Car"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateCar}
                >
                  {car.loading ? (
                    <span className="flex items-center gap-1">
                      <Loader></Loader> Loading...
                    </span>
                  ) : (
                    "Create Car"
                  )}
                </Button>
              )}

              <Button
                children="Close"
                type="button"
                variant="secondary"
                onClick={closeForm}
              ></Button>
            </div>
            {car.error && (
              <span className="text-red-500 text-sm">{car.error}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCarForm;
