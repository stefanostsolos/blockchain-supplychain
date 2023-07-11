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
    console.log(id);
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }
    try {
        console.log(id);
        if (!req.file) {
            return apiResponse.badRequest(res, "No file was uploaded!");
        } else {
            let orderFile = req.file;

            // Use the mv() method to place the file in upload directory
            const orderFilePath = req.file.path;

            // Read JSON data
            let orders;
            try {
                parsedFileContent = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
                orders = parsedFileContent.data;
            } catch (err) {
                console.log(err);
                console.error(err);
                return apiResponse.error(res, "An error occurred while reading the uploaded file!");
            }

            let createOrdersResponse;
            for (let order of orders) {
                const { ORDER_ID: order_name_id, ORDER_TYPE_ID: order_type_id, ORDER_NAME: order_name, ORDER_DATE: order_date, STATUS_ID: order_status_id, GRAND_TOTAL: grand_total, LAST_UPDATED_STAMP: last_updated_stamp, CREATED_STAMP: created_stamp } = order;
                const orderData = { ordernameid: order_name_id, ordertypeid: order_type_id, ordername: order_name, orderdate: order_date, orderstatusid: order_status_id, grandtotal: grand_total, lastupdatedstamp: last_updated_stamp, createdstamp: created_stamp, id };
                console.log(orderData);
                createOrdersResponse = await orderModel.createOrder(orderData);
                if (createOrdersResponse.error) {
                    return apiResponse.createModelRes(400, createOrdersResponse.error);
                }
            }

            return apiResponse.send(res, createOrdersResponse);
        }
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.importOrderItems = async (req, res) => {
    const id = req.body.id;
    console.log(id);
    if (!id) {
        return apiResponse.badRequest(res, 'User ID is required');
    }
    try {
        console.log(id);
        if (!req.file) {
            return apiResponse.badRequest(res, "No file was uploaded!");
        } else {
            const productFilePath = req.file.path;

            let orderitems;
            try {
                parsedFileContent = JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
                orderitems = parsedFileContent.data;
            } catch (err) {
                console.log(err);
                console.error(err);
                return apiResponse.error(res, "An error occurred while reading the uploaded file!");
            }

            let createOrderItemResponse;
            for (let orderitem of orderitems) {
                const { ORDER_ID: order_name_id, ORDER_ITEM_TYPE_ID: order_item_type_id, PRODUCT_ID: product_name_id, QUANTITY: quantity, UNIT_PRICE: unit_price, ITEM_DESCRIPTION: item_description, STATUS_ID: status_id, LAST_UPDATED_STAMP: last_updated_stamp, CREATED_STAMP: created_stamp} = orderitem;
                const orderitemData = { ordernameid: order_name_id, orderitemtypeid: order_item_type_id, productnameid: product_name_id, quantity: quantity, unitprice: unit_price, itemdescription: item_description, statusid: status_id, lastupdatedstamp: last_updated_stamp, createdstamp: created_stamp, inventoryitemnumid: "", id };
                console.log(orderitemData);
                createOrderItemResponse = await orderModel.createOrderItem(orderitemData);
                if (createOrderItemResponse.error) {
                    return apiResponse.createModelRes(400, createOrderItemResponse.error);
                }
            }

            return apiResponse.send(res, createOrderItemResponse);
        }
    } catch (err) {
        console.log(err);
        return apiResponse.error(res, "An error occurred!");
    }
};

exports.getAllOrders = async (req, res) => {
    console.log('getAllOrders')
    const { id } = req.body;
    console.log(id)
    console.log('controller getAllOrders 1');

    if (!id) {
        console.log(id);
        console.log('controller bad request')
        return apiResponse.badRequest(res);
    }
    console.log('controller getAllOrders 2');
    let modelRes;
    modelRes = await orderModel.getAllOrders({ id: id });

    return apiResponse.send(res, modelRes);
};

exports.getAllOrderItems = async (req, res) => {
    console.log('getAllOrderItems')
    const { id } = req.body;
    console.log(id)
    console.log('controller getAllOrderItems 1');

    if (!id) {
        console.log(id);
        console.log('controller bad request')
        return apiResponse.badRequest(res);
    }
    console.log('controller getAllOrderItems 2');
    let modelRes;
    modelRes = await orderModel.getAllOrderItems({ id: id });

    return apiResponse.send(res, modelRes);
};