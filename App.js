const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const userRouter = require('./routes/User');
const sellerRouter = require('./routes/Seller');
const superAdminRouter = require('./routes/SuperAdmin');
const adminRouter = require('./routes/Admin');
const customerRouter = require('./routes/Customer');
const { verifyToken } = require('./middleware/VerifyToken');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(fileUpload());
app.use(express.json({ limit: '50mb' }));

app.use('/user', userRouter);
app.use('/seller', sellerRouter);
app.use('/superadmin', superAdminRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);


mongoose.connect('mongodb://127.0.0.1:27017/ecommerce').then(() => {
    console.log('Connected to database');
}
).catch((error) => {
    console.log(error);
}
);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
}
);