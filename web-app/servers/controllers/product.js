const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');
const path = require('path');
const fs = require('fs');
const uploadDir = path.resolve(__dirname, '../uploads');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.importShipments = async (req, res) => {
    const id = req.body.id;
    console.log(id);
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }
    try {
        console.log(id);
        if (!req.file) {
            return apiResponse.badRequest(res, "No file uploaded!");
        } else {
            let productFile = req.file;

            // Use the mv() method to place the file in upload directory
            const productFilePath = req.file.path;

            // Read JSON data
            let shipments;
            try {
                parsedFileContent  = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
                shipments = parsedFileContent.data;
            } catch (err) {
                console.log(err);
                console.error(err);
                return apiResponse.error(res, "An error occurred while reading the uploaded file!");
            }

            let createShipmentsResponse;
            for (let shipment of shipments) {
                const { SHIPMENT_ID: shipment_name, SHIPMENT_TYPE_ID: shipment_type_id, PRODUCT_ID: product_id, STATUS_ID: status_id, ESTIMATED_SHIP_COST: estimated_ship_cost, PARTY_ID_TO: party_id_to, PARTY_ID_FROM: party_id_from, LAST_UPDATED_STAMP: last_updated_stamp } = shipment;
                const shipmentData = { shipmentname: shipment_name, shipmenttypeid: shipment_type_id, statusid: status_id, estimatedshipcost: estimated_ship_cost, partyidto: party_id_to, partyidfrom: party_id_from, lastupdatedstamp: last_updated_stamp, id };
                console.log(shipmentData);
                createShipmentsResponse = await productModel.createShipment(shipmentData);
                if (createShipmentsResponse.error) {
                    return apiResponse.createModelRes(400, createShipmentsResponse.error);
                }
            }

            return apiResponse.send(res, createShipmentsResponse);
        }
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.createShipment = async (req, res) => {
    const { shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp, id } = req.body;
    console.log('controller createShipment 1');

    if (!shipmentname || !shipmenttypeid || !statusid || !estimatedshipcost || !partyidto || !partyidfrom || !lastupdatedstamp || !id ) {
        console.log('controller createShipment error')
        return apiResponse.badRequest(res);
    }
    console.log('controller createShipment 2');

    if (loggedUserType !== 'producer' ) {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller createShipment 3');

    const modelRes = await productModel.createShipment({ shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp });
    console.log('done')
    return apiResponse.send(res, modelRes);
};

exports.createProduct = async (req, res) => {
    const { id, name, price, quantity, producttype, loggedUserType } = req.body;
    console.log('controller createProduct 1');

    if (!name || !id || !price || !quantity || !producttype || !loggedUserType) {
        console.log('controller createProduct error')
        return apiResponse.badRequest(res);
    }
    console.log('controller createProduct 2');

    if (loggedUserType !== 'producer' ) {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller createProduct 3');

    const modelRes = await productModel.createProduct({ shipmentid: "", shipmentname: "", name, id, price, quantity, producttype });
    console.log('done')
    return apiResponse.send(res, modelRes);
};

exports.upload = async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }

    try {
        if (!req.file) {
            return apiResponse.badRequest(res, "No file uploaded!");
        }

        const productFilePath = req.file.path;
        let products;

        try {
            parsedFileContent  = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
            products = parsedFileContent.data;
        } catch (err) {
            return apiResponse.error(res, "An error occurred while reading the uploaded file!");
        }

        let allProductsResponse = await productModel.getAllProducts(true, false, false, false, false, { id });

        if (allProductsResponse.error) {
            return apiResponse.createModelRes(400, allProductsResponse.error);
        }

        let nameCountMap = {};
        let createProductResponse;

        for (let product of products) {
            const { PRODUCT_ID: product_name, UNIT_COST: product_price, QUANTITY_ON_HAND_TOTAL: product_quantity } = product;
            nameCountMap[product_name] = (nameCountMap[product_name] || 0) + 1;
            const productCount = nameCountMap[product_name];

            const productsWithName = allProductsResponse.data.filter(prod => prod.Record.Name === product_name && prod.Record.Status === 'Available');

            if (productCount <= productsWithName.length) {
                const existingProduct = productsWithName[productCount - 1];
                existingProduct.Record.Quantity += product_quantity;
                existingProduct.Record.Price = product_price;

                let updateProductData = {
                    product_id: existingProduct.Key, 
                    loggedUserId: id, 
                    name: existingProduct.Record.Name, 
                    price: existingProduct.Record.Price, 
                    quantity: existingProduct.Record.Quantity
                }

                createProductResponse = await productModel.updateProduct(true, false, false, false, updateProductData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            } else {
                let productData = { shipmentid: "", shipmentname: "", name: product_name, id, price: product_price, quantity: product_quantity, producttype: "InventoryItem" };
                createProductResponse = await productModel.createProduct(productData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            }
        }

        return apiResponse.send(res, { status: 200, message: 'Products uploaded successfully' });
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.importShipmentItems = async (req, res) => {
    const id = req.body.id;
    console.log(id);
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }
    try {
        console.log(id);
        if (!req.file) {
            return apiResponse.badRequest(res, "No file uploaded!");
        } else {
            let productFile = req.file;

            // Use the mv() method to place the file in upload directory
            //const productFilePath = path.join(uploadDir, productFile.originalname);
            //productFile.mv(productFilePath);
            const productFilePath = req.file.path;

            // Read JSON data
            let products;
            try {
                parsedFileContent  = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
                products = parsedFileContent.data;
            } catch (err) {
                console.log(err);
                console.error(err);
                return apiResponse.error(res, "An error occurred while reading the uploaded file!");
            }

            let createShipmentItemResponse;
            for (let product of products) {
                const { SHIPMENT_ID: shipment_name, PRODUCT_ID: product_id, QUANTITY: itemquantity } = product;
                /// Get shipment_id by shipment_name
                const shipmentResponse = await productModel.getShipmentByName(true, false, false, false, false, shipment_name, id);
                console.log("Shipment response: ", shipmentResponse);
                if (!shipmentResponse || !shipmentResponse.data) {
                    console.error(`Shipment with name ${shipment_name} not found.`);
                    continue;
                }

                // Extract the shipment id from the response
                const shipmentid = shipmentResponse.data.shipmentId;
                console.log("Shipment ID: ", shipmentid);
                if (!shipmentid) {
                  console.error(`Shipment with name ${shipment_name} not found.`);
                  continue;
                }
                
                const productData = { shipmentid, shipmentname: shipment_name, name: product_id, id, price: 0, quantity: itemquantity, producttype: "ShipmentItem" };
                console.log(productData);
                createShipmentItemResponse = await productModel.createProduct(productData);
                if (createShipmentItemResponse.error) {
                    return apiResponse.createModelRes(400, createShipmentItemResponse.error);
                }
            }

            return apiResponse.send(res, createShipmentItemResponse);
        }
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.updateProduct = async (req, res) => {
    const { product_id, loggedUserId, name, price, quantity } = req.body;
    const { role } = req.params;
    console.log(req.body);
    console.log('controller update 1');

    if (!name || !product_id || !price || !role || !loggedUserId) {
        return apiResponse.badRequest(res);
    }
    console.log('controller update 2');

    if (role === 'consumer' ) {
        return apiResponse.badRequest(res);
    }
    console.log('controller update 3');

    let modelRes
    if (role === 'producer') {
        modelRes = await productModel.updateProduct(true, false, false, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.updateProduct(false, true, false, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'distributor') {
        modelRes = await productModel.updateProduct(false, false, true, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'retailer') {
        modelRes = await productModel.updateProduct(false, false, false, true, { product_id, loggedUserId, name, price, quantity });
    } else {
        return apiResponse.badRequest(res);
    }
     if (modelRes.status === 200) {
        // Update product_id with new ID
        req.body.product_id = modelRes.data.product_id;
    }

    return apiResponse.send(res, modelRes);
};

exports.getFullProductHistory = async (req, res) => {
    //const { role, id } = req.params;
    //const { loggedUserId } = req.body;
    console.log(req.body);
    console.log(req.params);

    const { loggedUserId, initialProductID } = req.body;
    const { role, productId } = req.params;
    
    if (!productId || !loggedUserId || !role || !initialProductID) {
        if (!productId) console.log('product_id missing');
        else if (!loggedUserId) console.log('loggedUserId missing');
        else if (!role) console.log('role missing');
        else console.log(initialProductID);
        console.log('Missing Parameters');
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'producer') {
        modelRes = await productModel.getFullProductHistory(true, false, false, false, loggedUserId, initialProductID);
    } else if (role === 'manufacturer') {
        modelRes = await productModel.getFullProductHistory(false, true, false, false, loggedUserId, initialProductID);
    } else if (role === 'distributor') {
        modelRes = await productModel.getFullProductHistory(false, false, true, false, loggedUserId, initialProductID);
    } else if (role === 'retailer') {
        modelRes = await productModel.getFullProductHistory(false, false, false, true, loggedUserId, initialProductID);
    } else {
        console.log('Unsupported role');
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getProductbyId = async (req, res) => {
    const { id } = req.body;
    const { productId, role } = req.params

    console.log('1');

    if (!productId || !id || !role ) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    console.log('3');
    let modelRes;
    if (role === 'producer') {
        modelRes = await productModel.getProductById(true, false, false, false, false, { productId, id });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.getProductById(false, true, false, false, false, { productId, id });
    } else if (role === 'distributor') {
        modelRes = await productModel.getProductById(false, false, true, false, false, { productId, id });
    } else if (role === 'retailer') {
        modelRes = await productModel.getProductById(false, false, false, true, false, { productId, id });
    } else if (role === 'consumer') {
        modelRes = await productModel.getProductById(false, false, false, false, true, { productId, id });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getAllProducts = async (req, res) => {
    console.log('getAllProducts')
    const { id } = req.body;
    console.log(id)
    const { role } = req.params
    console.log('controller getAllProducts 1');

    if (!id || !role ) {
        console.log(id);
        console.log('controller bad request')
        return apiResponse.badRequest(res);
    }
    console.log('controller getAllProducts 2');
    console.log('controller getAllProducts 3');
    let modelRes;
    if (role === 'producer') {
        modelRes = await productModel.getAllProducts(true, false, false, false, false, { id });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.getAllProducts(false, true, false, false, false, { id });
    } else if (role === 'distributor') {
        modelRes = await productModel.getAllProducts(false, false, true, false, false, { id });
    } else if (role === 'retailer') {
        modelRes = await productModel.getAllProducts(false, false, false, true, false, { id });
    } else if (role === 'consumer') {
        modelRes = await productModel.getAllProducts(false, false, false, false, true, { id });
    } else {
        console.log('no role')
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getAllShipments = async (req, res) => {
    console.log('getAllShipments')
    const { id } = req.body;
    console.log(id)
    console.log('controller getAllShipments 1');

    if (!id) {
        console.log(id);
        console.log('controller bad request')
        return apiResponse.badRequest(res);
    }
    console.log('controller getAllShipments 2');
    let modelRes;
    modelRes = await productModel.getAllShipments({id: id});

    return apiResponse.send(res, modelRes);
};