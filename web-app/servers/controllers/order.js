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

