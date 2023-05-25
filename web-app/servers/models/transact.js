const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.sendToManufacturer = async information => {
    const { productId, userId, id } = information;

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'sendToManufacturer', productId, userId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.sendToDistributor = async information => {
    const { productId, userId, id } = information;

    const networkObj = await network.connect(false, true, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'sendToDistributor', productId, userId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.sendToRetailer = async information => {
    const { productId, userId, id } = information;

    const networkObj = await network.connect(false, false, true, false, false, id);
    const contractRes = await network.invoke(networkObj, 'sendToRetailer', productId, userId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.sellToConsumer = async information => {
    const { productId, id } = information;

    const networkObj = await network.connect(false, false, false, true, false, id);
    const contractRes = await network.invoke(networkObj, 'sellToConsumer', productId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};