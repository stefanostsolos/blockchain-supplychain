const authenticateUtil = require('../utils/authenticate');
const apiResponse = require('../utils/apiResponse.js');

module.exports = async (req, res, next) => {
    const accessToken = req.headers['x-access-token'];

    if (!accessToken) {
        console.log('if not true')
        return apiResponse.unauthorized(res, 'Required access token');
    }

    try {
        const result = await authenticateUtil.certifyAccessToken(accessToken);
        req.body.id = result.id;
        req.body.loggedUserType = result.UserType;
        console.log(req.body.loggedUserType)
        console.log(result.UserType)
        req.body.loggedUserName = result.Name;
        console.log(req.body.loggedUserName)
        console.log(result.Name)
        return next();
    } catch (err) {
        console.log('unauthorized')
        return apiResponse.unauthorized(res, err.toString());
    }
};