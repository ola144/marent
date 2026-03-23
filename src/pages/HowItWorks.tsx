import React from "react";
import { Button } from "../components/Button";
import Banner from "../components/Banner";
import { useNavigate } from "react-router-dom";

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-20">
      {/* Hero Section */}
      <Banner
        title="How It Works"
        description="Renting a car has never been easier. Follow three simple steps to get on the road."
      ></Banner>

      {/* Steps Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Car</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our extensive fleet and select the vehicle that fits your
                needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reserve your car in just a few clicks with our secure booking
                system.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Drive & Enjoy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pick up your vehicle at the designated location and hit the
                road.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our car collection and book your ride today.
          </p>
          <Button
            children="Browse Cars"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            variant="secondary"
            onClick={() => navigate("/all-cars")}
          />
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
