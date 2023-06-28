import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductHistory = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams(); // access route parameters with useParams

  useEffect(() => {
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    axios
      .get(`http://localhost:8090/product/${id}/${sessionStorage.getItem('role')}`, { headers })
      .then(response => {
        setProduct(response.data.data);
        //console.log(response.data.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  return (
    <div>
      <h3>Product Details</h3>
      <p><strong>ProductID:</strong> {product.ProductID || ""}</p>
      <p><strong>ProductName:</strong> {product.Name || ""}</p>
      <p><strong>InternalName:</strong> {product.InternalName || ""}</p>
      <p><strong>ProductType:</strong> {product.ProductType || ""}</p>
      <p><strong>ProducerID:</strong> {product.ProducerID || ""}</p>
      <p><strong>ProductionDate:</strong> {product.Date?.ProductionDate || ""}</p>
      <p><strong>SendToManufacturerDate:</strong> {product.Date?.SendToManufacturerDate || ""}</p>
      <p><strong>SendToDistributorDate:</strong> {product.Date?.SendToDistributorDate || ""}</p>
      <p><strong>SendToRetailerDate:</strong> {product.Date?.SendToRetailerDate || ""}</p>
      <p><strong>SellToConsumerDate:</strong> {product.Date?.SellToConsumerDate || ""}</p>
      <p><strong>OrderedDate:</strong> {product.Date?.OrderedDate || ""}</p>
      <p><strong>DeliveredDate:</strong> {product.Date?.DeliveredDate || ""}</p>
      <p><strong>ModifiedDate:</strong> {product.Date?.ModifiedDate || ""}</p>
      <p><strong>Status:</strong> {product.Status || ""}</p>
      <p><strong>Quantity:</strong> {product.Quantity || ""}</p>
      <p><strong>Price:</strong> {product.Price || ""}</p>
    </div>
  );
}

export default ProductHistory;