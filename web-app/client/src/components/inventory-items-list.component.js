import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryItem = ({ inventoryitem, role, entities, loggedUserId, getInventoryItems }) => {
  const deliverTo = (inventoryitem, entity) => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    const endpoint = role === "retailer" ? "/consumer" : "/";
    const body = role === "retailer"
      ? { inventoryitemId: inventoryitem.InventoryItemID, id: loggedUserId }
      : { inventoryitemId: inventoryitem.InventoryItemID, userId: entity.Record.UserID, id: loggedUserId }
    axios.post(`http://localhost:8090/transact${endpoint}`, body, { headers })
      .then(response => { console.log(response); toast.success("Inventory Items delivered successfully!"); getInventoryItems(); })
      .catch(error => console.log(error));
  }

  return (
    <tr>
      <td>{inventoryitem.InventoryItemID}</td>
      <td>{inventoryitem.InventoryItemTypeID}</td>
      <td>{inventoryitem.InventoryItemNumID}</td>
      <td>{inventoryitem.ProductNameID}</td>
      <td>{inventoryitem.ProducerID}</td>
      <td>{inventoryitem.Status}</td>
      <td>{inventoryitem.OwnerPartyID}</td>
      <td>{inventoryitem.FacilityID}</td>
      <td>{inventoryitem.UnitCost}</td>
      <td>{inventoryitem.QuantityOnHandTotal}</td>
      <td>{inventoryitem.LastUpdatedStamp}</td>
      <td>{inventoryitem.CreatedStamp}</td>
      <td>
        {(role === "producer" || role === "manufacturer" || role === "distributor" || role === "retailer") &&
          <>
            <Link to={"/history/" + inventoryitem.InventoryItemID} style={{ color: '#ffffff', fontWeight: 'bold', marginRight: '10px' }}>Details</Link>
            <Link to={"/edit/" + inventoryitem.InventoryItemID} style={{ color: '#ffffff', fontWeight: 'bold', marginRight: '10px' }}>Edit</Link>
            <select onChange={(e) => {
              if (e.target.value !== "") {
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
  const [inventoryitems, setInventoryItems] = useState([]);
  const [entities, setEntities] = useState([]);

  const getInventoryItems = () => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    axios
      .get("http://localhost:8090/product/list/show/inventory/" + role, { headers })
      .then((response) => {
        let filteredInventoryItems = [];
        const loggedUserId = sessionStorage.getItem("userId");

        if (role === "consumer") {
          filteredInventoryItems = response.data.data.filter(inventoryitem =>
            inventoryitem.Record.RetailerID && inventoryitem.Record.Status === 'Available' && !inventoryitem.Record.ConsumerID
          );
        } else if (role === "producer") {
          filteredInventoryItems = response.data.data.filter(inventoryitem =>
            inventoryitem.Record.ProducerID === loggedUserId && !inventoryitem.Record.ManufacturerID
          );
        } else if (role === "manufacturer") {
          filteredInventoryItems = response.data.data.filter(inventoryitem =>
            inventoryitem.Record.ManufacturerID === loggedUserId && !inventoryitem.Record.DistributorID
          );
        } else if (role === "distributor") {
          filteredInventoryItems = response.data.data.filter(inventoryitem =>
            inventoryitem.Record.DistributorID === loggedUserId && !inventoryitem.Record.RetailerID
          );
        } else if (role === "retailer") {
          filteredInventoryItems = response.data.data.filter(inventoryitem =>
            inventoryitem.Record.RetailerID === loggedUserId && !inventoryitem.Record.ConsumerID
          );
        }
        setInventoryItems(filteredInventoryItems);
      })
      .catch((error) => console.log(error.response));
  }

  useEffect(() => {
    getInventoryItems();

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
            <th>InventoryItemID</th>
            <th>InventoryItemTypeID</th>
            <th>InventoryItemNumID</th>
            <th>ProductNameID</th>
            <th>ProducerID</th>
            <th>Status</th>
            <th>OwnerPartyID</th>
            <th>FacilityID</th>
            <th>UnitCost</th>
            <th>QuantityOnHandTotal</th>
            <th>LastUpdatedStamp</th>
            <th>CreatedStamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryitems.map((inventoryitem, index) => (
            <InventoryItem
              inventoryitem={inventoryitem.Record}
              role={role}
              entities={entities}
              getInventoryItems={getInventoryItems}
              key={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryItemsList;