import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      {/* Social Media Links */}
      <div className="flex justify-center mb-6">
        <a href="#" className="mx-4"><i className="fab fa-facebook-f text-white text-2xl"></i></a>
        <a href="#" className="mx-4"><i className="fab fa-twitter text-white text-2xl"></i></a>
        <a href="#" className="mx-4"><i className="fab fa-google-plus-g text-white text-2xl"></i></a>
        <a href="#" className="mx-4"><i className="fab fa-youtube text-white text-2xl"></i></a>
        <a href="#" className="mx-4"><i className="fab fa-instagram text-white text-2xl"></i></a>
        <a href="#" className="mx-4"><i className="fab fa-linkedin-in text-white text-2xl"></i></a>
      </div>

      {/* Links Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-16">
        {/* Bid Platform */}
        <div>
          <h4 className="text-yellow-500 text-lg mb-4">Bid Platform</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-400">How It Works</a></li>
            <li><a href="#" className="hover:text-yellow-400">Pricing</a></li>
            <li><a href="#" className="hover:text-yellow-400">Bidding Guidelines</a></li>
            <li><a href="#" className="hover:text-yellow-400">Support</a></li>
            <li><a href="#" className="hover:text-yellow-400">Terms of Use</a></li>
          </ul>
        </div>

        {/* Bidding Strategies */}
        <div>
          <h4 className="text-yellow-500 text-lg mb-4">Bidding Strategies</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-400">Maximize Your Bids</a></li>
            <li><a href="#" className="hover:text-yellow-400">Understand Bid Timing</a></li>
            <li><a href="#" className="hover:text-yellow-400">Analyze Competitor Bids</a></li>
            <li><a href="#" className="hover:text-yellow-400">Winning Strategies</a></li>
          </ul>
        </div>

        {/* Service */}
        <div>
          <h4 className="text-yellow-500 text-lg mb-4">Service</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-yellow-400">Compare</a></li>
            <li><a href="#" className="hover:text-yellow-400">Download</a></li>
            <li><a href="#" className="hover:text-yellow-400">Feedback</a></li>
            <li><a href="#" className="hover:text-yellow-400">Bug Report</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-yellow-500 text-lg mb-4">Contact Us</h4>
          <ul className="space-y-2">
            <li><a href="mailto:support@bidplatform.com" className="hover:text-yellow-400">Email: support@bidplatform.com</a></li>
            <li><a href="tel:+1234567890" className="hover:text-yellow-400">Phone: +1 (234) 567-890</a></li>
            <li><a href="#" className="hover:text-yellow-400">Contact Form</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 md:mt-0">
          <h4 className="text-yellow-500 text-lg mb-4">Newsletter Subscription</h4>
          <form>
            <input type="email" placeholder="Subscribe to our newsletter" className="p-2 w-48 md:w-60 border-none text-black mb-2" />
            <button type="submit" className="p-2 bg-yellow-500 text-white hover:bg-yellow-400">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-6">
        <p>Copyright © 2024 Bid Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
