import { type Express } from "express";
import wppconnect from "@wppconnect-team/wppconnect";
import fs from "fs";
import zap from "../routes/zap";

export function connectWPP(app: Express): void {
  // Inicia o bot
  wppconnect
    .create({
      session: "sessionName",
      catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR);
        const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const response: { type?: string; data?: Buffer } = {};

        if (matches && matches.length !== 3) {
          return new Error("Invalid input string");
        }
        if (matches) {
          response.type = matches[1];
          response.data = Buffer.from(matches[2], "base64");
        }

        const imageBuffer = response;
        if (imageBuffer.data) {
          fs.writeFile(
            "src/qr.png",
            imageBuffer.data,
            "binary",
            function (err) {
              if (err != null) {
                console.log(err);
              }
            },
          );
        }
      },
      logQR: false,
    })
    .then((client) => {
      start(app, client);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Inicia o cliente

async function start(app: Express, client: wppconnect.Whatsapp): Promise<void> {
  client.onMessage((message) => {
    if (message.body === "ola") {
      client
        .sendText(message.from, "Hello, how I may help you?")
        .then((result) => {
          console.log("Result: ", result); // return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); // return object error
        });
    }
  });

  // envia o cliente para todas as zap routes
  app.use((req, _res, next) => {
    req.client = client;
    req.app = app;
    next();
  });
  app.use("/zap", zap);
}
