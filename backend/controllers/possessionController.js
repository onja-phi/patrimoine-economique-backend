import path from 'path';
import { writeFile } from '../data/index.js';

const dataPath = path.resolve('../data/data.json');

export const getPossessions = (req, res) => {
  res.status(200).json(global.possessions);  
};

export const createPossession = async (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;
  if (!libelle || !valeur || !dateDebut || !taux) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newPossession = { possesseur: { nom: "John Doe" }, libelle, valeur, dateDebut, taux, dateFin: null };
  global.possessions.push(newPossession);

  await savePossessions();
  res.status(201).json(newPossession);
};

export const updatePossession = async (req, res) => {
  const { libelle } = req.params;
  const { newLibelle } = req.body;

  let possession = global.possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.libelle = newLibelle || possession.libelle;

    await savePossessions();
    res.status(200).json(possession);
  } else {
    res.status(404).json({ message: "Possession not found" });
  }
};


export const closePossession = async (req, res) => {
  const { libelle } = req.params;
  let possession = global.possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = new Date().toISOString();
    await savePossessions();
    res.status(200).json(possession);
  } else {
    res.status(404).json({ message: "Possession not found" });
  }
};

export const getValeurPatrimoine = (req, res) => {
  const { date } = req.params;
  const dateObj = new Date(date);
  let totalValeur = global.possessions.reduce((sum, possession) => {
    return sum + getValeurPossession(possession, dateObj);
  }, 0);
  res.status(200).json({ date, valeur: totalValeur });
};

const getValeurPossession = (possession, date) => {
  return possession.valeur;
};

const savePossessions = async () => {
  await writeFile(dataPath, [{ model: "Personne", data: { nom: "John Doe" } }, { model: "Patrimoine", data: { possesseur: { nom: "John Doe" }, possessions: global.possessions } }]);
};