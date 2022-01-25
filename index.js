const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;

const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Database Link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziv9h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(url);

// Client Server Link
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("handicraftsbd").collection("products");
        // user data link
        const usersCollection = client.db("handicraftsbd").collection("users");

        // GET Email Data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // User Email Cheack & Update
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // GET DATA
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // POST DATA
        app.post('/addproducts', async (req, res) => {
            console.log(req.body);
            const resutl = await productCollection.insertOne(req.body);
            res.send(resutl.insertedId);
        });

        // GET SINGLE DATA
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const product =
                await productCollection.findOne(query);
            res.json(product)
        });

        // DETETE SINGLE PRODACT
        app.delete('/products/:id', async (req, res) => {
            const result = await productCollection.deleteOne({
                _id: objectId(req.params.id),
            });
            res.send(result);
        });

        // UPDATE SINGLE DATA
        app.put('/update/:id', (req, res) => {
            const id = req.params.id;
            const updateName = req.body;
            const filter = { _id: objectId(id) };
            productCollection
                .updateOne(filter, {
                    $set: {
                        name: updateName.name,
                        price: updateName.price,
                        design: updateName.design,
                    },
                })
                .then((result) => {
                    res.send(result);
                });
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// Live Server Test
app.get('/', (req, res) => {
    res.send('Test Handicraft Page');
});

// Internal Server Test
app.listen(port, () => {
    console.log('Handicraft BD Server on Port', port);
})

// Project Develop By: Ruvel Barua


