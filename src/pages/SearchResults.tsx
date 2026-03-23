import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Banner from "../components/Banner";
import { CarCard } from "../components/CarCard";
import { useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const car = useAppSelector((state) => state.cars);

  const pickup = searchParams.get("pickup");
  const dropoff = searchParams.get("dropoff");

  console.log(pickup, dropoff);

  const results = useMemo(() => {
    return car.cars.filter(
      (car: ICar) => car.pickup === pickup && car.dropoff === dropoff,
    );
  }, [pickup, dropoff, car]);

  return (
    <div className="mt-20 mb-10">
      <Banner
        title="Search Results"
        description="Cars available for your selected pick-up and drop-off locations."
      />

      <div className="parent mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your route</h2>
              <p className="text-gray-600 mt-1">
                {pickup || dropoff ? (
                  <>
                    {pickup ? `Pick-up: ${pickup}` : "Pick-up: Any"} |{" "}
                    {dropoff ? `Drop-off: ${dropoff}` : "Drop-off: Any"}
                  </>
                ) : (
                  "No locations selected yet."
                )}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Modify search
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Available cars
          </h3>
          <span className="font-medium">{results.length} cars found</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-2">
              No cars match your route
            </p>
            <p className="text-gray-500">
              Try a different pick-up or drop-off location.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((car: ICar) => (
              <CarCard
                key={`${car.id}-${car.pickup}-${car.dropoff}`}
                car={car}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
