const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');
const path = require('path');
const fs = require('fs');
const { deepStrictEqual } = require('assert');
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
            return apiResponse.badRequest(res, "No file was uploaded!");
        } else {
            let productFile = req.file;

            // Use the mv() method to place the file in upload directory
            const productFilePath = req.file.path;

            // Read JSON data
            let shipments;
            try {
                parsedFileContent = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
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

    if (!shipmentname || !shipmenttypeid || !statusid || !estimatedshipcost || !partyidto || !partyidfrom || !lastupdatedstamp || !id) {
        console.log('controller createShipment error')
        return apiResponse.badRequest(res);
    }
    console.log('controller createShipment 2');

    if (loggedUserType !== 'producer') {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller createShipment 3');

    const modelRes = await productModel.createShipment({ shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp });
    console.log('done')
    return apiResponse.send(res, modelRes);
};

exports.createProduct = async (req, res) => {
    const { id, name, internalname, description, quantity, producttype, loggedUserType } = req.body;
    console.log('controller createProduct 1');

    if (!id || !name || !internalname || !description || !quantity || !producttype || !loggedUserType) {
        console.log('controller createProduct error')
        return apiResponse.badRequest(res);
    }
    console.log('controller createProduct 2');

    if (loggedUserType !== 'producer') {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller createProduct 3');

    const modelRes = await productModel.createProduct({ id, name, internalname, description, quantity, producttype });
    console.log('done')
    return apiResponse.send(res, modelRes);
};

exports.createInventoryItem = async (req, res) => {
    const { numid, itemtype, productname, ownerparty, facilityid, quantity, unitcost, loggedUserType } = req.body;
    console.log('controller createInventoryItem 1');

    if (!numid || !itemtype || !productname || !ownerparty || !facilityid || !quantity || !unitcost || !loggedUserType) {
        console.log('controller createInventoryItem error')
        return apiResponse.badRequest(res);
    }
    console.log('controller createInventoryItem 2');

    if (loggedUserType !== 'producer') {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller createInventoryItem 3');

    const modelRes = await productModel.createInventoryItem({ numid, itemtype, productname, ownerparty, facilityid, quantity, unitcost });
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
            return apiResponse.badRequest(res, "No file was uploaded!");
        }

        const productFilePath = req.file.path;
        let products;

        try {
            parsedFileContent = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
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
            const { PRODUCT_ID: product_name, PRODUCT_TYPE_ID: product_type, INTERNAL_NAME: internal_name, QUANTITY_INCLUDED: product_quantity } = product;
            nameCountMap[product_name] = (nameCountMap[product_name] || 0) + 1;
            const productCount = nameCountMap[product_name];

            const productsWithName = allProductsResponse.data.filter(prod => prod.Record.Name === product_name && prod.Record.Status === 'Available');

            if (productCount <= productsWithName.length) {
                const existingProduct = productsWithName[productCount - 1];
                existingProduct.Record.Quantity = product_quantity;
                existingProduct.Record.ProductType = product_type;
                existingProduct.Record.InternalName = internal_name;

                let updateProductData = {
                    product_id: existingProduct.Key,
                    loggedUserId: id,
                    name: existingProduct.Record.Name,
                    internalname: existingProduct.Record.InternalName,
                    type: existingProduct.Record.ProductType,
                    quantity: existingProduct.Record.Quantity
                }

                createProductResponse = await productModel.updateProduct(true, false, false, false, updateProductData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            } else {
                let productData = { name: product_name, internalname: internal_name, type: product_type, id, quantity: product_quantity };
                createProductResponse = await productModel.createProduct(productData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            }
        }

        return apiResponse.send(res, { status: 200, message: 'Products were imported successfully' });
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.importInventoryItems = async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }

    try {
        if (!req.file) {
            return apiResponse.badRequest(res, "No file was uploaded!");
        }

        const inventoryitemFilePath = req.file.path;
        let inventoryitems;

        try {
            parsedFileContent = JSON.parse(fs.readFileSync(inventoryitemFilePath, 'utf8'));
            inventoryitems = parsedFileContent.data;
        } catch (err) {
            return apiResponse.error(res, "An error occurred while reading the uploaded file!");
        }

        let allInventoryItemsResponse = await productModel.getAllInventoryItems(true, false, false, false, false, { id });

        if (allInventoryItemsResponse.error) {
            return apiResponse.createModelRes(400, allInventoryItemsResponse.error);
        }

        let nameCountMap = {};
        let createInventoryItemResponse;

        for (let inventoryitem of inventoryitems) {
            //const { PRODUCT_ID: product_name, UNIT_COST: product_price, QUANTITY_ON_HAND_TOTAL: product_quantity } = inventoryitem;
            const { INVENTORY_ITEM_ID: inventory_item_name, INVENTORY_ITEM_TYPE_ID: inventory_item_type_id, PRODUCT_ID: product_name, OWNER_PARTY_ID: owner_party_id, FACILITY_ID: facility_id, QUANTITY_ON_HAND_TOTAL: inventory_item_quantity, UNIT_COST: inventory_item_price } = inventoryitem;
            nameCountMap[inventory_item_name] = (nameCountMap[inventory_item_name] || 0) + 1;
            const inventoryitemCount = nameCountMap[inventory_item_name];
            const inventoryitemsWithName = allInventoryItemsResponse.data.filter(prod => prod.Record.InventoryItemId === inventory_item_name && prod.Record.Status === 'Available');

            if (inventoryitemCount <= inventoryitemsWithName.length) {
                const existingInventoryItem = inventoryitemsWithName[inventoryitemCount - 1];
                existingInventoryItem.Record.Quantity = inventory_item_quantity;
                existingInventoryItem.Record.Price = inventory_item_price;
                existingInventoryItem.Record.OwnerPartyId = owner_party_id;
                existingInventoryItem.Record.FacilityId = facility_id;
                existingInventoryItem.Record.InventoryItemType = inventory_item_type_id;

                let updateInventoryItemData = {
                    inventoryitemid: existingInventoryItem.Key,
                    inventoryitemtypeid: existingInventoryItem.Record.InventoryItemType,
                    productname: existingInventoryItem.Record.ProductName,
                    ownerpartyid: existingInventoryItem.Record.OwnerPartyId,
                    facilityid: existingInventoryItem.Record.FacilityId,
                    price: existingInventoryItem.Record.Price,
                    loggedUserId: id,
                }

                createInventoryItemResponse = await productModel.updateInventoryItem(true, false, false, false, updateInventoryItemData);
                if (createInventoryItemResponse.error) {
                    return apiResponse.createModelRes(400, createInventoryItemResponse.error);
                }
            } else {
                let inventoryitemData = { inventoryitemname: inventory_item_name, inventoryitemtypeid: inventory_item_type_id, productname: product_name, ownerpartyid: owner_party_id, facilityid: facility_id, quantity: inventory_item_quantity, price: inventory_item_price, id };
                createInventoryItemResponse = await productModel.createInventoryItem(inventoryitemData);
                if (createInventoryItemResponse.error) {
                    return apiResponse.createModelRes(400, createInventoryItemResponse.error);
                }
            }
        }

        return apiResponse.send(res, { status: 200, message: 'Inventory Items were imported successfully' });
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
            return apiResponse.badRequest(res, "No file was uploaded!");
        } else {
            const productFilePath = req.file.path;

            let shipmentitems;
            try {
                parsedFileContent = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
                products = parsedFileContent.data;
            } catch (err) {
                console.log(err);
                console.error(err);
                return apiResponse.error(res, "An error occurred while reading the uploaded file!");
            }

            let createShipmentItemResponse;
            for (let shipmentitem of shipmentitems) {
                const { SHIPMENT_ID: shipment_name, PRODUCT_ID: product_id, QUANTITY: itemquantity, LAST_UPDATED_STAMP: last_updated_stamp, CREATED_STAMP: created_stamp } = shipmentitem;
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

                const shipmentitemData = { shipmentname: shipment_name, name: product_id, quantity: itemquantity, lastupdatedstamp: last_updated_stamp, createdstamp: created_stamp, id };
                console.log(productData);
                createShipmentItemResponse = await productModel.createShipmentItem(shipmentitemData);
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

    if (role === 'consumer') {
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

exports.updateInventoryItem = async (req, res) => {
    const { product_id, loggedUserId, name, price, quantity } = req.body;
    const { role } = req.params;
    console.log(req.body);
    console.log('controller update inventory item 1');

    if (!name || !product_id || !price || !role || !loggedUserId) {
        return apiResponse.badRequest(res);
    }
    console.log('controller update 2');

    if (role === 'consumer') {
        return apiResponse.badRequest(res);
    }
    console.log('controller update inventory item 3');

    let modelRes
    if (role === 'producer') {
        modelRes = await productModel.updateInventoryItem(true, false, false, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.updateInventoryItem(false, true, false, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'distributor') {
        modelRes = await productModel.updateInventoryItem(false, false, true, false, { product_id, loggedUserId, name, price, quantity });
    } else if (role === 'retailer') {
        modelRes = await productModel.updateInventoryItem(false, false, false, true, { product_id, loggedUserId, name, price, quantity });
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

    if (!productId || !id || !role) {
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

    if (!id || !role) {
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
    modelRes = await productModel.getAllShipments({ id: id });

    return apiResponse.send(res, modelRes);
};