const authModel = require('../models/user.js');
const apiResponse = require('../utils/apiResponse.js');

exports.signup = async (req, res) => {
    const { id, userType, address, name, email, password } = req.body;
    const { role } = req.params;

    console.log(req.body);
    console.log(role);

    if ((!id || !userType || !address || !name  || !email || !password )) {
        console.log('controller user error 1');
        return apiResponse.badRequest(res);
    }

    let modelRes;

    if (role === 'producer') {
        modelRes = await authModel.signup(true, false, false, false, false, { id, userType, address, name, email, password });
        console.log('prod signup')
    } else if (role === 'manufacturer') {
        modelRes = await authModel.signup(false, true, false, false, false, { id, userType, address, name, email, password });
    } else if (role === 'distributor') {
        modelRes = await authModel.signup(false, false, true, false, false, { id, userType, address, name, email, password });
    } else if (role === 'retailer') {
        modelRes = await authModel.signup(false, false, false, true, false, { id, userType, address, name, email, password });
    } else if (role === 'consumer') {
        modelRes = await authModel.signup(false, false, false, false, true, { id, userType, address, name, email, password });
    } else {
        return apiResponse.badRequest(res);
        console.log('controller user error 2')
    }

    return apiResponse.send(res, modelRes);
};

exports.signin = async (req, res) => {
    const { id, password } = req.body;
    const { role } = req.params;
    if (!id || !password || !role) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'producer') {
        modelRes = await authModel.signin(true, false, false, false, false, { id, password });
        console.log('prod signin')
    } else if (role === 'manufacturer') {
        modelRes = await authModel.signin(false, true, false, false, false, { id, password });
    } else if (role === 'distributor') {
        modelRes = await authModel.signin(false, false, true, false, false, { id, password });
    } else if (role === 'retailer') {
        modelRes = await authModel.signin(false, false, false, true, false, { id, password });
    } else if (role === 'consumer') {
        modelRes = await authModel.signin(false, false, false, false, true, { id, password });
    } else {
        return apiResponse.badRequest(res);
        console.log('user controller?')
    }

    return apiResponse.send(res, modelRes);
};

exports.getAllUser = async (req, res) => {
    const { id } = req.body;
    const { role } = req.params;

    let modelRes;
    if (role === 'producer') {
        modelRes = await authModel.getAllUser(true, false, false, false, false, { id });
    } else if (role === 'manufacturer') {
        modelRes = await authModel.getAllUser(false, true, false, false, false, { id });
    } else if (role === 'distibutor') {
        modelRes = await authModel.getAllUser(false, false, true, false, false, { id });
    } else if (role === 'retailer') {
        modelRes = await authModel.getAllUser(false, false, false, true, false, { id });
    } else if (role === 'consumer') {
        modelRes = await authModel.getAllUser(false, false, false, false, true, { id });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};