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
      })
      .catch(error => console.log(error));
  }, [id]);

  return (
    <div>
      <h3>Product Details</h3>
      <p><strong>ProductID:</strong> {product.ProductID || ""}</p>
      <p><strong>ProductName:</strong> {product.ProductNameID || ""}</p>
      <p><strong>InternalName:</strong> {product.InternalName || ""}</p>
      <p><strong>Description:</strong> {product.Description || ""}</p>
      <p><strong>ProductType:</strong> {product.ProductTypeID || ""}</p>
      <p><strong>OwnerID:</strong> {product.ProducerID || ""}</p>
      <p><strong>ImportedToWebAppDate:</strong> {product.Date?.ProductionDate || ""}</p>
      <p><strong>LastUpdatedStamp:</strong> {product.LastUpdatedStamp || ""}</p>
      <p><strong>Status:</strong> {product.Status || ""}</p>
      <p><strong>Quantity:</strong> {product.Quantity || ""}</p>
    </div>
  );
}

export default ProductHistory;