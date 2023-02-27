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
class category {
    createCategory(req, res) {
        const category = {
            name: req.body.name,
            slug: slugify(req.body.name),
        };
        if (req.file) {
            category.categoryImage = req.file.filename;
        }
        if (req.body.parentId) {
            category.parentId = req.body.parentId;
        }
        const cat = new modelsCategory(category);
        cat.save((error, category) => {
            if (error) {
                return res.status(202).json({
                    error: error,
                });
            }
            if (category) {
                return res.status(201).json({
                    category,
                });
            }
        });
    }
    getCategory(req, res) {
        modelsCategory
            .find({})
            .select('_id name slug categoryImage parentId children')
            .exec((error, categories) => {
                if (error) {
                    return res.status(202).json({
                        error,
                    });
                }
                if (categories) {
                    const categoriesList = createCategories(categories);
                    return res.status(200).json({
                        categoriesList,
                    });
                }
            });
    }
}
module.exports = new category();
