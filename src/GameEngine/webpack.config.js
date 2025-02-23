const path = require("path");

module.exports = {
  entry: "./src/index.ts",  // Punkt wejściowy
  output: {
    filename: "bundle.js",   // Plik wynikowy
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"],  // Obsługiwane rozszerzenia
  },
  module: {
    rules: [
      {
        test: /\.ts$/,          // Każdy plik .ts
        use: "ts-loader",       // Konwertuje na JS
        exclude: /node_modules/
      }
    ]
  },
  mode: "development"         // Może być "production" (minifikacja)
};
