import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryItem = ({ inventoryitem, role, entities, loggedUserId, getProducts }) => {
  const deliverTo = (inventoryitem, entity) => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    const endpoint = role === "retailer" ? "/consumer" : "/";
    const body = role === "retailer"
      ? { productId: inventoryitem.ProductID, id: loggedUserId }
      : { productId: inventoryitem.ProductID, userId: entity.Record.UserID, id: loggedUserId }
    axios.post(`http://localhost:8090/transact${endpoint}`, body, { headers })
      .then(response => { console.log(response); toast.success("Product delivered successfully!"); getProducts(); })
      .catch(error => console.log(error));
  }

  return (
    <tr>
      <td>{inventoryitem.ProductID}</td>
      <td>{inventoryitem.Name}</td>
      <td>{inventoryitem.ProducerID}</td>
      <td>{inventoryitem.Date.ProductionDate.substring(0, 10)}</td>
      <td>{inventoryitem.Status}</td>
      <td>{inventoryitem.Price}</td>
      <td>{inventoryitem.Quantity}</td>
      <td>
        {(role === "producer" || role === "manufacturer" || role === "distributor" || role === "retailer") &&
          <>
            <Link to={"/history/" + inventoryitem.ProductID} style={{ color: '#ffffff', fontWeight: 'bold', marginRight: '10px' }}>Details</Link>
            <Link to={"/edit/" + inventoryitem.ProductID} style={{ color: '#ffffff', fontWeight: 'bold', marginRight: '10px' }}>Edit</Link>
            <select onChange={(e) => {
              if(e.target.value !== "") {
                const selectedEntity = entities.find(entity => entity.Record.UserID === e.target.value);
                if (selectedEntity) {
                  deliverTo(inventoryitem, selectedEntity);
                } else {
                  console.error(`Entity with user_id ${e.target.value} not found.`);
                }
              }
            }}>
              <option value="">Deliver to</option>
              {entities && entities.map((entity, index) => (
                <option key={index} value={entity.Record.UserID}>
                  {entity.Record.UserID}
                </option>
              ))}
            </select>
          </>
        }
        {role === "consumer" &&
          <>
            <button onClick={() => deliverTo(inventoryitem, { user_id: inventoryitem.RetailerID })}>Order</button>
          </>
        }
      </td>
    </tr>
  );
}

const InventoryItemsList = () => {
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [inventoryitems, setProducts] = useState([]);
  const [entities, setEntities] = useState([]);

  const getProducts = () => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    axios
      .get("http://localhost:8090/product/list/" + role, { headers })
      .then((response) => {
        let filteredProducts = [];
        const loggedUserId = sessionStorage.getItem("userId");

        if (role === "consumer") {
        filteredProducts = response.data.data.filter(inventoryitem => 
          inventoryitem.Record.RetailerID && inventoryitem.Record.Status === 'Available' && !inventoryitem.Record.ConsumerID
        );
        } else if (role === "producer") {
        filteredProducts = response.data.data.filter(inventoryitem => 
          inventoryitem.Record.ProducerID === loggedUserId && !inventoryitem.Record.ManufacturerID
        );
        } else if (role === "manufacturer") {
        filteredProducts = response.data.data.filter(inventoryitem => 
          inventoryitem.Record.ManufacturerID === loggedUserId && !inventoryitem.Record.DistributorID
        );
        } else if (role === "distributor") {
        filteredProducts = response.data.data.filter(inventoryitem => 
          inventoryitem.Record.DistributorID === loggedUserId && !inventoryitem.Record.RetailerID
        );
        } else if (role === "retailer") {
        filteredProducts = response.data.data.filter(inventoryitem => 
          inventoryitem.Record.RetailerID === loggedUserId && !inventoryitem.Record.ConsumerID
        );
        }
        setProducts(filteredProducts);
      })
      .catch((error) => console.log(error.response));
  }

  useEffect(() => {
    getProducts();

    axios
      .get("http://localhost:8090/user/all/producer")
      .then((response) => {
        let filteredEntities = [];
        if (role === "producer") filteredEntities = response.data.data.filter(user => user.Record.UserType === "manufacturer");
        else if (role === "manufacturer") filteredEntities = response.data.data.filter(user => user.Record.UserType === "distributor");
        else if (role === "distributor") filteredEntities = response.data.data.filter(user => user.Record.UserType === "retailer");
        else if (role === "retailer") filteredEntities = response.data.data.filter(user => user.Record.UserType === "consumer");

        setEntities(filteredEntities);
      })
      .catch((error) => console.log(error.response));
  }, [role]);

  return (
    <div>
      <h3>Inventory Items List</h3>
      <table className="table" style={{ color: '#ffffff' }}>
        <thead className="thead-light">
          <tr>
            <th>ProductID</th>
            <th>ProductName</th>
            <th>ProducerID</th>
            <th>ProductionDate</th>
            <th>Status</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryitems.map((inventoryitem, index) => (
            <InventoryItem
            inventoryitem={inventoryitem.Record}
              role={role}
              entities={entities}
              getProducts={getProducts}
              key={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryItemsList;