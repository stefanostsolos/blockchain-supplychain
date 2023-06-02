const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createProduct = async (req, res) => {
    const { id, name, price, loggedUserType } = req.body;
    console.log('controller create 1');

    if (!name || !id || !price || !loggedUserType) {
        console.log('controller product error')
        return apiResponse.badRequest(res);
    }
    console.log('controller create 2');

    if (loggedUserType !== 'producer' ) {
        console.log('not producer usertype')
        return apiResponse.badRequest(res);
    }
    console.log('controller create 3');

    const modelRes = await productModel.createProduct({ name, id, price });
    console.log('done')
    return apiResponse.send(res, modelRes);
};

exports.updateProduct = async (req, res) => {
    const { id, loggedUserId, name, price } = req.body;
    const { role } = req.params;
    console.log('controller update 1');

    if (!name || !id || !price || !role || !loggedUserId) {
        return apiResponse.badRequest(res);
    }
    console.log('controller update 2');

    if (loggedUserType === 'consumer' ) {
        return apiResponse.badRequest(res);
    }
    console.log('controller update 3');

    let modelRes
    if (role === 'producer') {
        modelRes = await productModel.updateProduct(true, false, false, false, { id, loggedUserId, name, price });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.updateProduct(false, true, false, false, { id, loggedUserId, name, price });
    } else if (role === 'distributor') {
        modelRes = await productModel.updateProduct(false, false, true, false, { id, loggedUserId, name, price });
    } else if (role === 'retailer') {
        modelRes = await productModel.updateProduct(false, false, false, true, { id, loggedUserId, name, price });
    } else {
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