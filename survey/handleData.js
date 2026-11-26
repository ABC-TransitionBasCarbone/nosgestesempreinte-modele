import rules from '../public/co2-model.FR-lang.fr.json' with { type: "json" }
import Engine from 'publicodes'
import { handleInputExcel, initOutputExcel } from './helpers/utils.js';

const { inputworksheet, numberOfRow } = await handleInputExcel();
const { outputWorkbook, outputWorksheet, headerRow } = await initOutputExcel();

const engine = new Engine(rules);
const normalize = (value) => value && String(value).trim().toLocaleLowerCase('fr-FR');
const ruleNames = new Map(Object.keys(rules).map((rule) => [normalize(rule), rule]));
console.log(numberOfRow)
for (let i = 2; i <= numberOfRow; i ++) {
    console.log(i)
    const headerInput = inputworksheet.getRow(1).values;
    const currentRow = inputworksheet.getRow(i).values;
    const situation = {};
    const aideSaisie = {};

    for (let headerIndex = 2; headerIndex <= headerInput.length; headerIndex ++) {
        if (headerInput[headerIndex] !== undefined && currentRow[headerIndex] !== "" && currentRow[headerIndex] !== undefined) {
            const header = normalize(headerInput[headerIndex]);
            const rule = ruleNames.get(header) ?? header;
            const value = currentRow[headerIndex];
            const normalizedValue = typeof value === 'string' ? normalize(value) : value;

            if (header.includes('aide saisie')) {
                aideSaisie[header] = value;
            } else if (value === true || value === false || ['true', 'false', 'oui', 'non'].includes(normalizedValue)) {
                situation[rule] = (value === true || normalizedValue === 'true' || normalizedValue === 'oui') ? "oui" : "non";
            } else if (normalizedValue !== 'je ne sais pas' && normalizedValue !== 'Nsp' && normalizedValue !== 'nsp' && normalizedValue !== 'jnsp') {
                if (typeof value === 'string') {
                    const possibilities = rules[rule]?.formule?.['une possibilité']?.['possibilités'];
                    const canonicalValue = possibilities?.find((possibility) => normalize(possibility) === normalizedValue) ?? value;
                    situation[rule] = `'${canonicalValue}'`;
                } else {
                    situation[rule] = value;
                }
            }
        }
    }

    engine.setSituation(situation);
    const computeRow = [currentRow[1]];

    for (let ruleIndex = 2; ruleIndex <= headerRow.length; ruleIndex ++) {
        const header = normalize(headerRow[ruleIndex]);
        const rule = ruleNames.get(header) ?? header;

        if (header && header.includes("aide saisie")) {
            computeRow.push(aideSaisie[header]);
        } else if (rule) {
            const evaluation = engine.evaluate(rule)
            const nodeValue = evaluation.nodeValue;
            if (nodeValue || nodeValue === 0) {
                computeRow.push(engine.evaluate(rule).nodeValue);
            } else if (situation[rule] === 'non') {
                computeRow.push('FAUX');
            } else {
                computeRow.push('');
            }
        } else {
            computeRow.push(0);
        }
    }

    outputWorksheet.addRow(computeRow);
}

console.log("writing in file")
await outputWorkbook.xlsx.writeFile("survey/test-output.xlsx");
console.log("end")
