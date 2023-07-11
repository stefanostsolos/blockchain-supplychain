import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const orderitemrole = "producer"

  useEffect(() => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8090/theorder/orders", { headers: headers });
        console.log(response.data.data);
        setOrders(response.data.data.map(item => item.Record));
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderItems = async (ordername) => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    try {
      const response = await axios.get(`http://localhost:8090/theorder/orders/items/${orderitemrole}`, { headers: headers });
      const orderItems = response.data.data
        .map(item => item.Record)
        .filter(
          (orderitem) => orderitem.OrderNameID === ordername
        );
      setSelectedOrderItems(orderItems);
      console.log(selectedOrderItems);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h3>Orders</h3>
      <table className="table" style={{ color: '#ffffff' }}>
        <thead className="thead-light">
          <tr>
            <th>Order ID</th>
            <th>Order Name ID</th>
            <th>Order Type ID</th>
            <th>Order Name</th>
            <th>Order Date</th>
            <th>Order Status ID</th>
            <th>Grand Total Cost</th>
            <th>Last Updated Stamp</th>
            <th>Created Stamp</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.OrderID}>
              <td>{order.OrderID}</td>
              <td>{order.OrderNameID}</td>
              <td>{order.OrderTypeID}</td>
              <td>{order.OrderName}</td>
              <td>{order.OrderDate}</td>
              <td>{order.OrderStatusID}</td>
              <td>{order.GrandTotal}</td>
              <td>{order.LastUpdatedStamp}</td>
              <td>{order.CreatedStamp}</td>
              <td>
                <button style={{ borderRadius: '20px', backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px 10px', }} onClick={() => fetchOrderItems(order.OrderNameID, orderitemrole)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Selected Order Items</h2>
      <table className="table" style={{ color: '#ffffff' }}>
        <thead className="thead-light">
          <tr>
            <th>Order Name ID </th>
            <th>Order Item Type ID</th>
            <th>Product Name ID</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Item Description</th>
            <th>Status ID</th>
            <th>Last Updated Timestamp</th>
            <th>Created Stamp</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrderItems.map((item) => (
            <tr key={item.OrderNameID}>
              <td>{item.OrderNameID}</td>
              <td>{item.OrderItemTypeID}</td>
              <td>{item.ProductNameID}</td>
              <td>{item.Quantity}</td>
              <td>{item.UnitPrice}</td>
              <td>{item.ItemDescription}</td>
              <td>{item.StatusID}</td>
              <td>{item.LastUpdatedStamp}</td>
              <td>{item.CreatedStamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;