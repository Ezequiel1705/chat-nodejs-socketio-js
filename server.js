import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const messages = [];
const productos = [];


/* Rutas */
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname})

})

app.post('/form-productos', (req, res) => {
    const { title,  price, thumbnail} = req.body;

    //agregar el nuevo producto al array
    productos.push({
        title,
        price: parseFloat(price),
        thumbnail
    });
    
    res.redirect('/')
});

/* Conexion de Sockets */

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    //Este evento carga el historial de mensajes cuando un nuevo cliente se conecta
    socket.emit('messages', messages);
    socket.emit('products', productos);

    //messages
    socket.on('new-message', (data) => {
        messages.push(data);
    
        io.sockets.emit('messages', messages); //Este evento envía un nuevo mensaje a todos los clientes que estén conectado en ese momento
    });

    //products
    socket.on('new-products', (producto) => {
        productos.push(producto);
        io.sockets.emit('productos', productos)
    })
});


/* Running Server */

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Server in port ${PORT}`)
});
server.on('error', err => console.log(err));