import React from "react";
import { Select } from "./Select";
// import { Input } from "./Input";
import { Button } from "./Button";
import { states } from "../data";
// import { allCars } from "../data/cars";

interface SearchFormProps {
  filters: {
    pickup: string;
    dropoff: string;
    // category: string;
    // date: string;
  };
  onChange: (name: string, value: string) => void;
  onSearch: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  filters,
  onChange,
  onSearch,
}) => {
  // const categories = Array.from(new Set(allCars.map((car) => car.category)));

  return (
    <>
      <div className="bg-white dark:bg-gray-700 shadow py-6 rounded-lg parent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Select
              label="Pick-up"
              value={filters.pickup}
              onChange={(e) => onChange("pickup", e.target.value)}
            >
              <option value="">Select Pick Up</option>
              {states.map((state, index) => (
                <option value={state} key={index}>
                  {state}
                </option>
              ))}
            </Select>
            <Select
              label="Drop-off"
              value={filters.dropoff}
              onChange={(e) => onChange("dropoff", e.target.value)}
            >
              <option value="">Select Dropoff</option>
              {states.map((state, index) => (
                <option value={state} key={index}>
                  {state}
                </option>
              ))}
            </Select>
            {/* <Select
              label="Type"
              value={filters.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="capitalize"
            >
              <option value="">Any</option>
              {categories.map((cat, index) => (
                <option value={cat} key={index}>
                  {cat}
                </option>
              ))}
            </Select> */}
            {/* <Input
              label="Date"
              type="date"
              value={filters.date}
              onChange={(e) => onChange("date", e.target.value)}
            /> */}
          </div>

          <div className="md:col-span-4 flex justify-center mt-4">
            <Button
              type="submit"
              className="w-fit md:w-auto disabled:cursor-no-drop disabled:bg-gray-500 dark:disabled:bg-gray-300"
              disabled={!filters.pickup || !filters.dropoff}
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
