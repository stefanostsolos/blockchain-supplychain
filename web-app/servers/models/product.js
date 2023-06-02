const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createProduct = async information => {
    const { name, id, price } = information;
    console.log('model createproduct')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createProduct', name, id, price);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success?')
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