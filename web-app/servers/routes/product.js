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
productRouter.get('/inventory/items/get/:inventoryitemId/:role', controller.getInventoryItembyId);
productRouter.get('/shipment/items/get/all/shipmentitem/:role', controller.getAllShipmentItems);
productRouter.post('/upload', upload.single('file'), controller.upload);
productRouter.post('/inventory/items/upload/all/item', upload.single('file'), controller.importInventoryItems);
productRouter.post('/shipments/items/upload/all/item/up', upload.single('file'), controller.importShipmentItems);
productRouter.post('/history/:role/:productId', controller.getFullProductHistory);
productRouter.post('/history/of/all/inventory/items/:role/:inventoryitemId', controller.getFullInventoryItemHistory);
productRouter.post('/shipments/upload', upload.single('file'), controller.importShipments);
productRouter.post('/shipments/shipment/item/upload', upload.single('file'), controller.importShipmentItems);
productRouter.get('/shipments/show/all', controller.getAllShipments);
productRouter.get('/list/show/inventory/:role', controller.getAllInventoryItems);
// productRouter.post('/order', controller.createOrder);
// productRouter.post('/delivered', controller.isDelivered);

module.exports = productRouter;