const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware dodający `.js`, jeśli plik istnieje
app.use((req, res, next) => {
  if (req.path.endsWith("/") || req.path.includes(".")) {
    return next();
  }
  
  const jsPath = path.join(__dirname, req.path + ".js");
  require("fs").access(jsPath, (err) => {
    if (!err) {
      req.url += ".js";
    }
    next();
  });
});

// Serwowanie plików statycznych
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
