import React, { Component } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function EditProductWrapper() {
  const { id } = useParams();
  return <EditProduct id={id} />;
}

class EditProduct extends Component {
  constructor(props) {
    super(props);

    // method binding
    this.onChangeProductName = this.onChangeProductName.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      product_name: "",
      date: {
        productionDate: new Date(),
        sendToManufacturerDate: new Date(),
        sendToDistributorDate: new Date(),
        sendToRetailerDate: new Date(),
        sellToConsumerDate: new Date(),
        orderedDate: new Date(),
        deliveredDate: new Date(),
      },
      producer_id: "",
      manufacturer_id: "",
      distributor_id: "",
      retailer_id: "",
      consumer_id: "",
      status: "",
      price: 0,
      role: sessionStorage.getItem('role'),
      loggedUserid: sessionStorage.getItem('userId'),
    };
  }

  componentDidMount() {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };

    axios.get("http://localhost:8090/product/" + this.props.id + "/" + this.state.role, { headers: headers })
      .then((response) => {
        this.setState({
          product_name: response.data.data.Name,
          price: response.data.data.Price,
          initialProductName: response.data.data.Name,
          initialPrice: response.data.data.Price,
        })
      })
      .catch((error) => {
        // handle error
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('Product id:', this.props.id);
    console.log('Logged user id:', sessionStorage.getItem('userId'));
    // update the product here
    const product = {
      product_id: this.props.id,
      loggedUserId: sessionStorage.getItem('userId'),
      name: this.state.product_name,
      price: this.state.price,
      //loggedUserType: sessionStorage.getItem("role"), // retrieve the role from session storage
      //loggedUserType: this.state.role, // is it needed?
    };
    console.log(product.product_id);
    console.log(product);

    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };

    axios.put("http://localhost:8090/product/" + this.props.id + "/" + this.state.role, product, { headers: headers })
      .then(res => console.log(res.data))
      .catch(error => console.error(error));
  }

  onChangeProductName(e) {
    this.setState({
      product_name: e.target.value,
    });
  }

  onChangePrice(e) {
    this.setState({
      price: Number(e.target.value),
    });
  }

  //onChangeProducerId(e) {
  //  this.setState({
  //    producer_id: e.target.value,
  //  });
  //}

  //onChangeProductionDate(date) {
  //  const newDate = { ...this.state.date, productionDate: date };
  //  this.setState({ date: newDate });
  //}

  render() {
    return (
      <div>
        <h3>Update Product</h3>
        <form onSubmit={this.onSubmit}>
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
            <label>Price: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.price}
              onChange={this.onChangePrice}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Update Product"
              className="btn btn-primary"
              disabled={this.state.product_name === this.state.initialProductName && this.state.price === this.state.initialPrice}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default EditProductWrapper;
