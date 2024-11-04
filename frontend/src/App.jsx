import { Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Products from './pages/User/Products';
import Cart from './pages/User/Cart';
import NavBar from './components/User/NavBar';
import Footer from './components/User/Footer';


function App() {
  return (
    <>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/product' element={<Products />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
