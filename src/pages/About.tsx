import React, { useRef } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { teams } from "../data";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

const About: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Banner
        title="About Marent"
        description="Your trusted partner for premium car rental services. We make
              getting around simple, affordable, and enjoyable."
      ></Banner>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-900 mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-white">Cars in Fleet</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-900 mb-2">
                10K+
              </div>
              <div className="text-gray-600 dark:text-white">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-900 mb-2">
                50+
              </div>
              <div className="text-gray-600 dark:text-white">Locations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-900 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-white">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 parent">
        <div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-white text-justify mb-6">
                At MoreRent, we believe that mobility should be accessible to
                everyone. Our mission is to provide high-quality, affordable car
                rental services that exceed customer expectations while
                maintaining the highest standards of safety and reliability.
              </p>
              <p className="text-lg text-gray-600 dark:text-white text-justify">
                Whether you're planning a road trip, need a vehicle for
                business, or require transportation for special occasions, we're
                here to make your journey seamless and memorable.
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/hero-car-1.png"
                alt="Car rental mission"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="parent">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose MoreRent?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-100 max-w-2xl mx-auto">
              We offer more than just cars – we provide peace of mind,
              convenience, and exceptional service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600 dark:text-gray-200">
                All our vehicles undergo rigorous maintenance and safety checks
                before each rental.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Competitive rates with no hidden fees. Get the best value for
                your money.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Round-the-clock customer support to assist you whenever you need
                help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="parent">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-white max-w-2xl mx-auto">
              Our dedicated team of professionals is committed to providing you
              with the best car rental experience.
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
          >
            {teams.map((team, index) => (
              <SwiperSlide key={index}>
                <div className="shadow-md dark:shadow-white dark:shadow-sm rounded-xl p-4 m-1 text-center w-full h-full">
                  <img
                    src={team.img}
                    alt={team.name}
                    className="mx-auto w-full h-[400px]"
                  />
                  <div className=" flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {team.role}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your perfect car today and experience the MoreRent difference.
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

export default About;
