const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '../uploads');
const multer = require('multer');
const upload = multer({ dest: uploadDir });
const productRouter = require('express').Router();
const controller = require('../controllers/product.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

// Check if the uploads directory exists
const dirPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(dirPath)) {
  // If it doesn't exist, create it
  fs.mkdirSync(dirPath);
}

productRouter.use('/', authMiddleware);
productRouter.use('/order', authMiddleware);
productRouter.use('/delivered', authMiddleware);
productRouter.post('/', controller.createProduct);
productRouter.get('/list/:role', controller.getAllProducts);
productRouter.put('/:productId/:role', controller.updateProduct);
productRouter.get('/:productId/:role', controller.getProductbyId);
productRouter.post('/upload', upload.single('file'), controller.upload);

// productRouter.post('/order', controller.createOrder);
// productRouter.post('/delivered', controller.isDelivered);

module.exports = productRouter;