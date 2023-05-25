import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_name: "",
      date: {
        productionDate: "",
        sendToManufacturerDate: "",
        sendToDistributorDate: "",
        sendToRetailerDate: "",
        sellToConsumerDate: "",
        orderedDate: "",
        deliveredDate: "",
      },
      producer_id: "",
      manufactuer_id: "",
      distributor_id: "",
      retailer_id: "",
      consumer_id: "",
      status: "",
      price: 0,
      manufacturers: [],
    };
  }

  componentDidMount() {
    axios.get("http://localhost:products/" + this.props.match.params.id)
    .then((response) => {
      this.setState({
        product_name: response.data.product_name,
        producer_id: response.data.producer_id,
        productionDate: response.data.productionDate,
        status: response.data.status,
        price: response.data.price,
      })
    })
  }

  onChangeProductName(e) {
    this.setState({
      product_name: e.target.value,
    });
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value,
    });
  }

  onChangeProducerId(e) {
    this.setState({
      producer_id: e.target.value,
    });
  }

  onChangeProducerDate(date) {
    const newDate = { ...this.state.date, productionDate: date };
    this.setState({ date: newDate });
  }

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
            <label>ProducerID: </label>
            <select
              ref="producerInput"
              required
              className="form-control"
              value={this.state.producer_id}
              onChange={this.onChangeProducerId}
            >
              {this.state.producers.map(function (producer) {
                return (
                  <option
                    key={producer.user_id}
                    value={producer.user_id}
                  >
                    {producer.user_id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Production Date: </label>
            <div>
              <DatePicker
                selected={this.state.date.productionDate}
                onChange={this.onChangeProducerDate}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Price: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.price}
              onChange={this.onChangePrice}
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
      </div>
    );
  }
}

export default EditProduct;
