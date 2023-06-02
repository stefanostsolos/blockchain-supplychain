const productRouter = require('express').Router();
const controller = require('../controllers/product.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

productRouter.use('/', authMiddleware);
productRouter.use('/order', authMiddleware);
productRouter.use('/delivered', authMiddleware);
productRouter.post('/', controller.createProduct);
productRouter.get('/list/:role', controller.getAllProducts);
productRouter.put('/:productId/:role', controller.updateProduct);
productRouter.get('/:productId/:role', controller.getProductbyId);

// productRouter.post('/order', controller.createOrder);
// productRouter.post('/delivered', controller.isDelivered);

module.exports = productRouter;