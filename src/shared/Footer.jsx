import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { id: 1, name: "About Us", path: "/about" },
    { id: 2, name: "Contact", path: "/contact" },
    { id: 3, name: "Blog", path: "/blog" },
    { id: 4, name: "Careers", path: "/careers" },
  ];

  const quizCategories = [
    { id: 1, name: "Programming", path: "/quizzes/programming" },
    { id: 2, name: "Data Science", path: "/quizzes/data-science" },
    { id: 3, name: "Web Development", path: "/quizzes/web-dev" },
    { id: 4, name: "Machine Learning", path: "/quizzes/ml" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 w-full mt-20">

      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">

            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated
            </h3>

            <p className="mb-6 text-gray-400">
              Get the latest quizzes and learning tips delivered to your inbox
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-80 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
              />

              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                Subscribe
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">

              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                Q
              </div>

              <h2 className="text-2xl font-bold text-white">
                QuizMaster
              </h2>

            </div>

            <p className="text-gray-400 leading-7 mb-4">
              Empowering learners worldwide with interactive quizzes and real-time feedback.
            </p>

            <div className="flex gap-4 text-lg">
              <button className="hover:text-purple-400 transition">📘</button>
              <button className="hover:text-purple-400 transition">💼</button>
              <button className="hover:text-purple-400 transition">📺</button>
              <button className="hover:text-purple-400 transition">🐙</button>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    className="hover:text-purple-400 transition"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quiz Categories
            </h3>

            <ul className="space-y-3">
              {quizCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={category.path}
                    className="hover:text-purple-400 transition"
                  >
                    → {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-400">

              <p>
                📍 123 Learning Street, Education City, EC 12345
              </p>

              <a
                href="mailto:support@quizmaster.com"
                className="block hover:text-purple-400 transition"
              >
                ✉️ support@quizmaster.com
              </a>

              <a
                href="tel:+1234567890"
                className="block hover:text-purple-400 transition"
              >
                📞 +1 (234) 567-890
              </a>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-400">
          © 2024 QuizMaster. All rights reserved. Made with ❤️ for learners worldwide.
        </div>

      </div>

    </footer>
  );
};

export default Footer;