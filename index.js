const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vcouptk.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();

        const dirveGearProducts = client.db('dirveGear').collection('products');
        const diverGearCart = client.db('dirveGear').collection('userCard');

        app.get('/products', async(req,res)=>{
            const cursor = dirveGearProducts.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/products/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await dirveGearProducts.findOne(query);
            res.send(result)
        })

        app.post('/products' , async(req,res)=> {
            const newProducts = req.body;
            const result = await dirveGearProducts.insertOne(newProducts);
            res.send(result)
        } )

        app.put('/products/:id', async(req,res) =>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)}
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name : updatedProduct.name,
                    brand : updatedProduct.brand,
                    type : updatedProduct.type,
                    description : updatedProduct.description,
                    price : updatedProduct.price,
                    rating : updatedProduct.rating,
                    image : updatedProduct.image
                }
            }
            const result = dirveGearProducts.updateOne(filter,product,options);
            res.send(result);
        })

        app.post('/user-cart', async(req,res) => {

            const cart = req.body;
            const result = await diverGearCart.insertOne(cart);
            res.send(result);
            
        })
        
        app.get('/user-cart' , async(req,res) => {

            res.send('data will come.....')
        })

        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('DirveGear Server running...........................')
})

app.listen(port, () => {
    console.log(`Surver run on port: ${port}`)
})