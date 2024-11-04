import React, { useState, useEffect } from 'react';
import logo1 from '../../assets/logo1.png';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

function Categlory() {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dm');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle category deletion
  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/admin/dm/${id}`);
      // Filter out the deleted category from the state
      setCategories(categories.filter(category => category.id !== id));
      alert(response.data.thongbao); // Show success message
    } catch (error) {
      console.error("Error deleting category:", error);
      alert('Lỗi khi xóa danh mục');
    }
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
              <i className="ri-bar-chart-horizontal-line mr-3"></i> Categories
            </Link>
            <Link to="/admin/sp" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-archive-line mr-3"></i> Products
            </Link>
            <Link to="/admin/account" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-account-circle-fill mr-3"></i> Account
            </Link>
            <Link to="/admin/order" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-shopping-bag-3-line mr-3"></i> Orders
            </Link>
            <Link to="/admin/discount-code" className="flex items-center py-2 px-4 text-white hover:bg-slate-300 hover:text-gray-700">
              <i className="ri-coupon-3-line mr-3"></i> Discount codes
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
                Dashboard
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
            <li>
              <button type="button">
                <img src={logo1} alt="" className="w-10 h-10 rounded block object-cover" />
              </button>
            </li>
          </ul>
        </div>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Link to='/admin/add-categlory'>Add</Link>
        </button>
        {showSearchForm && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded p-4 z-50">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        )}

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Danh sách Danh mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 border rounded shadow">
                <img 
                  src={category.img} 
                  alt={category.tendm} 
                  className="w-full h-32 object-cover rounded mb-2" 
                />
                <h3 className="text-lg font-semibold">{category.tendm}</h3>
                <p>ID: {category.id}</p>
                <button 
                  onClick={() => handleDeleteCategory(category.id)} 
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Categlory;
