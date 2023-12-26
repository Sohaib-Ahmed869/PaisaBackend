const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRouter = require('./routes/User');

const superAdminRouter = require('./routes/SuperAdmin');
const { verifyToken } = require('./middleware/VerifyToken');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

app.use('/superadmin', superAdminRouter);


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