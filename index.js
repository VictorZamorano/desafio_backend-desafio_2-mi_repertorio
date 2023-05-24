import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { writeFileSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

/* GET */
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
	try {
		const canciones = JSON.parse(readFileSync("canciones.json"));
		res.json(canciones);
	} catch (error) {
		console.log(error);
	}
});
/* END GET  */

/* POST */
app.post("/canciones", (req, res) => {
	const id = Math.floor(Math.random() * 9999);
	const { titulo, artista, tono } = req.body;
	const cancion = { id, titulo, artista, tono };

	if (!titulo) {
		res.status(403);
		res.send({ error: "Necesitas rellenar el campo 'Canción'" });
		return;
	}
	if (!artista) {
		res.status(403);
		res.send({ error: "Necesitas rellenar el campo 'Artista'" });
		return;
	}
	if (!tono) {
		res.status(403);
		res.send({ error: "Necesitas rellenar el campo 'Tono'" });
		return;
	}

	const canciones = JSON.parse(readFileSync("canciones.json"));
	canciones.push(cancion);

	writeFileSync("canciones.json", JSON.stringify(canciones));

	res.send("Canción agregada");
});
/* END POST */

/* PUT */
app.put("/canciones/:id", (req, res) => {
	const { id } = req.params;
	const cancion = req.body;
	const canciones = JSON.parse(readFileSync("canciones.json"));
	const index = canciones.findIndex((c) => c.id == id);

	canciones[index] = cancion;

	writeFileSync("canciones.json", JSON.stringify(canciones));
	res.send("Canción modificacada");
});

/* DELETE */
app.delete("/canciones/:id", (req, res) => {
	const { id } = req.params;
	const canciones = JSON.parse(readFileSync("canciones.json"));
	const index = canciones.findIndex((c) => c.id === parseInt(id));

	canciones.splice(index, 1);
	writeFileSync("canciones.json", JSON.stringify(canciones));

	res.send("Canción eliminada");
});

/* END DELETE */

/* LISTEN */
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("SERVER ON!", `http://localhost:${PORT}`));
/* END LISTEN */
