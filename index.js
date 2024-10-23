
import rules from "./nosgestesclimat.model.json";

export default rules;

import FR_fr_optim from './public/co2-model.FR-lang.fr-opti.json';
import FR_fr from './public/co2-model.FR-lang.fr.json';

import supportedRegions from './public/supportedRegions.json' 

import personasFr from './public/personas-fr.json' 

import migration from './public/migration.json'

const personas = {
    fr: personasFr,
}

const models = {
    'co2-model.FR-lang.fr-opti.json': FR_fr_optim,
    'co2-model.FR-lang.fr.json': FR_fr,
}

export { supportedRegions, personas, migration, models }
