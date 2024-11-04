import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [tendm, setTendm] = useState('');
  const [img, setImg] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newCategory = {
      tendm,
      img,
    };

    try {
      const response = await axios.post('http://localhost:3000/admin/dm', newCategory);
      setMessage(response.data.thongbao);

      // Navigate to the category list page
      navigate('/admin/categlory');  // Adjust this route according to your routing setup

      // Clear the form fields (optional)
      setTendm('');
      setImg('');
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Lỗi khi thêm danh mục');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Thêm Danh Mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên Danh Mục:</label>
          <input 
            type="text" 
            value={tendm} 
            onChange={(e) => setTendm(e.target.value)} 
            required 
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ảnh:</label>
          <input 
            type="text" 
            value={img} 
            onChange={(e) => setImg(e.target.value)} 
            required 
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Thêm Danh Mục
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}

export default AddCategory;
