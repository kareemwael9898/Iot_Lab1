const express = require('express');
const bodyParser = require('body-parser');
const instance = express();
const port = 4401;

let storedData = [];

instance.use(bodyParser.urlencoded({ extended: true }));

const server = instance.listen(port, () => {
  console.log('Server started on port', port);
});

instance.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

instance.post('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
  let formData = req.body;

  storedData.push(formData);

  // WebSocket send data to clients
  clients(formData);

  console.log(formData);
});

const ws = require("ws").Server;
const websocket = new ws({ server });

websocket.on("connection", function (wss) {
  console.log("Connection success");

  wss.send(JSON.stringify(storedData));

  wss.on("message", function (msg) {
    console.log("server message: ", msg.toString());

    if (msg.toString() == "clear") {
      storedData = [];
    }

    clients(storedData);
  });
});

function clients(data) {
  websocket.clients.forEach(element => {
    if (element.readyState === element.OPEN) {
      element.send(JSON.stringify(data));

    } else {
      console.log("item disconnected");
    }
  });

}