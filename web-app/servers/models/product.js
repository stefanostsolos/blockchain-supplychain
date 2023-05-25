const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createProduct = async information => {
    const { name, id, price } = information;

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createProduct', name, id, price);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.updateProduct = async (isProducer, isManufacturer, isDistributor, isRetailer, information) => {
    const { productId, name, id, price } = information;

    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, false, id);
    const contractRes = await network.invoke(networkObj, 'updateProduct', productId, id, name, price);

    const error = networkObj.error || contractRes.error;
    if (error) {
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

    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'Product');

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createOrder = async information => {
    const { productID, userId, userType, name } = information;

    const networkObj = await network.connect(false, false, true, id);   
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

    const networkObj = await network.connect(false, false, true, id);
    const contractRes = await network.invoke(networkObj, 'deliveredProduct', productId );

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};