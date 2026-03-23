import React from "react";
import Banner from "../components/Banner";
import { privacy, privacyContent } from "../data";

const Privacy: React.FC = () => {
  return (
    <div className="mt-20">
      <Banner
        title="Privacy & Policy"
        description="We value your privacy. This policy explains how Marent collects, uses, and protects your data."
      />

      <section className="py-16 bg-gray-50">
        <div className="parent">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-sm text-gray-500 mb-6">
                Last updated: March 1, 2026
              </p>
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">
                Marent collects limited personal data to deliver rentals,
                improve our service, and meet legal obligations. We never sell
                your data and only share it with trusted partners when necessary
                to complete your booking.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {privacy.map((item) => (
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
                <li>1. Information We Collect</li>
                <li>2. How We Use Information</li>
                <li>3. Sharing & Disclosure</li>
                <li>4. Cookies & Analytics</li>
                <li>5. Data Retention</li>
                <li>6. Your Rights</li>
                <li>7. Security</li>
                <li>8. Children&apos;s Privacy</li>
                <li>9. Policy Updates</li>
                <li>10. Contact</li>
              </ul>
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700 font-semibold">
                  Questions?
                </p>
                <p className="text-sm text-blue-700">
                  Reach our privacy team for data access or deletion requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="parent">
          <div className="grid gap-8">
            {privacyContent.map((section) => (
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

export default Privacy;
