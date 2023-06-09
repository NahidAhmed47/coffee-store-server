const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ze0g6j8.mongodb.net/?retryWrites=true&w=majority`;

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

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    app.post('/coffee',async(req, res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })
    app.get('/coffee',async(req, res)=>{
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })
    app.get('/coffee/:id',async(req, res)=>{
      const id = req.params.id;
      const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })
    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          category: updatedCoffee.category,
          teste: updatedCoffee.teste,
          details: updatedCoffee.details,
          photoUrl: updatedCoffee.photoUrl,
          supplier: updatedCoffee.supplier,
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    })
    app.delete('/coffee/:id',async(req, res)=>{
      const id = req.params.id;
      const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
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
    res.send('Server is running!');
});
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})