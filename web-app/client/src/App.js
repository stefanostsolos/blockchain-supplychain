import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import SignIn from "./components/signIn.component";
import CreateUser from "./components/create-user.component";
import CreateProduct from "./components/create-product.component";
import CreateOrder from "./components/create-order.component";
import EditUser from "./components/edit-user.component";
import EditProduct from "./components/edit-product.component";
import UsersList from "./components/users-list.component";
import ProductsList from "./components/products-list.component";
import OrdersList from "./components/orders-list.component";

function App() {
  const role = sessionStorage.getItem("role");
  console.log(role)
  return (
    <Router>
     <div style={{ backgroundColor: '#0A0A0A', color: '#ffffff', minHeight: '100vh' }}> 
      <div style={{ borderRadius: '80px', overflow: 'hidden' }}>
        <Navbar />
      </div>
      <br />
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/createOrder" element={<CreateOrder />} />
          <Route path="/updateUser/:id" element={<EditUser />} />
          <Route path="/edit/:id" element={<EditProduct /> } />
          <Route path="/users" element={<UsersList />} />
          <Route path="/orders" element={<OrdersList />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;