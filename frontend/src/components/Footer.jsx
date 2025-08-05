import React from "react";

const Footer = () => {
  return (
    <footer className=" text-gray-800 py-10 px-4 md:px-16 bg-gray-100 border-t border-gray-200 max-w-screen-xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <a
            href="https://elevatebox.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1 className="text-xl font-bold text-blue-700 mb-2 hover:underline cursor-pointer">
              Elevate Box
            </h1>
          </a>{" "}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">General</h2>
          <ul className="space-y-1 text-sm">
            <li>Sign Up</li>
            <li>Help Center</li>
            <li>About</li>
            <li>Press</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Developers</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Browse LinkedIn</h2>
          <ul className="space-y-1 text-sm">
            <li>Learning</li>
            <li>Jobs</li>
            <li>Games</li>
            <li>Salary</li>
            <li>Mobile</li>
            <li>Services</li>
            <li>Products</li>
            <li>Top Companies Hub</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Business Solutions</h2>
          <ul className="space-y-1 text-sm">
            <li>Talent</li>
            <li>Marketing</li>
            <li>Sales</li>
            <li>Learning</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
