const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cors = require('cors');
const DbConnection = require('./configue/DbConnection');
dotenv.config();

DbConnection();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/item', itemRoutes);


app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});

