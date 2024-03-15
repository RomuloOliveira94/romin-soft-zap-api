import { type Whatsapp } from "@wppconnect-team/wppconnect";
import express from "express";
const router = express.Router();

router.post("/send-message", async (req, res) => {
  const client: Whatsapp = req.client;
  const { number, message } = req.body;
  if (!number || !message) {
    res.status(400).send("Missing number or message");
    return;
  }
  try {
    await client
      .sendText(`55${number}@c.us`, message)
      .then((result) => {
        console.log("Result: ", result.body); // return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); // return object error
      });
    res.status(200).send("Message sent");
  } catch (error) {
    res.status(500).send("Error sending message");
  }
});

router.get("/restart", async (req, res) => {
  const client: Whatsapp = req.client;
  try {
    await client.logout();
    res.status(200).send("Logged out");
  } catch (error) {
    res.status(500).send("Error logging out");
  }
});

export default router;
