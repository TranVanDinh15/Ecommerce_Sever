const modelsUser = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
class userController {
    async sigUpController(req, res) {
        modelsUser
            .findOne({
                email: req.body.email,
            })
            .exec((error, user) => {
                if (user) {
                    return res.status(201).json({
                        message: 'Email  already registered',
                    });
                }
                const { fisrtName, lastName, email, password, role } = req.body;
                const _user = new modelsUser({
                    fisrtName,
                    lastName,
                    email,
                    password,
                    role,
                    userName: shortid.generate(),
                });
                _user.save((error, data) => {
                    if (error) {
                        return res.status(201).json({
                            message: 'Something went wrong',
                        });
                    }
                    if (data) {
                        return res.status(200).json({
                            message: 'Create user success !!',
                        });
                    }
                });
            });
    }
    async sigInController(req, res) {
        modelsUser
            .findOne({
                email: req.body.email,
            })
            .exec(async (error, user) => {
                if (error) {
                    return res.status(500).json({
                        error,
                    });
                }
                if (user) {
                    if (!req.body.password || !user.hash_password) {
                        return res.status(200).json({
                            message: 'Empty password',
                            user,
                        });
                    }
                    const compare = await bcrypt.compare(req.body.password, user.hash_password);
                    if (compare) {
                        const token = jwt.sign(
                            {
                                _id: user._id,
                                role: user.role,
                            },
                            process.env.ECOMMECE_SCRET,
                        );
                        const { fisrtName, lastName, role, fullName } = user;
                        res.cookie('token', token, { expiresIn: '1h' });
                        return res.status(200).json({
                            token,
                            user: {
                                fisrtName,
                                lastName,
                                role,
                                fullName,
                            },
                        });
                    } else {
                        return res.status(201).json({
                            message: 'Invalid Password',
                        });
                    }
                } else {
                    return res.status(201).json({
                        message: 'Email exist not in System !!',
                    });
                }
            });
    }
}
module.exports = new userController();
