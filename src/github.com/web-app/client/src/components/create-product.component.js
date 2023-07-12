import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.onChangeShipmentName = this.onChangeShipmentName.bind(this);
    this.onChangeProductName = this.onChangeProductName.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      shipment_name: "",
      product_name: "",
      quantity: 1,
    };
  }

  onChangeShipmentName(e) {
    this.setState({
      shipment_name: e.target.value,
    });
  }

  onChangeProductName(e) {
    this.setState({
      product_name: e.target.value,
    });
  }
  
  onChangeQuantity(e) {
    this.setState({
      quantity: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const product = {
      shipmentname: this.state.shipment_name,
      name: this.state.product_name,
      price: this.state.price,
      quantity: this.state.quantity,
      producttype: "InventoryItem",
    };

    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };

    console.log(product);

    axios
      .post("http://localhost:8090/product", product, { headers: headers })
      .then((res) => {
      console.log(res);
      window.location = "/products";
      })
      .catch((error) => {
      console.log(error)
      toast.error("User type is not producer. You cannot create a product.", {
            position: toast.POSITION.TOP_CENTER
        })
      });
      
  }

  render() {
    return (
      <div>
        <h3>Create New Product</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>ShipmentName: </label>
            <input
              type="text"
              //required
              className="form-control"
              value={this.state.shipment_name}
              onChange={this.onChangeShipmentName}
            />
          </div>
          <div className="form-group">
            <label>ProductName: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.product_name}
              onChange={this.onChangeProductName}
            />
          </div>
          <div className="form-group">
            <label>Quantity: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.quantity}
              onChange={this.onChangeQuantity}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create Product"
              className="btn btn-primary"
            />
          </div>
        </form>
      <ToastContainer autoClose={2000} theme="dark" />  
      </div>
    );
  }
}

export default CreateProduct;