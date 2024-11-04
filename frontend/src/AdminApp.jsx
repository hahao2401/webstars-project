import { Routes, Route } from 'react-router-dom';
import FooterAdmin from './components/Admin/FooterAdmin';
import HomeA from './pages/Admin/HomeA';
import AddProduct from './pages/Admin/AddProduct';
import DeleteProduct from './pages/Admin/DeleteProduct';
import UpdateProduct from './pages/Admin/UpdateProduct';
import Product from './pages/Admin/Product';
import Categlory from './pages/Admin/Categlory';
import Order from './pages/Admin/Order';
import Discountcode from './pages/Admin/Discount code';
import Account from './pages/Admin/Account';
import AddCateglory from './pages/Admin/AddCateglory';

function AdminApp() {
  return (
    <>
      <div>
        <Routes>
          <Route path='dash' element={<HomeA />} />
          <Route path='add-product' element={<AddProduct/>}/>
          <Route path='delete-product' element={<DeleteProduct/>}/>
          <Route path='update-product' element={<UpdateProduct/>}/>
          <Route path='sp' element={<Product/>}/>
          <Route path='account' element={<Account/>}/>
          <Route path='categlory' element={<Categlory/>}/>
          <Route path='add-categlory' element={<AddCateglory/>}/>
          <Route path='order' element={<Order/>}/>
          <Route path='Discount-code' element={<Discountcode/>}/>
        </Routes>
        <FooterAdmin />
      </div>
    </>
  );
}

export default AdminApp;
