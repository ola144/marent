import React from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 py-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-300 dark:from-gray-500 via-blue-100 dark:via-gray-300 to-blue-300 dark:to-gray-500 rounded-xl p-4  text-white">
          <div className="lg:w-[350px] w-full flex flex-col gap-4">
            <h1 className="font-extrabold">The Best Platform for Car Rental</h1>
            <p className="mt-4">
              Find your perfect ride at unbeatable prices. Choose from hundreds
              of vehicles and book instantly.
            </p>
            <Button
              children="Rent Car"
              className="w-fit"
              variant="primary"
              onClick={() => navigate("/all-cars")}
            ></Button>
          </div>
          <div className="w-[406px] flex lg:justify-end justify-start mt-5 lg:mt-0">
            <img
              src="/images/hero-car-1.png"
              alt=""
              className="lg:w-[300px] md:w-[250px] w-full hero-car-animate"
            />
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 dark:from-gray-600 via-blue-100 dark:via-gray-300 to-blue-600 dark:to-gray-600 rounded-xl p-4  text-white">
          <div className="lg:w-[350px] w-full flex flex-col gap-4">
            <h1 className="font-extrabold">
              Easy way to rent a car at a low price
            </h1>
            <p className="mt-4">
              Providing cheap car rental services and safe and comfortable
              facilities.
            </p>
            <Button
              children="Rent Car"
              className="w-fit"
              variant="primary2"
              onClick={() => navigate("/all-cars")}
            ></Button>
          </div>
          <div className="w-[406px] flex lg:justify-end justify-start mt-5 lg:mt-0">
            <img
              src="/images/hero-car-2.png"
              alt=""
              className="lg:w-[300px] md:w-[250px] w-full hero-car-animate"
            />
          </div>
        </div>
      </div>
    </>
  );
};
