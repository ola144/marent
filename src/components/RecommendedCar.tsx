/* eslint-disable react-hooks/purity */
import React, { useMemo } from "react";
import { CarCard } from "./CarCard";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";
import Loader from "./Loader";

const RecommendedCar: React.FC = () => {
  const navigate = useNavigate();

  const car = useAppSelector((state) => state.cars);

  const recommendedCars = useMemo(() => {
    const allCars = car.cars;

    return [...allCars].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [car]);

  return (
    <section className="flex flex-col gap-3 my-10">
      <h2 className="text-gray-400 font-semibold text-2xl">Recommended Car</h2>
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
          {recommendedCars.length === 0 ? (
            <p className="text-center text-gray-600">
              No cars match your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedCars.map((car: ICar) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex justify-center">
        <Button
          children="Show More Car"
          variant="primary"
          onClick={() => navigate("/all-cars")}
        ></Button>
      </div>
    </section>
  );
};

export default RecommendedCar;
