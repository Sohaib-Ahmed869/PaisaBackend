// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/Admin.js');
const userRoutes = require('./routes/User.js');

dotenv.config();
const app = express();
app.use(cors());
//kFwCGPYp2m5fzFXv
const mongoURI = 'mongodb+srv://yk26391:kFwCGPYp2m5fzFXv@cluster0.l4akbny.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use(bodyParser.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to your server!');
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
