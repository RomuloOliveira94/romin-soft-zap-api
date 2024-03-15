declare namespace Express {
  export interface Request {
    app?: Express;
    client?: wppconnect.Whatsapp;
  }
}
