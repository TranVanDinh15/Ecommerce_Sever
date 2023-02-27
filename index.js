const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./src/router/user');
const adminRouter = require('./src/router/admin/userAdmin');
const category = require('./src/router/category');
const product = require('./src/router/product');
const cart = require('./src/router/cart');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('redis');
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
let RedisStore = require('connect-redis')(session);
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 5000, httpOnly: true },
    }),
);
app.get('/setSession', (req, res) => {
    req.session.user = {
        name: 'tvd',
        age: 20,
    };
    return res.send('Set Ok');
});
app.get('/getSession', (req, res) => {
    return res.send(req.session);
});
app.use('/public', express.static(path.join(__dirname, '/src/uploads')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '500mb' }));
app.use(bodyParser.json());
require('dotenv').config();
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOOSE_DB_USERNAME}:${process.env.MONGOOSE_DB_PASSWORD}@cluster0.nk5acyh.mongodb.net/?retryWrites=true&w=majority`,
        {},
    )
    .then(() => {
        console.log('connect database');
    });
app.use('/api', userRouter);
app.use('/api', category);
app.use('/api', product);
app.use('/api', cart);
app.use('/api', adminRouter);
app.get('/', (req, res) => {
    return res.send('hello');
});
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
