const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 9000;

// middle ware
app.use(express.json());
app.use(cors());

// mongodb connection

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.6dzxxkd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function dbConnection() {
  try {
    await client.connect();
    console.log(" You successfully connected to MongoDB!");
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.log(error.message);
  }
}
dbConnection().catch((error) => console.log(error.message));
// mongodb connection
const RestaurantAllMenuCollection = client
  .db("Restaurant")
  .collection("Restaurant_MenuDatas");

// route
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: `server is running this is root route message ${new Date()}`,
  });
});

// load popular menu data
app.get("/restaurant_popularData", async (req, res) => {
  try {
    const category = "popular";
    const query = { category: category };
    const result = await RestaurantAllMenuCollection.find(query).toArray();
    if (result) {
      res.send({ success: true, data: result });
    }
  } catch (error) {
    res.send({ success: false, message: "Data Not Found" });
  }
});
// load popular menu data
// app listen
app.listen(port, () => {
  console.log(`server is running port__ ${port}`);
});
