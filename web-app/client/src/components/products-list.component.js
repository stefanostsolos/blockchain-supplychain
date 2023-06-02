import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Product = (props) => (
  <tr>
    <td>{props.product.ProductID}</td>
    <td>{props.product.Name}</td>
    <td>{props.product.ProducerID}</td>
    <td>{props.product.Date.ProductionDate.substring(0, 10)}</td>
    <td>{props.product.Status}</td>
    <td>{props.product.Price}</td>
    <td>
      <Link to={"/edit/" + props.product.ProductID}>Edit</Link>
    </td>
  </tr>
);

export class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      role: sessionStorage.getItem('role'),
      products: [],
    };
  }

  componentDidMount() {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    
    console.log(headers)
    console.log(this.state.role)
    axios
      .get("http://localhost:8090/product/list/" + this.state.role, { headers: headers })
      .then((response) => {
        console.log(response.data);
        this.setState({
          products: response.data.data,
        });
      })
      .catch((error) => console.log(error.response));
  }

  productsList() {
    return this.state.products.map((currentProduct) => {
      return (
        <Product
          product={currentProduct.Record}
          deleteProduct={this.deleteProduct}
          key={currentProduct.Key}
        />
      );
    });
  }

  render() {
    return (
      <div> 
        <h3>Products List</h3>
        <table className="table" style={{ color: '#ffffff' }}>
          <thead className="thead-light">
            <tr>
              <th>ProductID</th>
              <th>ProductName</th>
              <th>ProducerID</th>
              <th>ProductionDate</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.productsList()}</tbody>
        </table>
      </div>
    );
  }
}

export default ProductsList;