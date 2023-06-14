import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const ShipmentsList = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentItems, setSelectedShipmentItems] = useState([]);

  useEffect(() => {
    const headers = {
        "x-access-token": sessionStorage.getItem("jwtToken"),
      };
    const fetchShipments = async () => {
      try {
        const response = await axios.get("http://localhost:8090/product/shipments/show/all", { headers: headers }) ;
        console.log(response.data.data);
        setShipments(response.data.data.map(item => item.Record));
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchShipments();
  }, []);

  const fetchShipmentItems = async (shipmentId) => {
  const headers = {
        "x-access-token": sessionStorage.getItem("jwtToken"),
      };
  try {
    const response = await axios.get(`http://localhost:8090/product/list/producer`, { headers: headers });
    const shipmentItems = response.data.data
      .map(item => item.Record)
      .filter(
        (product) =>
          product.ProductType === 'ShipmentItem' && product.ShipmentID === shipmentId
      );
    setSelectedShipmentItems(shipmentItems);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="container">
      <h3>Shipments</h3>
      <table className="table" style={{ color: '#ffffff' }}>
        <thead className="thead-light">
          <tr>
            <th>Shipment ID</th>
            <th>Shipment Name</th>
            <th>Shipment Type ID</th>
            <th>Shipment Cost</th>
            <th>Party ID To</th>
            <th>Party ID From</th>
            <th>Last Updated Timestamp</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.ShipmentID} onClick={() => fetchShipmentItems(shipment.ShipmentID)}>
              <td>{shipment.ShipmentID}</td>
              <td>{shipment.ShipmentName}</td>
              <td>{shipment.ShipmentTypeID}</td>
              <td>{shipment.EstimatedShipCost}</td>
              <td>{shipment.PartyIDTo}</td>
              <td>{shipment.PartyIDFrom}</td>
              <td>{shipment.LastUpdatedStamp}</td>
              <td>
                <button style={{ borderRadius: '20px', backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px 10px', }} onClick={() => fetchShipmentItems(shipment.ShipmentID)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Selected Shipment Items</h2>
      <table className="table" style={{ color: '#ffffff' }}>
        <thead className="thead-light">
          <tr>
            <th>Shipment Name</th>
            <th>Product ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedShipmentItems.map((item) => (
            <tr key={item.ProductID}>
              <td>{item.ShipmentName}</td>
              <td>{item.ProductID}</td>
              <td>{item.Name}</td>
              <td>{item.Quantity}</td>
              <td>
                {/* Actions for each item can be added here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default ShipmentsList;