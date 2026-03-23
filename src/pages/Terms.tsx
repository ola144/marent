import React from "react";
import Banner from "../components/Banner";
import { quickSummary, terms } from "../data";

const Terms: React.FC = () => {
  return (
    <div className="mt-20">
      <Banner
        title="Terms & Conditions"
        description="Please read these terms carefully before booking or using a vehicle with Marent."
      />

      <section className="py-16 bg-gray-50">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-sm text-gray-500 mb-6">
                Last updated: March 1, 2026
              </p>
              <h2 className="text-3xl font-bold mb-4">Quick Summary</h2>
              <p className="text-gray-600 mb-6">
                These Terms & Conditions govern your use of Marent services,
                including reservations, vehicle pickup, and return. By booking,
                you agree to comply with the rules below and any local laws at
                your pickup location.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {quickSummary.map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Contents</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>1. Eligibility & Verification</li>
                <li>2. Reservations & Payments</li>
                <li>3. Pick-up & Return</li>
                <li>4. Mileage, Fuel & Tolls</li>
                <li>5. Prohibited Use</li>
                <li>6. Damage, Loss & Insurance</li>
                <li>7. Cancellations & Refunds</li>
                <li>8. Privacy & Data</li>
                <li>9. Dispute Resolution</li>
                <li>10. Contact</li>
              </ul>
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700 font-semibold">
                  Need help?
                </p>
                <p className="text-sm text-blue-700">
                  Reach our support team 24/7 for booking changes or policy
                  questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="parent">
          <div className="grid gap-8">
            {terms.map((section) => (
              <article
                key={section.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <h3 className="text-2xl font-semibold mb-3">{section.title}</h3>
                <p className="text-gray-600">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
