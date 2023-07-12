const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createOrder = async information => {
    const { ordernameid, ordertypeid, ordername, orderdate, orderstatusid, grandtotal, lastupdatedstamp, createdstamp, id } = information;
    console.log('model createShipment')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createOrder', ordernameid, ordertypeid, ordername, orderdate, orderstatusid, grandtotal, lastupdatedstamp, createdstamp);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.createOrderItem = async information => {
    const { ordernameid, orderitemtypeid, productnameid, quantity, unitprice, itemdescription, statusid, lastupdatedstamp, createdstamp, inventoryitemnumid, id } = information;
    console.log('model createOrderItem')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createOrderItem', ordernameid, orderitemtypeid, productnameid, quantity, unitprice, itemdescription, statusid, lastupdatedstamp, createdstamp, inventoryitemnumid);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllOrders = async (information) => {
    const { id } = information;
    console.log(id)

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'Order');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllOrders error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllOrderItems = async (information) => {
    const { id } = information;
    console.log(id)

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', 'OrderItem');

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model getAllOrderItems error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getOrderByName = async (isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, order_name, id) => {
    console.log(order_name);
    const networkObj = await network.connect(isProducer, isManufacturer, isDistributor, isRetailer, isConsumer, id);
    const contractRes = await network.invoke(networkObj, 'queryOrderByName', order_name);
    console.log("Contract response: ", contractRes);
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};