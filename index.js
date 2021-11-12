const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Database Link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziv9h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

// Client Server Link
async function run() {
    try {
        await client.connect();
        console.log('Database Connected Successfully');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// Live Server Test
app.get('/', (req, res) => {
    res.send('Handicraft BD Server Running');
});

// Internal Server Test
app.listen(port, () => {
    console.log('Handicraft BD Server on Port', port)
})

