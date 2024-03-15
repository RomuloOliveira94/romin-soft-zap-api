const express = require("express");
const router = express.Router();
const path = require("path");

router.post("/send-message", async (req, res) => {
  const client = req.client;
  console.log(client);
  const { number, message } = req.body;
  if (!number || !message) {
    res.status(400).send("Missing number or message");
    return;
  }
  try {
    await client
      .sendText(`55${number}@c.us`, message)
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
    res.status(200).send("Message sent");
    return;
  } catch (error) {
    res.status(500).send("Error sending message");
  }
});

router.get("/restart", async (req, res) => {
  const client = req.client;
  try {
    await client.logout();
    await client.initalize();
    res.status(200).send("Logged out");
    return;
  } catch (error) {
    res.status(500).send("Error logging out");
  }
});

router.get("/refresh", async (_req, res) => {
  //restart the server
  try {
    connectWPP();
    res.status(200).send("Server restarted");
    return;
  } catch (error) {
    res.status(500).send("Error restarting server");
  }
  return;
});

router.get("/qr", async (req, res) => {
  //set 5 seconds to get the qr code
  setTimeout(() => {
    const qr = path.join(__dirname, "../qr.png");
    if (!qr) {
      res.status(404).send("QR not found");
      return;
    }
    res.status(200).sendFile(qr);
  }, 5000);
  return;
});

module.exports = router;
