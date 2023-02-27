const mongoose = require('mongoose');
const Product = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        slug: {
            type: String,
            require: true,
            unique: true,
        },
        price: {
            type: Number,
            require: true,
        },
        quantity: {
            type: Number,
            require: true,
        },
        description: {
            type: String,
            require: true,
            trim: true,
        },
        offer: {
            type: Number,
        },
        productPicture: [
            {
                img: {
                    type: String,
                },
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require: true,
        },
        review: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                review: {
                    type: String,
                },
            },
        ],
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: Date,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Product', Product);
