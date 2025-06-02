const path = require("path");

module.exports = {
  entry: "./src/index.ts",  
  output: {
    module: true,
    filename: "bundle.js", 
    path: path.resolve(__dirname, "dist")
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".js"],  
  },
  module: {
    rules: [
      {
        test: /\.ts$/,          
        use: "ts-loader",      
        exclude: /node_modules/
      },
      // {
      //   test: /\.worker\.ts$/, 
      //   use: { loader: 'worker-loader' }, 
      // },
    ]
  },
  mode: "production"        
  // mode: "development",        
};
