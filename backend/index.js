const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected ✅'))
  .catch(err => console.log('MongoDB connection error ❌:', err));

// ✅ Serve static files from Vite build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ✅ Optional API health check
app.get('/', (req, res) => {
  res.send('Backend API is running ✅');
});

// ✅ API Routes
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.json("Already registered");
      } else {
        FormDataModel.create(req.body)
          .then(log_reg_form => res.json(log_reg_form))
          .catch(err => res.json(err));
      }
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("Wrong password");
        }
      } else {
        res.json("No records found!");
      }
    });
});

// ✅ Catch-all route to serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ✅ Start server
app.listen(process.env.PORT || 5000, '0.0.0.0',() => {
  console.log("Server listening on http://127.0.0.1:5000");
});
