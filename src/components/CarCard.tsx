import React from "react";
import { Button } from "./Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  getWishlist,
  toggleWishlistItem,
} from "../core/wishlist/wishlistSlice";
import type { ICar } from "../core/car/carType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface Car {
  status: boolean;
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  category: string;
  numberOfPeople: number;
  fuel: number;
  type: string;
  pickup?: string;
  dropoff?: string;
}

interface CarCardProps {
  car: ICar;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const auth = useAppSelector((state) => state.auth.user);

  const wishlist = useAppSelector((state) => state.wishlist.wishlist);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const isWishlisted = car.id
    ? wishlist.some((w) => w.carId === car.id)
    : false;

  const discountPrice = car.price - (car.price * car.discount) / 100;

  const handleBook = (car: ICar) => {
    // alert(`You booked ${car.name} for #${car.price}/day`);

    localStorage.setItem("marentBookNowCar", JSON.stringify(car));

    navigate("/book-now");
  };

  const handleToggleWishlist = async () => {
    if (!car.id) return;

    await dispatch(toggleWishlistItem(car.id))
      .unwrap()
      .then((res) => {
        if (res.type === "added") {
          // state.wishlist.push(action.payload)
          toast("Car added to your wishlist!");
          dispatch(getWishlist());
        } else {
          toast("Car remove from your wishlist!");
          dispatch(getWishlist());
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-0">
          <h3 className="text-lg font-semibold capitalize my-0">{car.name}</h3>
          <span className="text-gray-600 dark:text-gray-100 capitalize my-0">
            {car.category}
          </span>
        </div>
        {auth?.userId && (
          <div className="text-red-600 text-xl">
            <button
              className="bg-transparent p-0"
              type="button"
              onClick={handleToggleWishlist}
              aria-pressed={isWishlisted}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <i className={isWishlisted ? "fa fa-heart" : "fa fa-heart-o"}></i>
            </button>
          </div>
        )}
      </div>

      <img src={car.image} alt={car.name} className="w-full" />

      <div className="flex gap-3 items-center text-[10px] capitalize">
        <span className="text-gray-400 dark:text-gray-100 capitalize">
          <i className="not-italic">⛽︎</i> {car.fuel}L
        </span>
        <span className="text-gray-400 dark:text-gray-100 capitalize">
          <i className="fa fa-gear"></i> {car.type}
        </span>
        <span className="text-gray-400 dark:text-gray-100 capitalize">
          <i className="fa fa-users"></i> {car.numberOfPeople} People
        </span>
        <span className="text-gray-400 dark:text-gray-100 capitalize">
          <i className="fa fa-location-arrow"></i> {car.pickup}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">
            #{discountPrice.toLocaleString()}.00/
            <span className="text-gray-300 text-xs">day</span>
          </h3>
          {car.discount > 0 && (
            <p className="text-gray-600 dark:text-gray-200 capitalize text-sm line-through">
              #{car.price.toLocaleString()}.00
            </p>
          )}
        </div>
        {auth?.userId && (
          <Button
            variant="primary"
            className="w-fit disabled:bg-gray-500"
            type="button"
            disabled={!car.status}
            onClick={() => handleBook(car)}
          >
            {car.status ? "Book Now" : "Unavailable"}
          </Button>
        )}
      </div>
    </div>
  );
};
