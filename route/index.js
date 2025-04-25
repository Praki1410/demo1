const express = require('express');
const fileUpload = require('express-fileupload');
const auth = require('../route/userRoutes.js');
const product = require('../route/productRoutes.js');

const router = express.Router();

router.use("/auth", auth);
router.use("/product", product);

module.exports = router;
