import React from "react";
import { useNavigate } from "react-router-dom";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white dark:bg-gray-800 w-full py-10">
      <div className="parent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h4 className="font-bold uppercase mb-2 text-blue-600 text-2xl">
              Marent
            </h4>
            <p className="text-sm text-gray-600 dark:text-white">
              Our vision is to provide convenience and make sure you enjoy your
              trips.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold mb-2 text-2xl">About</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <a
                  className="cursor-pointer dark:text-gray-100"
                  onClick={() => navigate("/how-it-works")}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer dark:text-gray-100"
                  onClick={() => navigate("/featured")}
                >
                  Featured
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer dark:text-gray-100"
                  onClick={() => navigate("/partnership")}
                >
                  Partnership
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-2xl">Socials</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <a
                  href="https://x.com/"
                  target="_blank"
                  className="cursor-pointer dark:text-gray-100"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  className="cursor-pointer dark:text-gray-100"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://web.facebook.com/"
                  target="_blank"
                  className="cursor-pointer dark:text-gray-100"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-900 dark:text-white flex items-center sm:justify-between gap-y-2 border-t pt-5 border-gray-900  dark:border-white flex-wrap justify-center gap-x-4">
          <span className="font-bold">
            © {new Date().getFullYear()} Marent. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              className="cursor-pointer dark:text-gray-100"
              onClick={() => navigate("/privacy")}
            >
              Privacy & Policy
            </a>
            <a
              className="cursor-pointer dark:text-gray-100"
              onClick={() => navigate("/terms")}
            >
              Terms & Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
