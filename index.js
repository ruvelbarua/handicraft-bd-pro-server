const express = require('express');
const app = express()
// const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
// const admin = require("firebase-admin");
// const res = require('express/lib/response');
require('dotenv').config();

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
        });

        // Make Admin With Real Email
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // GET Admin & Email Cheack
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // GET ALL DATA
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // POST DATA
        app.post('/addproducts', async (req, res) => {
            const resutl = await productCollection.insertOne(req.body);
            res.send(resutl.insertedId);
        });

        // GET SINGLE DATA
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const product = await productCollection.findOne(query);
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


// -----Firebase Link-----
// const serviceAccount = require('./handicraft-bd-firebase-adminsdk.json')
// JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
// -----------

// -------Email Verify Token-------
// async function verifyToken(req, res, next) {
//     if (req.headers?.authorization?.startsWith('Bearer ')) {
//         const token = req.headers.authorization.split('')[1];
//         try {
//             const decodedUser = await admin.auth().verifyIdToken(token);
//             req.decodedEmail = decodedUser.email;
//         }
//         catch {

//         }
//     }
//     next();
// }

// ------Email VerifyToken Note:---------
// app.put('/users/admin', verifyToken, async (req, res) => {
//     const user = req.body;
//     const requester = req.decodedEmail;
//     if (requester) {
//         const requesterAccount = await usersCollection.findOne({ email: requester });
//         if (requesterAccount.role === 'admin') {
//             const filter = { email: user.email };
//             const updateDoc = { $set: { role: 'admin' } };
//             const result = await usersCollection.updateOne(filter, updateDoc);
//             res.json(result);
//         }
//     }
//     else {
//         res.status(403).json({ message: 'you do not have access to make admin user' })
//     }
// })
