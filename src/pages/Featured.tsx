/* eslint-disable react-hooks/purity */
import React, { useMemo } from "react";
import { CarCard } from "../components/CarCard";
import Banner from "../components/Banner";
import { useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";

const Featured: React.FC = () => {
  const cars = useAppSelector((state) => state.cars.cars);

  const popularCars = useMemo(() => {
    const allCars = cars;

    return [...allCars].slice(0, 4);
  }, [cars]);

  const recommendedCars = useMemo(() => {
    const allCars = cars;

    return [...allCars].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [cars]);

  return (
    <div className="mt-20">
      {/* Hero Section */}
      <Banner
        title="Featured Cars"
        description="Discover our most popular and highly recommended vehicles
              handpicked just for you."
      ></Banner>

      {/* Popular Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Most Popular</h2>
            <p className="text-gray-600 dark:text-gray-100">
              These cars are trending and loved by our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.map((car: ICar) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Recommended For You</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Handpicked selections based on your preferences.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCars.map((car: ICar) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Featured;
