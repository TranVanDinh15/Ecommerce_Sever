const modelsProduct = require('../models/product');
const modelsCategory = require('../models/category');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const createCategories = (categories, parentId = null) => {
    const categoriesList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((item) => item.parentId == undefined);
    } else {
        category = categories.filter((item) => item.parentId == parentId);
    }
    for (let cate of category) {
        categoriesList.push({
            _id: cate.id,
            name: cate.name,
            slug: cate.name,
            parentId: cate.parentId,
            categoryImage: cate.categoryImage,
            children: createCategories(categories, cate._id),
        });
    }
    return categoriesList;
};
class productController {
    createProduct(req, res) {
        const { name, price, description, category, createBy, quantity } = req.body;
        let productPicture = [];
        if (req.files.length > 0) {
            productPicture = req.files.map((item) => {
                console.log(item.filename);
                return {
                    img: item.filename,
                };
            });
        }
        const product = new modelsProduct({
            name,
            slug: slugify(name),
            price,
            description,
            category,
            quantity,
            productPicture,
            createBy: req.user._id,
        });
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error,
                });
            }
            if (product) {
                return res.status(200).json({
                    product,
                });
            }
        });
    }
    async getProduct(req, res) {
        const categories = await modelsCategory.find().exec();
        const product = await modelsProduct
            .find()
            .select('_id name price quantity slug description productPicture category')
            .populate({ path: 'category', select: '_id name' });
        return res.status(200).json({
            categories: createCategories(categories),
            product,
        });
    }
    async getProductByID(req, res) {
        const { _id } = req.params;
        const product = await modelsProduct
            .find({
                parentId: _id,
            })
            .select('_id name price quantity slug description productPicture category')
            .populate({ path: 'category', select: '_id name' })
            .sort({ _id: -1 })
            .exec((error, product) => {
                if (error) {
                    return res.status(400).json({
                        error,
                    });
                }
                if (product) {
                    return res.status(200).json({
                        product,
                        productByPrice: [
                            {
                                name: 'Dưới 1 triệu',
                                product: product.filter((item) => item.price < 1000000),
                            },

                            {
                                name: 'Từ 1 đến 5 triệu',
                                product: product.filter((item) => item.price > 1000000 && item.price <= 5000000),
                            },

                            {
                                name: 'Từ 5 đến 10 triệu',
                                product: product.filter((item) => item.price > 1000000 && item.price <= 10000000),
                            },

                            {
                                name: 'Từ 10 đến 20 triệu',
                                product: product.filter((item) => item.price > 10000000 && item.price <= 20000000),
                            },
                            {
                                name: 'Từ 20 đến 30 triệu',
                                product: product.filter((item) => item.price > 20000000 && item.price <= 30000000),
                            },
                            {
                                name: 'Trên 30 triệu',
                                product: product.filter((item) => item.price > 30000000),
                            },
                        ],
                    });
                }
            });
    }
}
module.exports = new productController();
