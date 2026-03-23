export interface ICar {
  id?: string;
  name: string;
  category: string;
  type: string;
  numberOfPeople: number;
  fuel: number;
  price: number;
  discount: number;
  pickup: string;
  dropoff: string;
  days: number;
  image: string;
  status?: boolean;
  createdAt: number;
}

export interface IWishlist {
  id: string | undefined;
  userId: string;
  carId: string;
}

export interface IBooking {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  license: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string;
  status: string;
  estimatedPrice: number;
  bookedCar: IBookedCar;
  createdAt: Date;
  time: Date;
}

interface IBookedCar {
  category: string;
  createdAt: string;
  days: number;
  discount: number;
  dropoff: string;
  fuel: string;
  id: string;
  image: string;
  name: string;
  numberOfPeople: number;
  pickup: string;
  price: number;
  status: boolean;
  type: string;
}

export interface ITask {
  id?: string;
  task: string;
  isTaskCompleted: boolean;
}
