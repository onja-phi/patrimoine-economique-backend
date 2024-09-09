import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { readFile, writeFile } from './data/index.js';
import { getPossessions, createPossession, updatePossession, closePossession, getValeurPatrimoine } from './controllers/possessionController.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const dataPath = path.resolve('data/data.json');

(async function initializeData() {
  const result = await readFile(dataPath);
  if (result.status === "OK") {
    global.possessions = result.data[1].data.possessions;
  } else {
    console.error('Erreur lors du chargement des données:', result.error);
  }
})();

// Routes
app.get('/possession', getPossessions);
app.post('/possession', createPossession);
app.put('/possession/:libelle', updatePossession);
app.put('/possession/:libelle/close', closePossession);
app.get('/patrimoine/:date', getValeurPatrimoine);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
