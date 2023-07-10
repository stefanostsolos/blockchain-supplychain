const orderModel = require('../models/order.js');
const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');
const path = require('path');
const fs = require('fs');
const { deepStrictEqual } = require('assert');
const uploadDir = path.resolve(__dirname, '../uploads');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.importOrders = async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }

    try {
        if (!req.file) {
            return apiResponse.badRequest(res, "No file was uploaded!");
        }

        const ordersFilePath = req.file.path;
        let orders;

        try {
            parsedFileContent = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
            orders = parsedFileContent.data;
        } catch (err) {
            return apiResponse.error(res, "An error occurred while reading the uploaded file!");
        }

        let allOrdersResponse = await productModel.getAllOrders(true, false, false, false, false, { id });

        if (allOrdersResponse.error) {
            return apiResponse.createModelRes(400, allOrdersResponse.error);
        }

        let nameCountMap = {};
        let createProductResponse;

        for (let product of orders) {
            console.log('11')
            const { PRODUCT_ID: product_name, PRODUCT_TYPE_ID: product_type, INTERNAL_NAME: internal_name, QUANTITY_INCLUDED: product_quantity } = product;
            nameCountMap[product_name] = (nameCountMap[product_name] || 0) + 1;
            const productCount = nameCountMap[product_name];

            const productsWithName = allOrdersResponse.data.filter(prod => prod.Record.Name === product_name && prod.Record.Status === 'Available');
            console.log('22')
            if (productCount <= productsWithName.length) {
                const existingProduct = productsWithName[productCount - 1];
                existingProduct.Record.Quantity = product_quantity;
                existingProduct.Record.ProductType = product_type;
                existingProduct.Record.InternalName = internal_name;
                console.log('33')
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
                console.log('44')
                let productData = { name: product_name, internalname: internal_name, type: product_type, id, quantity: product_quantity };
                createProductResponse = await productModel.createProduct(productData);
                if (createProductResponse.error) {
                    return apiResponse.createModelRes(400, createProductResponse.error);
                }
            }
        }

        return apiResponse.send(res, { status: 200, message: 'Orders were imported successfully' });
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};