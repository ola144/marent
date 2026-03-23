import React from "react";

interface Banner2Props {
  title: string;
  subTitle: string;
  description: string;
}

const Banner2: React.FC<Banner2Props> = ({ title, subTitle, description }) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 dark:from-gray-950 to-blue-800 dark:to-gray-800 text-white py-16">
      <div className="parent">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
            {title}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-3">
            {subTitle}
          </h1>
          <p className="text-lg text-blue-100 mt-4">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default Banner2;
