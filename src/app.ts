import basicAuth from "express-basic-auth";
import index from "./routes/index";
import express from "express";
import fs from "fs";
import { connectWPP } from "./services/init-zap-service";

const app = express();
const configContent = fs.readFileSync("config.json").toString(); // Convert buffer to string
const config = JSON.parse(configContent);
connectWPP(app);

const basicAuthUsers: Record<string, string> = {}; // Explicitly define the type of basicAuthUsers
basicAuthUsers[config.user] = config.password;

// midleware to reinit if the usar not read the qr code
app.use((req, _res, next) => {
  req.app = app;
  next();
});

app.use(express.json());
app.use(basicAuth({ users: basicAuthUsers }));
app.use("/", index);
// rota para o whatsapp => /services/init-zap-service

app.listen(config.port, () => {
  console.log("romin-zap rodando na porta " + config.port + "!");
});
