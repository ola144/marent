/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { CarCard } from "../components/CarCard";
import Banner from "../components/Banner";
import { Button } from "../components/Button";
import { useAppSelector } from "../hooks";
import type { ICar } from "../core/car/carType";
import Loader from "../components/Loader";

const AllCars: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPeople, setSelectedPeople] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [priceRange, setPriceRange] = useState(0);

  const car = useAppSelector((state) => state.cars);

  console.log(car.loading);

  // Get unique categories and types from cars data
  const categories = Array.from(
    new Set(car.cars.map((car: any) => car.category)),
  );
  const types = Array.from(new Set(car.cars.map((car: any) => car.type)));
  const maxPrice = Math.max(...car.cars.map((car: any) => car.price));
  // const pickup = Array.from(new Set(car.cars.map((car: any) => car.pickup)));

  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return car.cars.filter((car: any) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || car.category === selectedCategory;

      const matchesType = !selectedType || car.type === selectedType;

      const matchesPickup = !selectedPickup || car.pickup === selectedPickup;

      const matchesPeople =
        !selectedPeople || car.numberOfPeople === parseInt(selectedPeople);

      const matchesPrice = car.price <= priceRange;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesPickup &&
        matchesPeople &&
        matchesPrice
      );
    });
  }, [
    car.cars,
    searchTerm,
    selectedCategory,
    selectedType,
    selectedPickup,
    selectedPeople,
    priceRange,
  ]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
    setSelectedPickup("");
    setSelectedPeople("");
    setPriceRange(maxPrice);
  };

  useEffect(() => {
    setPriceRange(maxPrice);
  }, [car.cars, maxPrice]);

  return (
    <div className="pt-20 mb-10">
      {/* Hero Section */}
      <Banner
        title="Find Your Perfect Car"
        description="Choose from our extensive fleet of vehicles. Filter by category,
              price, and features to find exactly what you need."
      ></Banner>

      {/* Main Content */}
      <div className="parent mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-700 md:p-6 p-2 rounded-lg shadow-md sticky top-20 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Filters</h3>
                <Button
                  children="Reset"
                  variant="secondary"
                  onClick={handleResetFilters}
                ></Button>
              </div>

              {/* Search */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap md:flex-col gap-3 justify-between">
                {/* Category Filter */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={selectedCategory === ""}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-100">
                        All Categories
                      </span>
                    </label>
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-100 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                    Transmission
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value=""
                        checked={selectedType === ""}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-100">
                        All Types
                      </span>
                    </label>
                    {types.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-100 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* People Filter */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                    Number of People
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="people"
                        value=""
                        checked={selectedPeople === ""}
                        onChange={(e) => setSelectedPeople(e.target.value)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-100">
                        Any
                      </span>
                    </label>
                    {[2, 4, 6].map((people) => (
                      <label key={people} className="flex items-center">
                        <input
                          type="radio"
                          name="people"
                          value={people}
                          checked={selectedPeople === people.toString()}
                          onChange={(e) => setSelectedPeople(e.target.value)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-100">
                          {people} People
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                    Max Price: #{priceRange}/day
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-50 mt-2">
                    <span>#0</span>
                    <span>#{maxPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Cars</h2>
              <span className=" font-medium">
                {filteredCars.length} cars found
              </span>
            </div>

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
                {filteredCars.length === 0 ? (
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
                    <p className="text-xl text-gray-600 mb-2">No cars found</p>
                    <p className="text-gray-500">
                      Try adjusting your filters to find more cars.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredCars.map((car: ICar) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCars;

{
  /* Pickup Filter */
}
{
  /* <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-3">
                  Pick Up
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pickup"
                      value=""
                      checked={selectedPickup === ""}
                      onChange={(e) => setSelectedPickup(e.target.value)}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-100">
                      All Pickups
                    </span>
                  </label>
                  {pickup.map((pickup) => (
                    <label key={pickup} className="flex items-center">
                      <input
                        type="radio"
                        name="pickup"
                        value={pickup}
                        checked={selectedPickup === pickup}
                        onChange={(e) => setSelectedPickup(e.target.value)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-100 capitalize">
                        {pickup}
                      </span>
                    </label>
                  ))}
                </div>
              </div> */
}
