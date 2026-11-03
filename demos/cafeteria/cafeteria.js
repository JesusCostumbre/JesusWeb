"use strict";

// Cambia por el WhatsApp real (código de país + número, sin + ni espacios).
const WHATSAPP = "529515881087";
const HORARIO = { abre: 7, cierra: 20.5 }; // todos los días, 7:00 a 20:30

const MENU = {
  cafe: {
    titulo: "Café y bebidas",
    items: [
      { id: "espresso", nombre: "Espresso doble", precio: 45, desc: "Grano de altura con notas a chocolate y nuez." },
      { id: "flat", nombre: "Flat White", precio: 62, desc: "Doble ristretto y leche texturizada de forma sedosa.", etiqueta: "Más pedido" },
      { id: "tonic", nombre: "Cold Brew Tonic", precio: 75, desc: "Infusión en frío por 18 horas, agua tónica y cáscara de naranja." },
      { id: "matcha", nombre: "Matcha Latte", precio: 78, desc: "Matcha ceremonial con leche de avena.", etiqueta: "Vegano" },
    ],
  },
  brunch: {
    titulo: "Desayunos y brunch",
    items: [
      { id: "avocado", nombre: "Avocado Toast", precio: 135, desc: "Pan de masa madre, aguacate, huevo pochado y hojuelas de chile.", etiqueta: "Más pedido" },
      { id: "grilled", nombre: "Grilled Cheese", precio: 115, desc: "Tres quesos y cebolla caramelizada en pan brioche." },
      { id: "bowl", nombre: "Bowl de granola", precio: 98, desc: "Yogur de coco, frutos rojos y granola de la casa.", etiqueta: "Vegano" },
    ],
  },
  pan: {
    titulo: "Panadería y repostería",
    items: [
      { id: "croissant", nombre: "Croissant de almendras", precio: 68, desc: "Mantequilla francesa y crema de almendra, horneado cada mañana." },
      { id: "galleta", nombre: "Galleta con sal marina", precio: 42, desc: "Chocolate 70% y sal en escamas." },
      { id: "banana", nombre: "Banana bread", precio: 55, desc: "Plátano maduro y nuez, sin lácteos ni huevo.", etiqueta: "Vegano" },
    ],
  },
};
const COMBO = { id: "combo", nombre: "Combo Brunch Express (Flat White + Avocado Toast)", precio: 185 };

const $ = (s) => document.querySelector(s);
const pesos = (n) => "$" + n;
const pedido = new Map(); // id -> { nombre, precio, cant }
let categoriaActiva = "cafe";
let ultimoFoco = null;

/* ---------- Estado abierto / cerrado ---------- */
function actualizarEstado() {
  const d = new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  const el = $("#estado");
  el.textContent = h >= HORARIO.abre && h < HORARIO.cierra
    ? "Abierto ahora hasta las 20:30"
    : "Cerrado ahora · abrimos a las 7:00";
}

/* ---------- Menú y pestañas ---------- */
function dibujarTabs() {
  const tabs = $("#tabs");
  tabs.textContent = "";
  Object.entries(MENU).forEach(([clave, cat]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tab";
    b.setAttribute("role", "tab");
    b.id = "tab-" + clave;
    b.dataset.cat = clave;
    b.textContent = cat.titulo;
    b.setAttribute("aria-selected", String(clave === categoriaActiva));
    b.setAttribute("aria-controls", "panel");
    b.tabIndex = clave === categoriaActiva ? 0 : -1;
    tabs.append(b);
  });
}

function dibujarPanel() {
  const panel = $("#panel");
  panel.setAttribute("aria-labelledby", "tab-" + categoriaActiva);
  panel.innerHTML = MENU[categoriaActiva].items.map((p) => `
    <article class="card producto">
      ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
      <div class="fila"><h3 class="font-display text-xl font-semibold">${p.nombre}</h3><span class="puntos"></span><span class="font-bold">${pesos(p.precio)}</span></div>
      <p class="text-ink/75 text-sm">${p.desc}</p>
      <button type="button" class="btn-add" data-id="${p.id}" aria-label="Agregar ${p.nombre} al pedido">Agregar</button>
    </article>`).join("");
}

function seleccionarCategoria(clave, enfocar) {
  categoriaActiva = clave;
  dibujarTabs();
  dibujarPanel();
  if (enfocar) $("#tab-" + clave).focus();
}

function teclasTabs(e) {
  const claves = Object.keys(MENU);
  let i = claves.indexOf(categoriaActiva);
  if (e.key === "ArrowRight") i = (i + 1) % claves.length;
  else if (e.key === "ArrowLeft") i = (i - 1 + claves.length) % claves.length;
  else if (e.key === "Home") i = 0;
  else if (e.key === "End") i = claves.length - 1;
  else return;
  e.preventDefault();
  seleccionarCategoria(claves[i], true);
}

/* ---------- Pedido ---------- */
function buscarProducto(id) {
  if (id === COMBO.id) return COMBO;
  for (const cat of Object.values(MENU)) {
    const p = cat.items.find((x) => x.id === id);
    if (p) return p;
  }
}

function cambiar(id, delta) {
  const p = buscarProducto(id);
  if (!p) return;
  const actual = pedido.get(id);
  const cant = (actual ? actual.cant : 0) + delta;
  if (cant <= 0) pedido.delete(id);
  else pedido.set(id, { nombre: p.nombre, precio: p.precio, cant });
  dibujarPedido(delta > 0);
}

function totales() {
  let n = 0, total = 0;
  pedido.forEach((x) => { n += x.cant; total += x.cant * x.precio; });
  return { n, total };
}

function dibujarPedido(rebote) {
  const { n, total } = totales();
  const contador = $("#contador");
  contador.textContent = n;
  if (rebote) { contador.classList.remove("bump"); void contador.offsetWidth; contador.classList.add("bump"); }
  $("#total").textContent = pesos(total);
  $("#vacio").hidden = n > 0;
  $("#enviar").disabled = n === 0;

  const lista = $("#lista-pedido");
  lista.textContent = "";
  pedido.forEach((x, id) => {
    const li = document.createElement("li");
    li.className = "linea";
    const nombre = document.createElement("span");
    nombre.className = "text-sm";
    nombre.textContent = x.nombre + " · " + pesos(x.precio * x.cant);
    const cant = document.createElement("span");
    cant.className = "cant";
    const menos = document.createElement("button");
    menos.type = "button"; menos.textContent = "−"; menos.dataset.id = id; menos.dataset.delta = "-1";
    menos.setAttribute("aria-label", "Quitar uno de " + x.nombre);
    const num = document.createElement("span");
    num.textContent = x.cant;
    const mas = document.createElement("button");
    mas.type = "button"; mas.textContent = "+"; mas.dataset.id = id; mas.dataset.delta = "1";
    mas.setAttribute("aria-label", "Agregar uno de " + x.nombre);
    cant.append(menos, num, mas);
    li.append(nombre, cant);
    lista.append(li);
  });
}

/* ---------- Carrito (panel lateral) ---------- */
function abrirCarrito() {
  ultimoFoco = document.activeElement;
  $("#carrito").hidden = false;
  $("#abrir-carrito").setAttribute("aria-expanded", "true");
  $("#overlay").hidden = false;
  document.body.classList.add("bloqueado");
  $("#cerrar-carrito").focus();
}

function cerrarCarrito() {
  $("#carrito").hidden = true;
  $("#abrir-carrito").setAttribute("aria-expanded", "false");
  $("#overlay").hidden = true;
  document.body.classList.remove("bloqueado");
  if (ultimoFoco) ultimoFoco.focus();
}

function mantenerFoco(e) {
  if (e.key === "Escape") return cerrarCarrito();
  if (e.key !== "Tab") return;
  const foco = [...$("#carrito").querySelectorAll("button, input, a[href]")].filter((el) => !el.disabled && !el.closest("[hidden]"));
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- Envío a WhatsApp ---------- */
function enviarPedido(e) {
  e.preventDefault();
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const nombre = $("#nombre").value.trim();
  const mesa = $("#mesa").value.trim();
  const error = $("#error");

  if (!nombre) { error.textContent = "Escribe tu nombre para avisarte cuando esté listo."; return $("#nombre").focus(); }
  if (tipo === "En mesa" && !mesa) { error.textContent = "Indica tu número de mesa."; return $("#mesa").focus(); }
  error.textContent = "";

  const lineas = [];
  pedido.forEach((x) => lineas.push("• " + x.cant + " x " + x.nombre));
  const texto = [
    "Hola, soy " + nombre + ". Quiero hacer un pedido en Moka & Grano:",
    "",
    ...lineas,
    "",
    "Tipo: " + tipo + (tipo === "En mesa" ? " (mesa " + mesa + ")" : ""),
    "Total: " + pesos(totales().total),
  ].join("\n");

  const enlace = document.createElement("a");
  enlace.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
  enlace.target = "_blank";
  enlace.rel = "noopener";
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
}

/* ---------- Eventos ---------- */
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) return seleccionarCategoria(tab.dataset.cat, false);
  const add = e.target.closest(".btn-add");
  if (add) return cambiar(add.dataset.id, 1);
  const ctrl = e.target.closest("#lista-pedido button");
  if (ctrl) return cambiar(ctrl.dataset.id, Number(ctrl.dataset.delta));
});

$("#tabs").addEventListener("keydown", teclasTabs);
$("#add-combo").addEventListener("click", () => { cambiar(COMBO.id, 1); abrirCarrito(); });
$("#abrir-carrito").addEventListener("click", abrirCarrito);
$("#cerrar-carrito").addEventListener("click", cerrarCarrito);
$("#overlay").addEventListener("click", cerrarCarrito);
$("#carrito").addEventListener("keydown", mantenerFoco);
$("#form-pedido").addEventListener("submit", enviarPedido);
$("#form-pedido").addEventListener("change", (e) => {
  if (e.target.name === "tipo") $("#lbl-mesa").hidden = e.target.value !== "En mesa";
});
$("#cta-ordenar").addEventListener("click", (e) => {
  if (pedido.size > 0) { e.preventDefault(); abrirCarrito(); }
});

/* ---------- Inicio ---------- */
actualizarEstado();
setInterval(actualizarEstado, 60000);
seleccionarCategoria(categoriaActiva, false);
dibujarPedido(false);