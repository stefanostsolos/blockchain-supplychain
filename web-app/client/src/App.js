import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import SignIn from "./components/signIn.component";
import CreateUser from "./components/create-user.component";
import CreateProduct from "./components/create-product.component";
import ImportOrders from "./components/import-orders.component";
import ImportProducts from "./components/import-products.component";
import ImportInventoryItems from "./components/import-inventory-items.component";
import CreateOrder from "./components/create-order.component";
//import EditUser from "./components/edit-user.component";
import EditProduct from "./components/edit-product.component";
import EditInventoryItem from "./components/edit-item.component";
import UsersList from "./components/users-list.component";
import ProductsList from "./components/products-list.component";
import InventoryItemsList from "./components/inventory-items-list.component";
import OrdersList from "./components/orders-list.component";
import ProductHistory from "./components/product-history.component";
import InventoryItemHistory from "./components/inventory-item-history.component"
import ImportShipments from "./components/import-shipments.component";
import ImportShipmentItems from "./components/import-shipment-items.component";
import ShipmentsList from "./components/shipments-list.component";

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
          <Route path="/inventoryitems" element={<InventoryItemsList />} />
          <Route path="/importOrders" element={<ImportOrders />} />
          <Route path="/importProducts" element={<ImportProducts />} />
          <Route path="/importInventoryItems" element={<ImportInventoryItems />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/createOrder" element={<CreateOrder />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/edititem/:id" element={<EditInventoryItem />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/history/:id" element={<ProductHistory />} />
          <Route path="/itemhistory/:id" element={<InventoryItemHistory />} />
          <Route path="/importShipments" element={<ImportShipments />} />
          <Route path="/importShipmentItems" element={<ImportShipmentItems />} />
          <Route path="/shipments" element={<ShipmentsList />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;