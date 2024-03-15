import path from "path";
import express, { type Express } from "express";
import { connectWPP } from "../services/init-zap-service";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Bem vindo a API do WhatsApp!");
});

router.get("/qr", async (_req, res) => {
  // set 5 seconds to get the qr code
  setTimeout(() => {
    const qr = path.resolve("src/qr.png");
    if (!qr) {
      res.status(404).send("QR not found");
      return;
    }
    res.status(200).sendFile(qr);
  }, 5000);
});

// restart the service

router.get("/init", async (req, res) => {
  const app = req.app;
  try {
    connectWPP(app as Express);
    res.status(200).send("server restarted");
  } catch (error) {
    res.status(500).send("Error initializing the server");
  }
});

export default router;
