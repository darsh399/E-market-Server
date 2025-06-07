const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cors = require('cors');
const DbConnection = require('./configue/DbConnection');
const cookieParser = require('cookie-parser');


dotenv.config();

DbConnection();
const PORT = process.env.PORT || 5000;
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));



app.use('/api/v1/user', userRoutes);
app.use('/api/v1/item', itemRoutes);


app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});

