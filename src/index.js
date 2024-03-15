const wppconnect = require("@wppconnect-team/wppconnect");
const basicAuth = require("express-basic-auth");
const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const fs = require("fs");

const configContent = fs.readFileSync("config.json");
const config = JSON.parse(configContent);

const basicAuthUsers = {};
basicAuthUsers[config.user] = config.password;

app.use(basicAuth({ users: basicAuthUsers }));

async function connectWPP() {
  await wppconnect
    .create({
      session: "sessionName",
      catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response = {};

        if (matches.length !== 3) {
          return new Error("Invalid input string");
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], "base64");

        var imageBuffer = response;
        require("fs").writeFile(
          "src/qr.png",
          imageBuffer["data"],
          "binary",
          function (err) {
            if (err != null) {
              console.log(err);
            }
          }
        );
      },
      logQR: false,
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));
}

connectWPP();

function start(client) {
  app.post("/send", async (req, res) => {
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

  app.get("/qr", async (_req, res) => {
    //set 5 seconds to get the qr code
    setTimeout(() => {
      const qr = path.join(__dirname, "qr.png");
      if (!qr) {
        res.status(404).send("QR not found");
        return;
      }
      res.status(200).sendFile(qr);
    }, 5000);
    return;
  });

  app.get("/restart", async (_req, res) => {
    try {
      await client.logout();
      await client.initalize();
      res.status(200).send("Logged out");
      return;
    } catch (error) {
      res.status(500).send("Error logging out");
    }
  });
}

app.get("/refresh", async (_req, res) => {
  //restart the server
  try {
    await connectWPP();
    return res.status(200).send("Server restarted");
  } catch (error) {
    res.status(500).send("Error restarting server");
  }
  return;
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
