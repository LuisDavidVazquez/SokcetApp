const express = require('express');
const cors = require('cors');
//Socket.io
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

let notificaciones = [];
let responsesClientes = [];

app.get('/notificaciones', (req, res) => {

    res.status(200).json({
        notificaciones
    });
})
app.get('/nueva-notificacion', (req, res) => {
    responsesClientes.push(res);
});
function responderClientes(notificacion) {
    for (res of responsesClientes) {
        res.status(200).json({
            success: true,
            notificacion 
        });
    }
    responsesClientes = [];
    notificaciones = []
}
app.post('/notificaciones', (req, res) => {
    const idNotificacion = notificaciones.length > 0 ? notificaciones[notificaciones.length - 1].id + 1 : 1;

    const notificacion = {
        id: idNotificacion,
        cuerpo: req.body.cuerpo,
        user : req.body.id_user
    };
    notificaciones.push(notificacion);
    // responder a los clientes
    responderClientes(notificacion)
    return res.status(201).json({
        success: true,
        message: "notificación guardada"
    });
});


//Socket.io
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    }
  });
  
  io.on('connection', socket => {
    console.log('Usuario conectado', socket.id);

    socket.on('message', (data) => {
      console.log(data);
      socket.broadcast.emit('message', data);
    });
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });


server.listen(3001, () => console.log("servidor corriendo en el puerto 3001"))