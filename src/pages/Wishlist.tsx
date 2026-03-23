/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getWishlist } from "../core/wishlist/wishlistSlice";
import type { ICar } from "../core/car/carType";
import { CarCard } from "../components/CarCard";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.cars.cars);
  const wishlist = useAppSelector((state) => state.wishlist);

  const wishlistCarIds = wishlist.wishlist.map((item) => item.carId);

  const wishlistCars = useMemo(
    () => cars.filter((car: any) => wishlistCarIds.includes(car.id)),
    [cars, wishlistCarIds],
  );

  const totals = useMemo(() => {
    const full = wishlistCars.reduce(
      (sum: number, car: any) => sum + car.price,
      0,
    );
    const discounted = wishlistCars.reduce((sum: number, car: any) => {
      const price = car.price - (car.price * car.discount) / 100;
      return sum + price;
    }, 0);
    return {
      full,
      discounted,
      saved: Math.max(0, full - discounted),
    };
  }, [wishlistCars]);

  useEffect(() => {
    dispatch(getWishlist())
      .unwrap()
      .then(() => {})
      .catch((error) => toast.error(error.message));
  }, [dispatch]);

  return (
    <div className="pt-20 mb-10">
      <Banner
        title="Your Wishlist"
        description="Save cars you love and compare options side by side. Ready when you are."
      />

      <div className="parent mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-100">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-semibold">{wishlistCars.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily Total</span>
                  <span className="font-semibold">
                    #{totals.discounted.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>You Save</span>
                  <span className="font-semibold text-emerald-600">
                    #{totals.saved.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link to="/all-cars">
                  <Button variant="primary" className="w-full">
                    Browse Cars
                  </Button>
                </Link>
                {/* <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => dispatch(clearWishlist())}
                  disabled={wishlistCars.length === 0}
                >
                  Clear Wishlist
                </Button> */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Saved Cars
              </h2>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                {wishlistCars.length} cars
              </span>
            </div>

            {wishlist.loading ? (
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
                {wishlistCars.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
                    <div className="mx-auto mb-4 size-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <i className="fa fa-heart-o text-2xl"></i>
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                      Your wishlist is empty
                    </p>
                    <p className="text-gray-500 dark:text-gray-200 mb-6">
                      Explore the fleet and tap the heart icon to save cars for
                      later.
                    </p>
                    <Link to="/all-cars">
                      <Button variant="primary">Find Cars</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistCars.map((car: ICar) => (
                      <CarCard car={car} key={car.id}></CarCard>
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

export default Wishlist;
