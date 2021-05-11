const cors = require("cors");
const express = require("express");
require("dotenv").config();
// TODO: adda stripe key
const stripe = require("stripe")(process.env.PUBLISH_KEY);
const { v4: uuidv4 } = require("uuid");

const app = express();

// middleware
// will be passing  json values
app.use(express.json());
app.use(cors());
// routes
app.get("/", (req, res) => {
  res.send("its working");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempotencykey = uuidv4();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charge.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: tokn.email,

          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencykey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});
// litsining
app.listen(8282, () => console.log("litsining to 8282"));
