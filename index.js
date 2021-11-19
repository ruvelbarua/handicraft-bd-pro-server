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
        // user data link
        // const usersCollection = database.collection('users');
        // const orderCollection = client.db("handicraftsbd").collection("productorders");


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

        // DETETE PRODACT
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
    res.send('abcd');
});

// Internal Server Test
app.listen(port, () => {
    console.log('Handicraft BD Server on Port', port);
})


// // GET PRODUCT ORDER
        // app.post('/productorders', async (req, res) => {
        //     const productorder = req.body;
        //     const result = await orderCollection.insertOne(productorder);
        //     confole.log(result);
        //     res.json(result)
        // });

        // // Collection User Data
        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user);
        //     console.log(result)
        //     res.json(result);
        // })

        // // Update User Data
        // app.put('/users', async (req, res) => {

        // })

        // // ORDER POST from OrderData Page
        // app.post("/orders", async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     console.log(query);
        //     const cursor = ordersCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.json(orders)
        // })
