const productos = [
  { nombre: "Almendras deshidratadas 130g", precio: 7, id: 101 },
  { nombre: "Cashews activados 130g", precio: 7, id: 102 },
  { nombre: "Castañas activadas 130g", precio: 8, id: 103 },
  { nombre: "Pecanas activadas 100g", precio: 7, id: 104 },
  { nombre: "Pistachos activads 100g", precio: 10, id: 105 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const listaProd = document.getElementById("listaProd");
const carritocompras = document.getElementById("carritocompras");
const botonCompra = document.getElementById("btnComprar");
const botonVaciar = document.getElementById("btnVaciar");

const totalCarrito = () => {
  let total = carrito.reduce((suma, elemento) => {
    return suma + elemento.precio * elemento.cantidad;
  }, 0);
  return total;
};

const mostrarTotal = () => {
  const divTotal = document.getElementById("total");
  divTotal.innerText = `Total Compra: S/${totalCarrito()}`;
};

const guardarCarrito = () => {
  const carritoJSON = JSON.stringify(carrito);
  localStorage.setItem("carrito", carritoJSON);
};

const mostrarCarrito = () => {
  if (carrito.length === 0) {
    carritocompras.innerHTML = "El carrito está vacio";
  } else {
    carritocompras.innerHTML = "";
    carrito.forEach((prod) => {
      const li = document.createElement("li");
      let totalproducto = prod.cantidad * prod.precio;
      li.innerText = `${prod.nombre} x ${prod.cantidad}und = S/${totalproducto}`;
      carritocompras.appendChild(li);
    });
  }
};

const vaciarCarrito = () => {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  mostrarTotal();
};

const agregarCarrito = (prod) => {
  // Ver si el producto ya está en el carrito
  const productoExistente = carrito.find((item) => item.id === prod.id);

  if (productoExistente) {
    // Si el producto existe, solo aumentamos la cantidad
    productoExistente.cantidad += 1;
  } else {
    // Si no existe, agregamos el producto al carrito con una cantidad de 1
    carrito.push({ ...prod, cantidad: 1 });
  }
  mostrarCarrito();
  mostrarTotal();
  guardarCarrito();
};

const retirarCarrito = (prod) => {
  // Ver si el producto ya está en el carrito
  const productoExistente = carrito.find((item) => item.id === prod.id);

  if (productoExistente) {
    // Si el producto existe y su cantidad es mayor a 1, restamos 1
    if (productoExistente.cantidad > 1) {
      productoExistente.cantidad -= 1;
    } else {
      // Si la cantidad llega a 1, lo eliminamos del carrito
      carrito = carrito.filter((item) => item.id !== prod.id);
    }
  }
  mostrarCarrito();
  mostrarTotal();
  guardarCarrito();
};

function mostrarProd() {
  listaProd.innerHTML = "";
  productos.forEach((prod) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const btnAdd = document.createElement("button");
    const btnRemove = document.createElement("button");

    li.id = prod.id;
    div.innerText = `${prod.nombre} - S/${prod.precio}`;
    btnAdd.innerText = "Añadir";
    btnAdd.addEventListener("click", () => {
      agregarCarrito(prod);
      Toastify({
        text: `Se agregaron ${prod.nombre} al carrito`,
        position: "center",
        close: true,
        duration: 1500,
        style: {
          background: "linear-gradient(to right, #34e89e, #0f9b8e)",
        },
      }).showToast();
    });

    btnRemove.innerText = "Quitar";
    btnRemove.addEventListener("click", () => {
      const productoExistente = carrito.find((item) => item.id === prod.id);
      if (!productoExistente) {
        Toastify({
        text: `No tienes ${prod.nombre} en el carrito`,
        position: "center",
        close: true,
        duration: 2500,
        style: {
          background: "linear-gradient(to right, #ff4b5c, #ff9a8b)",
        },
      }).showToast();
        
      } else {
        retirarCarrito(prod);
       Toastify({
        text: `Se retiraron ${prod.nombre} del carrito`,
        position: "center",
        close: true,
        duration: 2500,
        style: {
          background: "linear-gradient(to right, #ff4b5c, #ff9a8b)",
        },
      }).showToast();
      }
    });

    li.appendChild(div);
    li.appendChild(btnAdd);
    li.appendChild(btnRemove);
    listaProd.appendChild(li);
  });
}

//logica para borrar carrito luego del check out
const comprar = () => {
  if (totalCarrito() > 0) {
    Toastify({
      text: "Gracias por su compra",
      position: "center",
      duration: 3000,
      backgroundColor: "green",
    }).showToast();

  } else {
    Toastify({
        text: "El carrito esta vacio. Agregue un producto antes de darle click a Finalizar Compra",
        position: "center",
        close: true,
        duration: 3000,
        style: {
          color: "#4b4141ff",
          background: "linear-gradient(to right, #f6d365, #fda085)",
        },
      }).showToast();
      
  }
  vaciarCarrito();
};

botonCompra.onclick = comprar;
botonVaciar.addEventListener("click", () => {
  vaciarCarrito();
  Toastify({
        text: "El carrito fue vaciado satisfactoriamente",
        position: "center",
        close: true,
        duration: 2000,
        style: {
          color: "#4b4141ff",
          background: "linear-gradient(to right, #f6d365, #fda085)",
        },
      }).showToast();
})

function inicializar() {
  mostrarProd();
  mostrarCarrito();
  mostrarTotal();
}

inicializar();
