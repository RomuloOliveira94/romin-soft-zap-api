const wppconnect = require("@wppconnect-team/wppconnect");
const zapRoutes = require("../routes/zap");

function connectWPP(app) {
  //Inicia o bot
  wppconnect
    .create({
      session: "sessionName",
      catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR);
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
    .then((client) => start(app, client))
    .catch((error) => console.log(error));
}

//Inicia o cliente
function start(app, client) {
  client.onMessage((message) => {
    if (message.body === "ola") {
      client
        .sendText(message.from, "Hello, how I may help you?")
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  });

  //envia o cliente para todas as zap routes
  app.use(
    "/zap",
    (req, _res, next) => {
      req.client = client;
      next();
    },
    zapRoutes
  );
}
module.exports = connectWPP;
