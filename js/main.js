document.getElementById('carrito-icono').addEventListener('mouseover', function() {
    document.getElementById('carrito-lista').style.display = 'block';
});

document.getElementById('carrito-icono').addEventListener('click', function() {
    document.getElementById('carrito-lista').style.display = 'none';
});

let articulosCarrito = [];

const listaProductos = document.querySelector("#lista-productos");
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const numeroArticulosCarrito = document.createElement('span');
numeroArticulosCarrito.id = 'numero-articulos-carrito';
document.querySelector('.fa-cart-shopping').appendChild(numeroArticulosCarrito);

document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    dibujarCarritoHTML();
});

listaProductos.addEventListener('click', agregarProducto);
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
contenedorCarrito.addEventListener('change', actualizarCantidad);
contenedorCarrito.addEventListener('click', eliminarProducto);

function agregarProducto(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = evt.target.parentElement.parentElement;
        const producto = {
            id: productoSeleccionado.querySelector('a').getAttribute('data-id'),
            titulo: productoSeleccionado.querySelector('h2').textContent,
            precio: productoSeleccionado.querySelector('.precio').textContent,
            imagen: productoSeleccionado.querySelector('img').src,
            cantidad: parseInt(productoSeleccionado.querySelector('.cantidad-producto').value)
        };
        const existe = articulosCarrito.some(item => item.id === producto.id);
        if (existe) {
            articulosCarrito = articulosCarrito.map(item => {
                if (item.id === producto.id) {
                    item.cantidad += producto.cantidad;
                }
                return item;
            });
        } else {
            articulosCarrito = [...articulosCarrito, producto];
        }
        dibujarCarritoHTML();
        actualizarNumeroArticulos();
        sincronizarStorage();
    }
}

function dibujarCarritoHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    articulosCarrito.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${producto.imagen}" width="100" /></td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td><input class="cantidad-producto" type="number" value="${producto.cantidad}" min="1"></td>
            <td><a href='#' class="borrar-producto" data-id="${producto.id}">🗑</a></td>
        `;
        contenedorCarrito.appendChild(fila);
    });
}

function vaciarCarrito() {
    articulosCarrito = [];
    dibujarCarritoHTML();
    actualizarNumeroArticulos();
    sincronizarStorage();
}

function actualizarCantidad(evt) {
    if (evt.target.classList.contains('cantidad-producto')) {
        const idProducto = evt.target.parentElement.parentElement.querySelector('.borrar-producto').getAttribute('data-id');
        const nuevaCantidad = parseInt(evt.target.value);
        articulosCarrito = articulosCarrito.map(item => {
            if (item.id === idProducto) {
                item.cantidad = nuevaCantidad;
            }
            return item;
        });
        dibujarCarritoHTML();
        actualizarNumeroArticulos();
        sincronizarStorage();
    }
}

function eliminarProducto(evt) {
    if (evt.target.classList.contains('borrar-producto')) {
        const productoId = evt.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
        dibujarCarritoHTML();
        actualizarNumeroArticulos();
        sincronizarStorage();
    }
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function actualizarNumeroArticulos() {
    const cantidadTotal = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    numeroArticulosCarrito.textContent = cantidadTotal.toString();
}
