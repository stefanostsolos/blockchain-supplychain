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
    this.onChangeInternalName = this.onChangeInternalName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      product_name: "",
      internal_name: "",
      description: "",
      initialProductName: "",
      initialInternalName: "",
      initialDescription: "",
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
      quantity: 1,
      previousID: "",
      role: sessionStorage.getItem('role'),
      loggedUserId: sessionStorage.getItem('userId'),
      initialProductID: "",
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
          product_name: response.data.data.ProductNameID,
          internal_name: response.data.data.InternalName,
          description: response.data.data.Description,
          quantity: response.data.data.Quantity,
          initialProductName: response.data.data.ProductNameID,
          initialInternalName: response.data.data.InternalName,
          initialDescription: response.data.data.Description,
          initialQuantity: response.data.data.Quantity,
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
      internalname: this.state.internal_name,
      description: this.state.description,
      quantity: this.state.quantity,
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

  onChangeInternalName(e) {
    this.setState({
      internal_name: e.target.value,
    });
  }
  
  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangeQuantity(e) {
    this.setState({
      quantity: Number(e.target.value),
    });
  }
  
  compareHistoryItems(previousItem, currentItem) {
    return {
        InternalName: previousItem.InternalName !== currentItem.InternalName,
        Description: previousItem.Description !== currentItem.Description,
        Quantity: previousItem.Quantity !== currentItem.Quantity,
    };
}

  render() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <h3>Update Product</h3>
            <form onSubmit={this.onSubmit} style={{ maxWidth: "300px" }}>
                <div className="form-group">
                    <label className={this.state.internal_name !== this.state.initialInternalName ? "text-success" : ""}>InternalName: </label>
                    <input
                        type="text"
                        required
                        className={`form-control ${this.state.internal_name !== this.state.initialInternalName ? "text-success" : ""}`}
                        value={this.state.internal_name}
                        onChange={this.onChangeInternalName}
                    />
                </div>
                <div className="form-group">
                    <label className={this.state.description !== this.state.initialDescription ? "text-success" : ""}>Description: </label>
                    <input
                        type="text"
                        required
                        className={`form-control ${this.state.description !== this.state.initialDescription ? "text-success" : ""}`}
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                    />
                </div>
                <div className="form-group">
                    <label className={this.state.quantity !== this.state.initialQuantity ? "text-success" : ""}>Quantity: </label>
                    <input
                        type="text"
                        className={`form-control ${this.state.quantity !== this.state.initialQuantity ? "text-success" : ""}`}
                        value={this.state.quantity}
                        onChange={this.onChangeQuantity}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Update Product"
                        className="btn btn-primary"
                        disabled={this.state.internal_name === this.state.initialInternalName && this.state.description == this.state.initialDescription && this.state.quantity === this.state.initialQuantity}
                    />
                </div>
            </form>
            <ToastContainer autoClose={2000} theme="dark" />

            <h3>Product History</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
            {this.state.productHistory.map((historyItem, index) => {
                const changes = index > 0 ? this.compareHistoryItems(this.state.productHistory[index - 1], historyItem) : {};
                return (
                    <div 
                        className="card bg-dark text-white m-2" 
                        key={index}
                        style={index === this.state.productHistory.length - 1 ? { borderColor: "green", borderWidth: "2px" } : {}}
                    >
                        <div className="card-body">
                            <h5 className="card-title">{index === this.state.productHistory.length - 1 ? 'Latest Version' : `Version ${index + 1}`}</h5>
                            <p className="card-text">ProductID: {historyItem.ProductID}</p>
                            <p className={`card-text ${changes.ProductName ? "text-success" : ""}`}>ProductName: {historyItem.ProductNameID}</p>
                            <p className={`card-text ${changes.InternalName ? "text-success" : ""}`}>InternalName: {historyItem.InternalName}</p>
                            <p className={`card-text ${changes.Description ? "text-success" : ""}`}>Description: {historyItem.Description}</p>
                            <p className={`card-text ${changes.Quantity ? "text-success" : ""}`}>Quantity: {historyItem.Quantity}</p>
                            <p className="card-text">Status: {historyItem.Status}</p>
                            <p className="card-text">{index === 0 ? 'Imported Date' : 'Modified Date'}: {index === 0 ? historyItem.Date.ProductionDate : historyItem.LastUpdatedStamp}</p>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    );
}
}

export default EditProductWrapper;