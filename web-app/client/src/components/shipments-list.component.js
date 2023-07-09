import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentsList = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentItems, setSelectedShipmentItems] = useState([]);
  const shipmentitemrole = "producer"

  useEffect(() => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    const fetchShipments = async () => {
      try {
        const response = await axios.get("http://localhost:8090/product/shipments/show/all", { headers: headers });
        console.log(response.data.data);
        setShipments(response.data.data.map(item => item.Record));
      } catch (err) {
        console.log(err);
      }
    };

    fetchShipments();
  }, []);

  const fetchShipmentItems = async (shipmentname) => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    try {
      const response = await axios.get(`http://localhost:8090/product/shipment/items/get/all/shipmentitem/${shipmentitemrole}`, { headers: headers });
      const shipmentItems = response.data.data
        .map(item => item.Record)
        .filter(
          (shipmentitem) => shipmentitem.ShipmentName === shipmentname
        );
      setSelectedShipmentItems(shipmentItems);
      console.log(selectedShipmentItems);
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
            <tr key={shipment.ShipmentID}>
              <td>{shipment.ShipmentID}</td>
              <td>{shipment.ShipmentName}</td>
              <td>{shipment.ShipmentTypeID}</td>
              <td>{shipment.EstimatedShipCost}</td>
              <td>{shipment.PartyIDTo}</td>
              <td>{shipment.PartyIDFrom}</td>
              <td>{shipment.LastUpdatedStamp}</td>
              <td>
                <button style={{ borderRadius: '20px', backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px 10px', }} onClick={() => fetchShipmentItems(shipment.ShipmentName, shipmentitemrole)}>Details</button>
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
            <th>Product Name ID</th>
            <th>Quantity</th>
            <th>Last Updated Timestamp</th>
            <th>Created Stamp</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedShipmentItems.map((item) => (
            <tr key={item.ShipmentName}>
              <td>{item.ShipmentName}</td>
              <td>{item.ProductNameID}</td>
              <td>{item.Quantity}</td>
              <td>{item.LastUpdatedStamp}</td>
              <td>{item.CreatedStamp}</td>
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