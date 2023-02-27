const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const middleware = require('../common-middleware/index');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortid.generate() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });
router.post(
    '/category/create',
    middleware.requireSignin,
    middleware.adminMiddleware,
    upload.single('categoryImage'),
    categoryController.createCategory,
);
router.get('/category/getCategory', categoryController.getCategory);
module.exports = router;
