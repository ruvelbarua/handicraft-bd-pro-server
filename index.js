const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;


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
        const productCollection = client.db("handicraftsbd").collection("products");
        // const ordersCollection = client.db("handicraftsbd").collection("orders");

        // POST DATA
        app.post("/addproducts", async (req, res) => {
            console.log(req.body);
            const resutl = await productCollection.insertOne(req.body);
            res.send(resutl.insertedId);
        });
        // GET DATA
        app.get("/products", async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.send(result);
        });
        // DETETE DATA
        app.delete("/deleteProduct/:id", async (req, res) => {
            const result = await productCollection.deleteOne({
                _id: objectId(req.params.id),
            });
            res.send(result);
        });

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
    console.log('Handicraft BD Server on Port', port);
})

