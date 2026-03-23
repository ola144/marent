import React, { useMemo } from "react";
import { CarCard } from "./CarCard";
import { useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";
import Loader from "./Loader";

const PopularCar: React.FC = () => {
  const car = useAppSelector((state) => state.cars);

  const popularCars = useMemo(() => {
    const allCars = car.cars;

    return [...allCars].slice(0, 4);
  }, [car]);

  return (
    <section className="flex flex-col gap-3 my-10">
      <h2 className="text-gray-400 font-semibold text-2xl">Popular Car</h2>
      {car.loading ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
          <div className="mx-auto flex items-center justify-center">
            <Loader></Loader>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {popularCars.length === 0 ? (
            <p className="text-center text-gray-600">
              No cars match your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularCars.map((car: ICar) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PopularCar;
