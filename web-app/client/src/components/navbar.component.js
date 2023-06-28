import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Navbar extends Component {
  render() {
    const userid = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("role");
    console.log(role);
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="collapse navbar-collapse justify-content-center" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="nav-link" style={{ color: 'rgba(255,255,255,.5)', paddingLeft: '15px', paddingRight: '15px'}}>Welcome {userid} - ({role})</div>
          <div className="navbar-brand">SupplyChain</div>
          <ul className="navbar-nav ml-auto">
            <li className="navbar-item">
              <Link to="/createUser" className="nav-link">
                Create User
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/createProduct" className="nav-link">
                Create Product
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/importProducts" className="nav-link">
                Import Products
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/importInventoryItems" className="nav-link">
                Import Inventory Items
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/importShipments" className="nav-link">
                Import Shipments
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/importShipmentItems" className="nav-link">
                Import Shipment Items
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/users" className="nav-link">
                Users
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/inventoryitems" className="nav-link">
                Inventory Items
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/shipments" className="nav-link">
                Shipments
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;