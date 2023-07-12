import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InventoryItemHistory = () => {
  const [inventoryitem, setInventoryItem] = useState({});
  const { id } = useParams(); // access route parameters with useParams

  useEffect(() => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    axios
      .get(`http://localhost:8090/product/inventory/items/get/${id}/${sessionStorage.getItem('role')}`, { headers })
      .then(response => {
        setInventoryItem(response.data.data);
        //console.log(response.data.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  return (
    <div>
      <h3>InventoryItem Details</h3>
      <p><strong>InventoryItemID:</strong> {inventoryitem.InventoryItemID || ""}</p>
      <p><strong>InitialInventoryItemID:</strong> {inventoryitem.InitialInventoryItemID || ""}</p>
      <p><strong>InventoryItemNumID:</strong> {inventoryitem.InventoryItemNumID || ""}</p>
      <p><strong>ProductName:</strong> {inventoryitem.ProductNameID || ""}</p>
      <p><strong>ProducerID:</strong> {inventoryitem.ProducerID || ""}</p>
      <p><strong>FacilityID:</strong> {inventoryitem.FacilityID || ""}</p>
      <p><strong>OwnerPartyId:</strong> {inventoryitem.OwnerPartyID || ""}</p>
      <p><strong>ModifiedDate:</strong> {inventoryitem.LastUpdatedStamp || ""}</p>
      <p><strong>CreatedDate:</strong> {inventoryitem.CreatedStamp || ""}</p>      
      <p><strong>Status:</strong> {inventoryitem.Status || ""}</p>
      <p><strong>Quantity:</strong> {inventoryitem.QuantityOnHandTotal || ""}</p>
      <p><strong>UnitCost:</strong> {inventoryitem.UnitCost || ""}</p>
    </div>
  );
}

export default InventoryItemHistory;