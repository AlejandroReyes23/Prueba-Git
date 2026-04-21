const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "indexcensofinal_area.html"));
});

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI no está definido en el archivo .env");
  process.exit(1);
}

console.log("URI cargada:", uri ? "Sí" : "No");

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000
});

let collection;

async function conectar() {
  try {
    console.log("Intentando conectar a MongoDB...");

    await client.connect();

    const db = client.db(process.env.DB_NAME || "HospitalV1");
    collection = db.collection(process.env.COLLECTION_NAME || "pacientes");

    await collection.createIndex({ cama: 1 }, { unique: true });

    console.log("Conectado a MongoDB");

    app.listen(port, "0.0.0.0", () => {
      console.log("Servidor corriendo en:");
      console.log("http://localhost:" + port);
      console.log("http://192.168.1.71:" + port);
    });

  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

conectar();

/* REGISTRAR */
app.post("/pacientes", async (req, res) => {
  try {
    const paciente = req.body;

    if (!paciente.cama) {
      return res.status(400).json({ error: "La cama es obligatoria." });
    }

    await collection.insertOne(paciente);
    res.status(201).json({ mensaje: "Paciente guardado correctamente." });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "La cama ya está ocupada." });
    }
    res.status(500).json({ error: "Error al guardar el paciente." });
  }
});

/* OBTENER TODOS */
app.get("/pacientes", async (req, res) => {
  try {
    const datos = await collection.find().sort({ cama: 1 }).toArray();
    res.json(datos);
  } catch (error) {
    console.error("ERROR REAL EN /pacientes:", error);
    res.status(500).json({ error: "Error al obtener pacientes." });
  }
});

/* BUSCAR POR CAMA */
app.get("/pacientes/:cama", async (req, res) => {
  try {
    const cama = Number(req.params.cama);
    const paciente = await collection.findOne({ cama });

    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado." });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar paciente." });
  }
});

/* MODIFICAR */
app.put("/pacientes/:cama", async (req, res) => {
  try {
    const cama = Number(req.params.cama);

    const resultado = await collection.updateOne(
      { cama },
      { $set: req.body }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "No existe paciente en esa cama." });
    }

    res.json({ mensaje: "Paciente actualizado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar paciente." });
  }
});

/* ELIMINAR / DAR DE ALTA */
app.delete("/pacientes/:cama", async (req, res) => {
  try {
    const cama = Number(req.params.cama);

    const resultado = await collection.deleteOne({ cama });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: "No existe paciente en esa cama." });
    }

    res.json({ mensaje: "Paciente eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar paciente." });
  }
});