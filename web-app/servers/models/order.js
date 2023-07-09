const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createOrder = async information => {
    const { ordernameid, ordertypeid, ordername, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp, id } = information;
    console.log('model createShipment')

    const networkObj = await network.connect(true, false, false, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createOrder', ordernameid, ordertypeid, ordername, estimatedshipcost, partyidto, partyidfrom, lastupdatedstamp);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log('model error')
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log('success')
    return apiResponse.createModelRes(200, 'Success', contractRes);
};