let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const listaProd = document.getElementById("listaProd");
const carritocompras = document.getElementById("carritocompras");
const botonCompra = document.getElementById("btnComprar");
const botonVaciar = document.getElementById("btnVaciar");
let productos = [];

const traerProductos = async () => {
  try {
    const productosJson = await fetch("./data/productos.json");
    const productosProcesados = await productosJson.json();
    productos = productosProcesados;
    mostrarProd();
  } catch (error) {
    listaProd.innerText = "ERROR 404 :( No se encontraron los productos";
  }
};

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

const mostrarProd = () => {
  listaProd.innerHTML = "";
  productos.forEach((prod) => {
    //const li = document.createElement("li");
    const div = document.createElement("div");

    //li.id = prod.id;
    div.innerHTML = `
    <div class="card" style="width: 18rem;">
      <img src="./img/${prod.id}.jpg" class="card-img-top" alt="${prod.nombre}" style="
    height: 190px;">
        <h5 class="card-title">${prod.nombre} - S/${prod.precio}</h5>
        <div  style="display:flex;justify-content: space-evenly;flex-wrap:wrap ;">
        <button id=btnAdd${prod.id} class="btn btn-outline-success">Añadir</button>
        <button id=btnRemove${prod.id} class="btn btn-outline-danger">Quitar</button>
        </div>
      </div>
    </div>`;

    //li.appendChild(div);
    listaProd.appendChild(div);

    const btnAdd = document.getElementById(`btnAdd${prod.id}`);

    btnAdd.innerText = "Añadir";
    btnAdd.className = "btn btn-outline-success";
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

    const btnRemove = document.getElementById(`btnRemove${prod.id}`);
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
  });
};

//logica para borrar carrito luego del check out
const comprar = () => {
  if (totalCarrito() > 0) {
    Swal.fire({
      title: "Success!",
      text: "¡Gracias por su compra!",
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Oops..!",
      text: "El carrito esta vacio. Agregue un producto antes de darle click a Finalizar Compra",
      icon: "error",
    });
  }
  vaciarCarrito();
};

botonCompra.onclick = comprar;
botonVaciar.addEventListener("click", () => {
  vaciarCarrito();
  if (totalCarrito() > 0) {
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
  } else {
    Toastify({
      text: "El carrito ya está vacio",
      position: "center",
      close: true,
      duration: 2000,
      style: {
        color: "#4b4141ff",
        background: "linear-gradient(to right, #f6d365, #fda085)",
      },
    }).showToast();
  }
});

function inicializar() {
  traerProductos();
  mostrarCarrito();
  mostrarTotal();
}

inicializar();
