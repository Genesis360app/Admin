// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/server', // Define the path to proxy (adjust as needed)
    createProxyMiddleware({
      target: 'https://getintellisoft.com', // Replace with the base URL of the remote server
      changeOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    })
  );
};
