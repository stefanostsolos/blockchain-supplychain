const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '../uploads');
const multer = require('multer');
const upload = multer({ dest: uploadDir });
const orderRouter = require('express').Router();
const controller = require('../controllers/order.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

// Check if the uploads directory exists
const dirPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(dirPath)) {
  // If it doesn't exist, create it
  fs.mkdirSync(dirPath);
}

orderRouter.use('/', authMiddleware);
orderRouter.post('/', controller.createProduct);
orderRouter.get('/list/:role', controller.getAllProducts);
orderRouter.put('/:productId/:role', controller.updateProduct);
orderRouter.get('/:productId/:role', controller.getProductbyId);
orderRouter.get('/inventory/items/get/:inventoryitemId/:role', controller.getInventoryItembyId);

orderRouter.post('/importOrders', upload.single('file'), controller.importOrders);
orderRouter.post('/import/OrderItems', upload.single('file'), controller.importOrderItems);
orderRouter.post('/import/Order/Item/Ship/Details', upload.single('file'), controller.importOrderItemDetails);
orderRouter.post('/import/Inventory/Item/Details/', upload.single('file'), controller.importInventoryItemDetails);

orderRouter.post('/inventory/items/upload/all/item', upload.single('file'), controller.importInventoryItems);
orderRouter.post('/history/:role/:productId', controller.getFullProductHistory);
orderRouter.post('/history/of/all/inventory/items/:role/:inventoryitemId', controller.getFullInventoryItemHistory);
orderRouter.get('/list/show/inventory/:role', controller.getAllInventoryItems);

module.exports = orderRouter;