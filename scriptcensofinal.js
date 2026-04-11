var totalCamas = 30;

var nombre = [];
var diagnostico = [];
var edad = [];
var fechaNacimiento = [];
var fechaIngreso = [];
var estancia = [];
var dieta = [];
var sexo = [];
var area = [];
var pendientes = [];
var ocupado = [];

var i;

for (i = 1; i <= totalCamas; i++) {
  nombre[i] = "";
  diagnostico[i] = "";
  edad[i] = "";
  fechaNacimiento[i] = "";
  fechaIngreso[i] = "";
  estancia[i] = "";
  dieta[i] = "";
  sexo[i] = "";
  area[i] = "";
  pendientes[i] = "";
  ocupado[i] = 0;
}

document.getElementById("totalCamasVista").textContent = totalCamas;
actualizarResumen();
mostrarPacientes();

document.getElementById("dieta").addEventListener("change", function () {
  var otraDieta = document.getElementById("otraDieta");

  if (this.value === "Otro") {
    otraDieta.disabled = false;
    otraDieta.focus();
  } else {
    otraDieta.disabled = true;
    otraDieta.value = "";
  }
});

function obtenerCama() {
  return parseInt(document.getElementById("cama").value);
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
  document.getElementById("area").value = "";
  document.getElementById("pendientes").value = "";
}

function actualizarResumen() {
  var camasOcupadas = 0;
  var camasDisponibles = 0;

  for (i = 1; i <= totalCamas; i++) {
    if (ocupado[i] == 1) {
      camasOcupadas++;
    } else {
      camasDisponibles++;
    }
  }

  document.getElementById("ocupadas").textContent = camasOcupadas;
  document.getElementById("disponibles").textContent = camasDisponibles;
}

function validarCama(camaBuscada) {
  if (isNaN(camaBuscada) || camaBuscada < 1 || camaBuscada > totalCamas) {
    mostrarMensaje("Número de cama inválido. Debe estar entre 1 y " + totalCamas + ".");
    return false;
  }
  return true;
}

function calcularEdad(fechaNac) {
  if (!fechaNac) {
    return "";
  }

  var hoy = new Date();
  var nacimiento = new Date(fechaNac + "T00:00:00");

  if (nacimiento > hoy) {
    return "Fecha inválida";
  }

  var anos = hoy.getFullYear() - nacimiento.getFullYear();
  var meses = hoy.getMonth() - nacimiento.getMonth();
  var dias = hoy.getDate() - nacimiento.getDate();

  if (dias < 0) {
    meses--;
    var ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    dias += ultimoMes;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos <= 0 && meses <= 0) {
    var diferenciaDias = Math.floor((hoy - nacimiento) / (1000 * 60 * 60 * 24));
    return diferenciaDias + (diferenciaDias === 1 ? " día" : " días");
  }

  if (anos <= 0) {
    return meses + (meses === 1 ? " mes" : " meses");
  }

  return anos + (anos === 1 ? " año" : " años");
}

function calcularEstancia(fechaIng) {
  if (!fechaIng) {
    return "";
  }

  var hoy = new Date();
  var ingreso = new Date(fechaIng + "T00:00:00");

  if (ingreso > hoy) {
    return "Fecha inválida";
  }

  var diferenciaDias = Math.floor((hoy - ingreso) / (1000 * 60 * 60 * 24));
  return diferenciaDias + (diferenciaDias === 1 ? " día" : " días");
}

function obtenerDietaFinal() {
  var dietaSeleccionada = document.getElementById("dieta").value;
  var otraDieta = document.getElementById("otraDieta").value.trim();

  if (dietaSeleccionada === "Otro") {
    return otraDieta;
  }

  return dietaSeleccionada;
}

function validarCamposBase() {
  var nombrePaciente = document.getElementById("nombre").value.trim();
  var diagnosticoPaciente = document.getElementById("diagnostico").value.trim();
  var fechaNac = document.getElementById("fechaNacimiento").value;
  var fechaIng = document.getElementById("fechaIngreso").value;
  var sexoPaciente = document.getElementById("sexo").value;
  var areaPaciente = document.getElementById("area").value;
  var dietaSeleccionada = document.getElementById("dieta").value;
  var otraDieta = document.getElementById("otraDieta").value.trim();

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

  if (areaPaciente === "") {
    mostrarMensaje("Debes seleccionar el área.");
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

function registrarPaciente() {
  var camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;
  if (ocupado[camaBuscada] == 1) {
    mostrarMensaje("La cama " + camaBuscada + " ya está ocupada.");
    return;
  }

  if (!validarCamposBase()) return;

  nombre[camaBuscada] = document.getElementById("nombre").value.trim();
  diagnostico[camaBuscada] = document.getElementById("diagnostico").value.trim();
  fechaNacimiento[camaBuscada] = document.getElementById("fechaNacimiento").value;
  fechaIngreso[camaBuscada] = document.getElementById("fechaIngreso").value;
  edad[camaBuscada] = calcularEdad(fechaNacimiento[camaBuscada]);
  estancia[camaBuscada] = calcularEstancia(fechaIngreso[camaBuscada]);
  dieta[camaBuscada] = obtenerDietaFinal();
  sexo[camaBuscada] = document.getElementById("sexo").value;
  area[camaBuscada] = document.getElementById("area").value;
  pendientes[camaBuscada] = document.getElementById("pendientes").value.trim();
  ocupado[camaBuscada] = 1;

  actualizarResumen();
  mostrarPacientes();

  mostrarMensaje(
    "Paciente registrado correctamente en la cama " + camaBuscada + ".\n\n" +
    "Edad calculada: " + edad[camaBuscada] + "\n" +
    "Días de estancia: " + estancia[camaBuscada]
  );

  limpiarFormulario();
  document.getElementById("cama").focus();
}

function mostrarPacientes() {
  var tabla = "";
  var hayPacientes = false;

  for (i = 1; i <= totalCamas; i++) {
    if (ocupado[i] == 1) {
      hayPacientes = true;
      tabla += `
        <tr>
          <td>${i}</td>
          <td>${nombre[i]}</td>
          <td>${diagnostico[i]}</td>
          <td>${edad[i]}</td>
          <td>${estancia[i]}</td>
          <td>${dieta[i]}</td>
          <td>${sexo[i]}</td>
          <td>${area[i]}</td>
          <td>${pendientes[i] || "-"}</td>
          <td class="estado-ocupada">Ocupada</td>
        </tr>
      `;
    }
  }

  if (hayPacientes) {
    document.getElementById("tablaPacientes").innerHTML = tabla;
  } else {
    document.getElementById("tablaPacientes").innerHTML = `
      <tr>
        <td colspan="10" class="sin-datos">No hay pacientes registrados.</td>
      </tr>
    `;
  }
}

function buscarPaciente() {
  var camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;

  if (ocupado[camaBuscada] == 1) {
    mostrarMensaje(
      "Paciente encontrado\n\n" +
      "Cama: " + camaBuscada + "\n" +
      "Nombre: " + nombre[camaBuscada] + "\n" +
      "Diagnóstico: " + diagnostico[camaBuscada] + "\n" +
      "Edad: " + edad[camaBuscada] + "\n" +
      "Fecha de nacimiento: " + fechaNacimiento[camaBuscada] + "\n" +
      "Fecha de ingreso: " + fechaIngreso[camaBuscada] + "\n" +
      "Días de estancia: " + estancia[camaBuscada] + "\n" +
      "Dieta: " + dieta[camaBuscada] + "\n" +
      "Sexo: " + sexo[camaBuscada] + "\n" +
      "Área: " + area[camaBuscada] + "\n" +
      "Pendientes: " + (pendientes[camaBuscada] || "-")
    );
  } else {
    mostrarMensaje("La cama " + camaBuscada + " está libre.");
  }
}

function darAlta() {
  var camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;
  if (ocupado[camaBuscada] == 0) {
    mostrarMensaje("La cama " + camaBuscada + " ya está libre.");
    return;
  }

  nombre[camaBuscada] = "";
  diagnostico[camaBuscada] = "";
  edad[camaBuscada] = "";
  fechaNacimiento[camaBuscada] = "";
  fechaIngreso[camaBuscada] = "";
  estancia[camaBuscada] = "";
  dieta[camaBuscada] = "";
  sexo[camaBuscada] = "";
  area[camaBuscada] = "";
  pendientes[camaBuscada] = "";
  ocupado[camaBuscada] = 0;

  actualizarResumen();
  mostrarPacientes();
  mostrarMensaje("Paciente dado de alta correctamente de la cama " + camaBuscada + ".");
}

function modificarPaciente() {
  var camaBuscada = obtenerCama();

  if (!validarCama(camaBuscada)) return;
  if (ocupado[camaBuscada] == 0) {
    mostrarMensaje("No hay paciente registrado en la cama " + camaBuscada + ".");
    return;
  }

  if (!validarCamposBase()) return;

  nombre[camaBuscada] = document.getElementById("nombre").value.trim();
  diagnostico[camaBuscada] = document.getElementById("diagnostico").value.trim();
  fechaNacimiento[camaBuscada] = document.getElementById("fechaNacimiento").value;
  fechaIngreso[camaBuscada] = document.getElementById("fechaIngreso").value;
  edad[camaBuscada] = calcularEdad(fechaNacimiento[camaBuscada]);
  estancia[camaBuscada] = calcularEstancia(fechaIngreso[camaBuscada]);
  dieta[camaBuscada] = obtenerDietaFinal();
  sexo[camaBuscada] = document.getElementById("sexo").value;
  area[camaBuscada] = document.getElementById("area").value;
  pendientes[camaBuscada] = document.getElementById("pendientes").value.trim();

  actualizarResumen();
  mostrarPacientes();
  mostrarMensaje(
    "Los datos del paciente en la cama " + camaBuscada + " fueron actualizados.\n\n" +
    "Edad actual: " + edad[camaBuscada] + "\n" +
    "Días de estancia: " + estancia[camaBuscada]
  );
}

function verCamasDisponibles() {
  var texto = "Camas disponibles:\n\n";
  var hayDisponibles = false;

  for (i = 1; i <= totalCamas; i++) {
    if (ocupado[i] == 0) {
      texto += "- Cama " + i + "\n";
      hayDisponibles = true;
    }
  }

  if (hayDisponibles) {
    mostrarMensaje(texto);
  } else {
    mostrarMensaje("No hay camas disponibles en este momento.");
  }
}
function guardarPaciente() {
  const cama = document.querySelector('input[placeholder="Ej. 12"]').value;
  const nombre = document.querySelector('input[placeholder="Nombre del paciente"]').value;
  const diagnostico = document.querySelector('input[placeholder="Diagnóstico principal"]').value;

  const paciente = {
    cama,
    nombre,
    diagnostico
  };

  // Obtener pacientes existentes
  let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

  // Agregar nuevo
  pacientes.push(paciente);

  // Guardar
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  alert("Paciente guardado correctamente");
}
