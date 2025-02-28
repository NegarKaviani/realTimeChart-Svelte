const express = require("express");
const Websocket = require("ws");
const app = express();


const wss = new Websocket.Server({ noServer: true })

app.get("/", (req, res) => {
    res.send("Welcome to my server! ");
  });

wss.on('connection', (ws) => {
    console.log('Client Connected!');

    ws.on('message', (message) => {
        // console.log(message)

        try {
            const data = JSON.parse(message);
            if (data.temp && data.now) {
                console.log(`Exceeded Temperature: ${data.temp}°C at ${data.now}`)
            }
        } catch (error) {
            console.log('Error parsing message from client:', error)
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId); // Stop sending data if the client disconnects
    });
})

app.server = app.listen(3001, () => {
    console.log('backend is running on http://localhost:3001')
})

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

