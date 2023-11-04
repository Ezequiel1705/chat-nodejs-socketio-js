const socket = io.connect();

// Función para cargar los productos en el div
function cargarProductos(productos) {
    const divProductos = document.getElementById("productos");
    divProductos.innerHTML = ""; // Limpia el contenido actual

    productos.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");

        const titulo = document.createElement("h3");
        titulo.textContent = producto.title;

        const precio = document.createElement("p");
        precio.textContent = `Precio: $${producto.price}`;

        const imagen = document.createElement("img");
        imagen.src = producto.thumbnail;
        imagen.alt = producto.title;
        imagen.classList.add("imagen-producto");

        productoDiv.appendChild(titulo);
        productoDiv.appendChild(precio);
        productoDiv.appendChild(imagen);

        divProductos.appendChild(productoDiv);
    });
}

function addProducts (e) {
    const producto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };

    socket.emit('new-products', producto);

    // Limpiar los campos del formulario

    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
    return false;

    
}

socket.on('products', productos => {
    cargarProductos(productos);
});

// Llama a la función para cargar los productos al cargar la página
//window.addEventListener("DOMContentLoaded", cargarProductos);


//mensajes
function render(data) {
    const html = data.map(elem => {
        return (`<div><strong>${elem.author}</strong>:<em>${elem.text}</em></div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('author').value,
        text: document.getElementById('text').value
    };

    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', data => {
    render(data);
});