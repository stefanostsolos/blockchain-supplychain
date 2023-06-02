import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Navbar extends Component {
  render() {
    const role = sessionStorage.getItem("role");
    console.log(role);
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="collapse navbar-collapse justify-content-center" style={{ display: 'flex', justifyContent: 'center' }}>
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
              <Link to="/updateUser" className="nav-link">
                Edit User
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/updateProduct" className="nav-link">
                Edit Product
              </Link>
            </li>
            {/* <li className="navbar-item">
              <Link to="/createOrder" className="nav-link">
                Create Order
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
            </li> */}
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