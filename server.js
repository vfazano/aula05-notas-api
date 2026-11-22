const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const port = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

async function readNotes() {
  try {
    const content = await fs.readFile(dataFile, 'utf8');
    const notes = JSON.parse(content);
    if (!Array.isArray(notes)) throw new Error('data.json precisa conter uma lista.');
    return notes;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveNotes(notes) {
  await fs.writeFile(dataFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8');
}

function validNote(body) {
  return typeof body?.titulo === 'string' && body.titulo.trim().length > 0
    && typeof body?.texto === 'string' && body.texto.trim().length > 0;
}

app.get('/', (_request, response) => response.json({ message: 'API de notas', endpoints: '/api/notes' }));

app.get('/api/notes', async (_request, response, next) => {
  try { response.json(await readNotes()); } catch (error) { next(error); }
});

app.get('/api/notes/:id', async (request, response, next) => {
  try {
    const note = (await readNotes()).find((item) => item.id === request.params.id);
    if (!note) return response.status(404).json({ error: 'Nota não encontrada.' });
    response.json(note);
  } catch (error) { next(error); }
});

app.post('/api/notes', async (request, response, next) => {
  try {
    if (!validNote(request.body)) return response.status(400).json({ error: 'Informe titulo e texto não vazios.' });
    const notes = await readNotes();
    const note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      titulo: request.body.titulo.trim(),
      texto: request.body.texto.trim(),
      criadoEm: new Date().toISOString()
    };
    notes.unshift(note);
    await saveNotes(notes);
    response.status(201).json(note);
  } catch (error) { next(error); }
});

app.put('/api/notes/:id', async (request, response, next) => {
  try {
    if (!validNote(request.body)) return response.status(400).json({ error: 'Informe titulo e texto não vazios.' });
    const notes = await readNotes();
    const index = notes.findIndex((item) => item.id === request.params.id);
    if (index < 0) return response.status(404).json({ error: 'Nota não encontrada.' });
    notes[index] = { ...notes[index], titulo: request.body.titulo.trim(), texto: request.body.texto.trim() };
    await saveNotes(notes);
    response.json(notes[index]);
  } catch (error) { next(error); }
});

app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const notes = await readNotes();
    const remaining = notes.filter((item) => item.id !== request.params.id);
    if (remaining.length === notes.length) return response.status(404).json({ error: 'Nota não encontrada.' });
    await saveNotes(remaining);
    response.status(204).end();
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Erro interno ao acessar as notas.' });
});

app.listen(port, () => console.log(`API de notas disponível na porta ${port}`));
