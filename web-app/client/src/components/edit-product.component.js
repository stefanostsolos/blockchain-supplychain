import React, { Component } from "react";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      productHistory: [],
      date: {
        productionDate: new Date(),
        sendToManufacturerDate: new Date(),
        sendToDistributorDate: new Date(),
        sendToRetailerDate: new Date(),
        sellToConsumerDate: new Date(),
        orderedDate: new Date(),
        deliveredDate: new Date(),
        modifiedDate: new Date(),
      },
      producer_id: "",
      manufacturer_id: "",
      distributor_id: "",
      retailer_id: "",
      consumer_id: "",
      status: "",
      price: 0,
      previousID: "",
      role: sessionStorage.getItem('role'),
      loggedUserId: sessionStorage.getItem('userId'),
    };
  }

  componentDidMount() {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };

    axios.get("http://localhost:8090/product/" + this.props.id + "/" + this.state.role, { headers: headers })
      .then((response) => {
        console.log(response.data.data);
        console.log(response.data.data.InitialProductID);
        this.setState({
          product_name: response.data.data.Name,
          price: response.data.data.Price,
          initialProductName: response.data.data.Name,
          initialPrice: response.data.data.Price,
          initialProductID: response.data.data.InitialProductID,
        }, () => {
          // Fetch product history inside the callback function of setState, this will ensure that the state has been updated before this code runs
          const requestData = {
            id: this.props.id,
            loggedUserId: this.state.loggedUserId,
            initialProductID: this.state.initialProductID,
          };

          axios.post("http://localhost:8090/product/history/" + this.state.role + "/" + this.props.id, requestData, { headers: headers })
            .then((response) => {
              console.log(response.data.data);
              this.setState({ productHistory: response.data.data });
            })
            .catch((error) => {
              console.log(error);
            });
        });
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

    const product = {
      product_id: this.props.id,
      loggedUserId: sessionStorage.getItem('userId'),
      name: this.state.product_name,
      price: this.state.price,
    };
    console.log(product.product_id);
    console.log(product);

    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };

    axios.put("http://localhost:8090/product/" + this.props.id + "/" + this.state.role, product, { headers: headers })
      .then((res) => {
        console.log(res.data);
        toast.success(`Updated product successfully.`, {
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
                window.location = "/products";
            }
       });
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while updating the product.");
      });
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

  render() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <h3>Update Product</h3>
            <form onSubmit={this.onSubmit} style={{ maxWidth: "300px" }}>
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
            <ToastContainer autoClose={2000} theme="dark" />

            <h3>Product History</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
            {this.state.productHistory.map((historyItem, index) => (
                <div 
                    className="card bg-dark text-white m-2" 
                    key={index}
                    style={index === this.state.productHistory.length - 1 ? { borderColor: "green", borderWidth: "2px" } : {}}
                >
                    <div className="card-body">
                        <h5 className="card-title">Version {index + 1}</h5>
                        <p className="card-text">ProductID: {historyItem.ProductID}</p>
                        <p className="card-text">Name: {historyItem.Name}</p>
                        <p className="card-text">Price: {historyItem.Price}</p>
                        <p className="card-text">Status: {historyItem.Status}</p>
                        <p className="card-text">{index === 0 ? 'Production Date' : 'Modified Date'}: {index === 0 ? historyItem.Date.ProductionDate : historyItem.Date.ModifiedDate}</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}


}

export default EditProductWrapper;
