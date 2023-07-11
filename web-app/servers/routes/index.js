const router = require('express').Router();
const userRouter = require('./user.js');
const productRouter = require('./product.js');
const transactRouter = require('./transact.js');
const orderRouter = require('./order.js');

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/transact', transactRouter);
router.use('/theorder', orderRouter);

module.exports = router;