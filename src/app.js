const basicAuth = require("express-basic-auth");
const express = require("express");
const app = express();
const fs = require("fs");
const connectWPP = require("./services/init-zap-service");

const configContent = fs.readFileSync("config.json");
const config = JSON.parse(configContent);

const basicAuthUsers = {};
basicAuthUsers[config.user] = config.password;

app.set("prefix", "/api");
app.use(express.json());
app.use(basicAuth({ users: basicAuthUsers }));

//routes
app.use("/", require("./routes/index"));
//rota para o whatsapp => /services/init-zap-service

app.listen(config.port, () => {
  console.log("romin-zap rodando na porta " + config.port + "!");
});

connectWPP(app);
