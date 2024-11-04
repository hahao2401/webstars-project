import React, { useState } from 'react';
import logo1 from '../../assets/logo1.png';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

function HomeA() {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 p-4">
        <Link to="/" className="flex items-center pb-4 border-b border-b-white-800">
          <img src={logo1} alt="logo1" className="w-52 h-28 rounded object-cover" />
        </Link>
        <ul className="mt-10">
          <li>
            <Link to="/admin/categlory" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-bar-chart-horizontal-line mr-3"></i> Categlorys
            </Link>
            <Link to="/admin/sp" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-archive-line mr-3"></i> Products
            </Link>
            <Link to="/admin/account" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-account-circle-fill mr-3"></i> Account
            </Link>
            <Link to="/admin/order" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-shopping-bag-3-line mr-3"></i> Order
            </Link>
            <Link to="/admin/discount-code" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-coupon-3-line mr-3"></i> Discount code
            </Link>
          </li>
        </ul>
      </div>

      <main className="w-[calc(100%-256px)] ml-64">
        <div className="py-2 px-4 bg-white flex items-center shadow-md shadow-black/5">
          <button type="button" className="text-lg text-gray-600">
            <i className="ri-menu-line"></i>
          </button>
          <ul className="flex items-center text-sm ml-4">
            <li className="mr-1">
              <Link to="/admin/dash" className="text-gray-400 hover:text-gray-600 font-medium">
                DashBoard
              </Link>
            </li>
          </ul>
          <ul className="ml-auto flex items-center">
            <li className="mr-1">
              <button
                type="button"
                className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
                onClick={toggleSearchForm}
              >
                <i className="ri-search-line"></i>
              </button>
            </li>
            <li className="mr-1">
              <button
                type="button"
                className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
              >
                <i className="ri-notification-line"></i>
              </button>
            </li>
            <li className="relative"> {/* Make this li relative for dropdown positioning */}
              <button type="button" onClick={toggleDropdown}>
                <img src={logo1} alt="" className="w-10 h-10 rounded block object-cover" />
              </button>
              {showDropdown && ( // Show dropdown if the state is true
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-50">
                  <Link to="/admin/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Search Form */}
        {showSearchForm && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded p-4 z-50">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        )}
      </main>
    </>
  );
}

export default HomeA;
