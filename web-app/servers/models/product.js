const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createShipment = async information => {
    const { shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp, id } = information;
    console.log('model createShipment')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createShipment', shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createProduct = async information => {
    const { name, internalname, type, id, quantity } = information;
    console.log('model createProduct')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createProduct', name, internalname, quantity, type, id);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createInventoryItem = async information => {
    const { inventoryitemname, inventoryitemtypeid, productname, ownerpartyid, facilityid, quantity, price, id, lastupdatedstamp, createdstamp } = information;
    console.log('model createInventoryItem')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createInventoryItem', inventoryitemname, inventoryitemtypeid, productname, ownerpartyid, facilityid, quantity, price, id, lastupdatedstamp, createdstamp);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createShipmentItem = async information => {
    const { shipmentname, name, quantity, lastupdatedstamp, createdstamp, id } = information;
    console.log('model createShipmentItem')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createShipmentItem', shipmentname, name, quantity, lastupdatedstamp, createdstamp, id);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.updateProduct = async (isProducer, isManufacturer, isDistributor, isRetailer, information) => {
    const { product_id, loggedUserId, name, price, quantity } = information;
    console.log('model update product')
    console.log(product_id);
    console.log(loggedUserId);
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, loggedUserId);
    const contractRes = await network.invoke(networkObj, 'updateProduct', product_id, loggedUserId, name, price, quantity);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.updateInventoryItem = async (isProducer, isManufacturer, isDistributor, isRetailer, information) => {
    const { inventoryitemid, inventoryitemtypeid, productname, ownerpartyid, facilityid, price, loggedUserId } = information;
    console.log('model updateInventoryItem')
    console.log(inventoryitemid);
    console.log(loggedUserId);
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, loggedUserId);
    const contractRes = await network.invoke(networkObj, 'updateInventoryItem', inventoryitemid, inventoryitemtypeid, productname, ownerpartyid, facilityid, price, loggedUserId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

// getFullProductHistory function that fetches all product histories
exports.getFullProductHistory = async (isProducer, isManufacturer, isDistributor, isRetailer, loggedUserId, initialProductID) => {
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, loggedUserId);
    const contractRes = await network.invoke(networkObj, 'getFullProductHistory', initialProductID);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log(error);
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

// getFullInventoryItemHistory function that fetches all inventory items histories
exports.getFullInventoryItemHistory = async (isProducer, isManufacturer, isDistributor, isRetailer, loggedUserId, initialInventoryItemID) => {
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, loggedUserId);
    const contractRes = await network.invoke(networkObj, 'getFullInventoryItemHistory', initialInventoryItemID);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log(error);
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getProductById = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, information) => {
    const { productId, id } = information;

    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryAsset', productId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getInventoryItemById = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, information) => {
    const { inventoryitemId, id } = information;

    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryAsset', inventoryitemId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllProducts = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, information) => {
    const { id } = information;
    console.log(id)

    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'Product');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllProducts error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllInventoryItems = async (information) => {
    const { id } = information;
    console.log(id)

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'InventoryItem');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllInventoryItems error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllShipments = async (information) => {
    const { id } = information;
    console.log(id)

    //const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'Shipment');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllShipments error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllShipmentItems = async (information) => {
    const { id } = information;
    console.log(id)

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'ShipmentItem');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllShipmentItems error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createOrder = async information => {
    const { productID, userId, userType, name } = information;

    const networkObj = await network.connect(false, false, false, false, true, id);
    const contractRes = await network.invoke(networkObj, 'orderProduct', productID, userId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.isDelivered = async information => {
    const { productId, id } = information;

    const networkObj = await network.connect(false, false, false, false, true, id);
    const contractRes = await network.invoke(networkObj, 'deliveredProduct', productId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getShipmentByName = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, shipment_name, id) => {
    console.log(shipment_name);
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryShipmentByName', shipment_name);
    console.log("Contract response: ", contractRes);
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};