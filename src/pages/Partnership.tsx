import React from "react";
import Banner from "../components/Banner";
import { stepsToPartnerWithUs, whyPartnerWithUs } from "../data";

const Partnership: React.FC = () => {
  return (
    <div className="mt-20">
      <Banner
        title="Partnerships"
        description="Grow with Marent. We partner with fleets, dealerships, and local operators to deliver exceptional rental experiences."
      />

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-400 p-8">
              <p className="text-sm text-gray-500 dark:text-white mb-6">
                Last updated: March 1, 2026
              </p>
              <h2 className="text-3xl font-bold mb-4">Why Partner With Us</h2>
              <p className="text-gray-600 dark:text-white mb-6">
                Marent helps partners increase utilization, reach new customers,
                and streamline operations with simple onboarding and transparent
                revenue sharing.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {whyPartnerWithUs.map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-xl border border-gray-100 dark:border-gray-400 bg-gray-50 dark:bg-gray-500"
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-white text-sm">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-500 p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Partner Tracks</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-50">
                <li>Fleet Owners & Operators</li>
                <li>Dealerships</li>
                <li>Corporate Mobility</li>
                <li>Hotels & Travel Agencies</li>
                <li>Local Chauffeur Services</li>
              </ul>
              <div className="mt-6 rounded-xl bg-blue-50 dark:bg-gray-500 p-4">
                <p className="text-sm text-blue-700 dark:text-white font-semibold">
                  Get started
                </p>
                <p className="text-sm text-blue-700 dark:text-gray-200">
                  Email partnerships@marent.com to begin onboarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="parent">
          <div className="grid md:grid-cols-3 gap-6">
            {stepsToPartnerWithUs.map((step) => (
              <div
                key={step.title}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-500 p-8"
              >
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-100">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 dark:bg-gray-700 text-white">
        <div className="parent text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner With Marent?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join a growing network of mobility partners and increase your
            revenue with a trusted rental marketplace.
          </p>
          <a
            className="bg-white dark:bg-gray-500 text-blue-600 dark:text-white hover:bg-gray-100 px-8 py-3 rounded-full font-semibold"
            href="mailto:partnerships@marent.com"
            target="_black"
          >
            Contact Partnerships
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partnership;
