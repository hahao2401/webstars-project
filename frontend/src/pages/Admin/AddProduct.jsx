import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [product, setProduct] = useState({
    ten_sp: '',
    gia: '',
    gia_km: '',
    img: '',
    ngay: '',
    view: 0,
    iddm: '' // id danh mục sản phẩm
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/admin/sp', product);
      alert(response.data.thongbao);

      // Navigate to the product list page
      navigate('/admin/sp'); // Adjust this route according to your routing setup

      // Reset the form fields
      setProduct({
        ten_sp: '',
        gia: '',
        gia_km: '',
        img: '',
        ngay: '',
        view: 0,
        iddm: ''
      });
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Thêm Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Tên Sản Phẩm:</label>
          <input 
            type="text" 
            name="ten_sp" 
            value={product.ten_sp} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giá:</label>
          <input 
            type="number" 
            name="gia" 
            value={product.gia} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giá Khuyến Mãi:</label>
          <input 
            type="number" 
            name="gia_km" 
            value={product.gia_km} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Hình Ảnh:</label>
          <input 
            type="text" 
            name="img" 
            value={product.img} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ngày:</label>
          <input 
            type="date" 
            name="ngay" 
            value={product.ngay} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ID Danh Mục:</label>
          <input 
            type="number" 
            name="iddm" 
            value={product.iddm} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Thêm Sản Phẩm
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
