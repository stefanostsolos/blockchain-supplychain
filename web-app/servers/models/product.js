const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createShipment = async information => {
    const { shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp, id } = information;
    console.log('model createShipment')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createShipment', shipmentname, shipmenttypeid, statusid, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp );

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
    const { shipmentid, shipmentname, name, id, price, quantity, producttype } = information;
    console.log('model createProduct')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createProduct', shipmentid, shipmentname, name, id, price, quantity, producttype);

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
    const { product_id, loggedUserId, name, price } = information;
    console.log('model updateproduct')
    console.log(product_id);
    console.log(loggedUserId);
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, loggedUserId);
    const contractRes = await network.invoke(networkObj, 'updateProduct', product_id, loggedUserId, name, price);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

// New getFullProductHistory function that fetches all product histories
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
    const { productId , id } = information;

    const networkObj = await network.connect(false, false, false, false, true, id);
    const contractRes = await network.invoke(networkObj, 'deliveredProduct', productId );

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