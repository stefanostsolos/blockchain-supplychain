const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');
const path = require('path');
const fs = require('fs');
const uploadDir = path.resolve(__dirname, '../uploads');

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

exports.upload = async (req, res) => {
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

            let createProductResponse;
            for (let product of products) {
                const { PRODUCT_ID: product_name, UNIT_COST: product_price } = product;
                const productData = { name: product_name, id, price: product_price };
                console.log(productData);
                createProductResponse = await productModel.createProduct(productData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            }

            return apiResponse.send(res, createProductResponse);
        }
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.updateProduct = async (req, res) => {
    const { product_id, loggedUserId, name, price } = req.body;
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
        modelRes = await productModel.updateProduct(true, false, false, false, { product_id, loggedUserId, name, price });
    } else if (role === 'manufacturer') {
        modelRes = await productModel.updateProduct(false, true, false, false, { product_id, loggedUserId, name, price });
    } else if (role === 'distributor') {
        modelRes = await productModel.updateProduct(false, false, true, false, { product_id, loggedUserId, name, price });
    } else if (role === 'retailer') {
        modelRes = await productModel.updateProduct(false, false, false, true, { product_id, loggedUserId, name, price });
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
