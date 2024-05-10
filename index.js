const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Port
const port = process.env.PORT || 5000;

// Use of middleware
app.use(cors());
app.use(express.json());

// Start Mongodb Connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.jhrstoy.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Database from MongoDb
        const obsnestdata = client.db('obsnest').collection('productData')

        // Get Data
        app.get('/menudata', async (req, res) => {
            const cursor = obsnestdata.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.log("An Error Occurred", error);
        res.status(500).send("Internal Server Error")
    }

    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// Connected with MongoDB

// Get Apies
app.get('/', async (req, res) => {
    const result = "Obsnest Banckend Server Is Running Propperly";
    res.send(result);
});

// Listen Apies
app.listen(port, () => {
    console.log(`Started Server on port : ${port}`);
}).on('error', (error) => {
    console.log("Server StartUp Error", error);
});