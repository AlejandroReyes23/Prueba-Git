const API_URL = "/pacientes";
const totalCamas = 30;

document.getElementById("totalCamasVista").textContent = totalCamas;

const areasHospital = {
  PISO: ["Medicina Interna", "Cirugía", "Trauma y Ortopedia", "Otro"],
  URGENCIAS: [
    "Estancia corta",
    "Sala de choques",
    "Hemodiálisis",
    "Módulo mater",
    "Observación menores",
    "Observación adultos",
    "Otro"
  ],
  GINECO: [
    "Ginecología y Obstetricia",
    "Pediatría",
    "UCIA",
    "UCIN",
    "UTIP",
    "Otro"
  ]
};

/* ===== DIETA ===== */
document.getElementById("dieta").addEventListener("change", function () {
  const otraDieta = document.getElementById("otraDieta");

  if (this.value === "Otro") {
    otraDieta.disabled = false;
    otraDieta.focus();
  } else {
    otraDieta.disabled = true;
    otraDieta.value = "";
  }
});

/* ===== MENU AREA ===== */
const menuArea = document.getElementById("menuArea");
const menuAreaBoton = document.getElementById("menuAreaBoton");
const subMenuArea = document.getElementById("subMenuArea");
const inputAreaPrincipal = document.getElementById("areaPrincipal");
const inputSubArea = document.getElementById("subArea");
const itemsArea = document.querySelectorAll(".menu-item");

menuAreaBoton.addEventListener("click", function () {
  menuArea.classList.toggle("abierto");
});

document.addEventListener("click", function (e) {
  if (!menuArea.contains(e.target)) {
    menuArea.classList.remove("abierto");
  }
});

itemsArea.forEach(function (item) {
  item.addEventListener("click", function () {
    const areaSeleccionada = this.getAttribute("data-area");

    inputAreaPrincipal.value = areaSeleccionada;
    inputSubArea.value = "";

    itemsArea.forEach(function (el) {
      el.classList.remove("activo");
    });

    this.classList.add("activo");
    cargarSubmenu(areaSeleccionada);
    menuAreaBoton.textContent = areaSeleccionada;
  });
});

function cargarSubmenu(areaSeleccionada) {
  const lista = areasHospital[areaSeleccionada] || [];
  subMenuArea.innerHTML = "";

  lista.forEach(function (sub) {
    const div = document.createElement("div");
    div.className = "submenu-item";
    div.textContent = sub;

    div.addEventListener("click", function () {
      document.querySelectorAll(".submenu-item").forEach(function (el) {
        el.classList.remove("activo");
      });

      div.classList.add("activo");
      inputSubArea.value = sub;
      menuAreaBoton.textContent = areaSeleccionada + " - " + sub;
      menuArea.classList.remove("abierto");
    });

    subMenuArea.appendChild(div);
  });
}

/* ===== UTILIDADES ===== */
function obtenerCama() {
  return parseInt(document.getElementById("cama").value, 10);
}

function mostrarMensaje(mensaje) {
  document.getElementById("resultado").textContent = mensaje;
}

function limpiarFormulario() {
  document.getElementById("cama").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("diagnostico").value = "";
  document.getElementById("fechaNacimiento").value = "";
  document.getElementById("fechaIngreso").value = "";
  document.getElementById("dieta").value = "";
  document.getElementById("otraDieta").value = "";
  document.getElementById("otraDieta").disabled = true;
  document.getElementById("sexo").value = "";
  document.getElementById("pendientes").value = "";

  inputAreaPrincipal.value = "";
  inputSubArea.value = "";
  menuAreaBoton.textContent = "Seleccione un área";
  subMenuArea.innerHTML = '<div class="submenu-placeholder">Seleccione un área principal</div>';

  itemsArea.forEach(function (el) {
    el.classList.remove("activo");
  });
}

function validarCama(camaBuscada) {
  if (isNaN(camaBuscada) || camaBuscada < 1 || camaBuscada > totalCamas) {
    mostrarMensaje("Número de cama inválido. Debe estar entre 1 y " + totalCamas + ".");
    return false;
  }
  return true;
}

function calcularEdad(fechaNac) {
  if (!fechaNac) return "";

  const hoy = new Date();
  const nacimiento = new Date(fechaNac + "T00:00:00");

  if (nacimiento > hoy) return "Fecha inválida";

  let anos = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();
  let dias = hoy.getDate() - nacimiento.getDate();

  if (dias < 0) {
    meses--;
    const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    dias += ultimoMes;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos <= 0 && meses <= 0) {
    const diferenciaDias = Math.floor((hoy - nacimiento) / (1000 * 60 * 60 * 24));
    return diferenciaDias + (diferenciaDias === 1 ? " día" : " días");
  }

  if (anos <= 0) {
    return meses + (meses === 1 ? " mes" : " meses");
  }

  return anos + (anos === 1 ? " año" : " años");
}

function calcularEstancia(fechaIng) {
  if (!fechaIng) return "";

  const hoy = new Date();
  const ingreso = new Date(fechaIng + "T00:00:00");

  if (ingreso > hoy) return "Fecha inválida";

  const diferenciaDias = Math.floor((hoy - ingreso) / (1000 * 60 * 60 * 24));
  const diasReales = diferenciaDias + 1;
  return diasReales + (diasReales === 1 ? " día" : " días");
}

function obtenerDietaFinal() {
  const dietaSeleccionada = document.getElementById("dieta").value;
  const otraDieta = document.getElementById("otraDieta").value.trim();

  if (dietaSeleccionada === "Otro") {
    return otraDieta;
  }

  return dietaSeleccionada;
}

function validarCamposBase() {
  const nombrePaciente = document.getElementById("nombre").value.trim();
  const diagnosticoPaciente = document.getElementById("diagnostico").value.trim();
  const fechaNac = document.getElementById("fechaNacimiento").value;
  const fechaIng = document.getElementById("fechaIngreso").value;
  const sexoPaciente = document.getElementById("sexo").value;
  const areaPrincipalPaciente = document.getElementById("areaPrincipal").value;
  const subAreaPaciente = document.getElementById("subArea").value;
  const dietaSeleccionada = document.getElementById("dieta").value;
  const otraDieta = document.getElementById("otraDieta").value.trim();

  if (nombrePaciente === "" || diagnosticoPaciente === "") {
    mostrarMensaje("Debes capturar al menos el nombre y el diagnóstico.");
    return false;
  }

  if (fechaNac === "") {
    mostrarMensaje("Debes capturar la fecha de nacimiento.");
    return false;
  }

  if (fechaIng === "") {
    mostrarMensaje("Debes capturar la fecha de ingreso.");
    return false;
  }

  if (calcularEdad(fechaNac) === "Fecha inválida") {
    mostrarMensaje("La fecha de nacimiento no es válida.");
    return false;
  }

  if (calcularEstancia(fechaIng) === "Fecha inválida") {
    mostrarMensaje("La fecha de ingreso no es válida.");
    return false;
  }

  if (sexoPaciente === "") {
    mostrarMensaje("Debes seleccionar el sexo.");
    return false;
  }

  if (areaPrincipalPaciente === "") {
    mostrarMensaje("Debes seleccionar el área principal.");
    return false;
  }

  if (subAreaPaciente === "") {
    mostrarMensaje("Debes seleccionar la subárea.");
    return false;
  }

  if (dietaSeleccionada === "") {
    mostrarMensaje("Debes seleccionar la dieta.");
    return false;
  }

  if (dietaSeleccionada === "Otro" && otraDieta === "") {
    mostrarMensaje("Debes especificar la dieta cuando seleccionas 'Otro'.");
    return false;
  }

  return true;
}

/* ===== CRUD ===== */
async function registrarPaciente() {
  const camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;
  if (!validarCamposBase()) return;

  const paciente = {
    cama: camaBuscada,
    nombre: document.getElementById("nombre").value.trim(),
    diagnostico: document.getElementById("diagnostico").value.trim(),
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    fechaIngreso: document.getElementById("fechaIngreso").value,
    edad: calcularEdad(document.getElementById("fechaNacimiento").value),
    estancia: calcularEstancia(document.getElementById("fechaIngreso").value),
    dieta: obtenerDietaFinal(),
    sexo: document.getElementById("sexo").value,
    areaPrincipal: document.getElementById("areaPrincipal").value,
    subArea: document.getElementById("subArea").value,
    area: document.getElementById("areaPrincipal").value + " - " + document.getElementById("subArea").value,
    pendientes: document.getElementById("pendientes").value.trim(),
    ocupado: 1
  };

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paciente)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.error || "No se pudo registrar el paciente.");
      return;
    }

    mostrarMensaje(
      "Paciente registrado correctamente en la cama " + camaBuscada + ".\n\n" +
      "Edad calculada: " + paciente.edad + "\n" +
      "Días de estancia: " + paciente.estancia
    );

    await mostrarPacientes();
    limpiarFormulario();
    document.getElementById("cama").focus();

  } catch (error) {
    console.error("Error al registrar:", error);
    mostrarMensaje("Error al conectar con el servidor.");
  }
}

async function mostrarPacientes() {
  try {
    const respuesta = await fetch(API_URL);
    const pacientes = await respuesta.json();

    let tabla = "";
    let camasOcupadas = 0;

    pacientes.forEach(function (p) {
      camasOcupadas++;
      tabla += `
        <tr>
          <td>${p.cama ?? ""}</td>
          <td>${p.nombre ?? ""}</td>
          <td>${p.diagnostico ?? ""}</td>
          <td>${p.edad ?? ""}</td>
          <td>${p.estancia ?? ""}</td>
          <td>${p.dieta ?? ""}</td>
          <td>${p.sexo ?? ""}</td>
          <td>${p.areaPrincipal ?? ""}</td>
          <td>${p.subArea ?? ""}</td>
          <td>${p.pendientes || "-"}</td>
          <td class="estado-ocupada">Ocupada</td>
        </tr>
      `;
    });

    if (pacientes.length > 0) {
      document.getElementById("tablaPacientes").innerHTML = tabla;
    } else {
      document.getElementById("tablaPacientes").innerHTML = `
        <tr>
          <td colspan="11" class="sin-datos">No hay pacientes registrados.</td>
        </tr>
      `;
    }

    document.getElementById("ocupadas").textContent = camasOcupadas;
    document.getElementById("disponibles").textContent = totalCamas - camasOcupadas;

  } catch (error) {
    console.error("Error al mostrar pacientes:", error);
    mostrarMensaje("Error al obtener pacientes desde MongoDB.");
  }
}

async function buscarPaciente() {
  const camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;

  try {
    const respuesta = await fetch(API_URL + "/" + camaBuscada);

    if (respuesta.status === 404) {
      mostrarMensaje("La cama " + camaBuscada + " está libre.");
      return;
    }

    const p = await respuesta.json();

    document.getElementById("nombre").value = p.nombre || "";
    document.getElementById("diagnostico").value = p.diagnostico || "";
    document.getElementById("fechaNacimiento").value = p.fechaNacimiento || "";
    document.getElementById("fechaIngreso").value = p.fechaIngreso || "";

    const dietaGuardada = p.dieta || "";
    if (dietaGuardada === "Blanda" || dietaGuardada === "Líquida" || dietaGuardada === "Normal") {
      document.getElementById("dieta").value = dietaGuardada;
      document.getElementById("otraDieta").value = "";
      document.getElementById("otraDieta").disabled = true;
    } else if (dietaGuardada !== "") {
      document.getElementById("dieta").value = "Otro";
      document.getElementById("otraDieta").disabled = false;
      document.getElementById("otraDieta").value = dietaGuardada;
    } else {
      document.getElementById("dieta").value = "";
      document.getElementById("otraDieta").value = "";
      document.getElementById("otraDieta").disabled = true;
    }

    document.getElementById("sexo").value = p.sexo || "";
    document.getElementById("pendientes").value = p.pendientes || "";

    inputAreaPrincipal.value = p.areaPrincipal || "";
    inputSubArea.value = p.subArea || "";

    itemsArea.forEach(function (el) {
      el.classList.remove("activo");
      if (el.getAttribute("data-area") === p.areaPrincipal) {
        el.classList.add("activo");
      }
    });

    if (p.areaPrincipal) {
      cargarSubmenu(p.areaPrincipal);

      setTimeout(function () {
        document.querySelectorAll(".submenu-item").forEach(function (el) {
          el.classList.remove("activo");
          if (el.textContent === p.subArea) {
            el.classList.add("activo");
          }
        });
      }, 0);
    } else {
      subMenuArea.innerHTML = '<div class="submenu-placeholder">Seleccione un área principal</div>';
    }

    menuAreaBoton.textContent = (p.areaPrincipal && p.subArea)
      ? p.areaPrincipal + " - " + p.subArea
      : "Seleccione un área";

    mostrarMensaje(
      "Paciente encontrado\n\n" +
      "Cama: " + (p.cama || "") + "\n" +
      "Nombre: " + (p.nombre || "") + "\n" +
      "Diagnóstico: " + (p.diagnostico || "") + "\n" +
      "Edad: " + (p.edad || "") + "\n" +
      "Fecha de nacimiento: " + (p.fechaNacimiento || "") + "\n" +
      "Fecha de ingreso: " + (p.fechaIngreso || "") + "\n" +
      "Días de estancia: " + (p.estancia || "") + "\n" +
      "Dieta: " + (p.dieta || "") + "\n" +
      "Sexo: " + (p.sexo || "") + "\n" +
      "Área: " + (p.area || "") + "\n" +
      "Pendientes: " + (p.pendientes || "-")
    );

  } catch (error) {
    console.error("Error al buscar paciente:", error);
    mostrarMensaje("Error al buscar el paciente.");
  }
}

async function modificarPaciente() {
  const camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;
  if (!validarCamposBase()) return;

  const pacienteActualizado = {
    cama: camaBuscada,
    nombre: document.getElementById("nombre").value.trim(),
    diagnostico: document.getElementById("diagnostico").value.trim(),
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    fechaIngreso: document.getElementById("fechaIngreso").value,
    edad: calcularEdad(document.getElementById("fechaNacimiento").value),
    estancia: calcularEstancia(document.getElementById("fechaIngreso").value),
    dieta: obtenerDietaFinal(),
    sexo: document.getElementById("sexo").value,
    areaPrincipal: document.getElementById("areaPrincipal").value,
    subArea: document.getElementById("subArea").value,
    area: document.getElementById("areaPrincipal").value + " - " + document.getElementById("subArea").value,
    pendientes: document.getElementById("pendientes").value.trim(),
    ocupado: 1
  };

  try {
    const respuesta = await fetch(API_URL + "/" + camaBuscada, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pacienteActualizado)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.error || "No se pudo actualizar el paciente.");
      return;
    }

    mostrarMensaje(
      "Los datos del paciente en la cama " + camaBuscada + " fueron actualizados.\n\n" +
      "Edad actual: " + pacienteActualizado.edad + "\n" +
      "Días de estancia: " + pacienteActualizado.estancia
    );

    await mostrarPacientes();

  } catch (error) {
    console.error("Error al modificar:", error);
    mostrarMensaje("Error al conectar con el servidor.");
  }
}

async function darAlta() {
  const camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;

  try {
    const respuesta = await fetch(API_URL + "/" + camaBuscada, {
      method: "DELETE"
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.error || "No se pudo dar de alta.");
      return;
    }

    mostrarMensaje("Paciente dado de alta correctamente de la cama " + camaBuscada + ".");
    await mostrarPacientes();
    limpiarFormulario();

  } catch (error) {
    console.error("Error al dar de alta:", error);
    mostrarMensaje("Error al conectar con el servidor.");
  }
}

async function verCamasDisponibles() {
  try {
    const respuesta = await fetch(API_URL);
    const pacientes = await respuesta.json();

    const camasOcupadas = pacientes.map(p => Number(p.cama));
    let texto = "Camas disponibles:\n\n";
    let hayDisponibles = false;

    for (let i = 1; i <= totalCamas; i++) {
      if (!camasOcupadas.includes(i)) {
        texto += "- Cama " + i + "\n";
        hayDisponibles = true;
      }
    }

    if (hayDisponibles) {
      mostrarMensaje(texto);
    } else {
      mostrarMensaje("No hay camas disponibles en este momento.");
    }
  } catch (error) {
    console.error("Error al ver camas disponibles:", error);
    mostrarMensaje("Error al consultar camas disponibles.");
  }
}

window.onload = function () {
  mostrarPacientes();
};