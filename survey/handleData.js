import rules from '../public/co2-model.FR-lang.fr.json' with { type: "json" }
import Engine from 'publicodes'
import { handleInputExcel, initOutputExcel } from './helpers/utils.js';

const { inputworksheet, numberOfRow } = await handleInputExcel();
const { outputWorkbook, outputWorksheet, headerRow } = await initOutputExcel();

const engine = new Engine(rules);
console.log(numberOfRow)
for (let i = 2; i <= numberOfRow; i ++) {
    console.log(i)
    const headerInput = inputworksheet.getRow(1).values;
    const currentRow = inputworksheet.getRow(i).values;
    const situation = {};
    const aideSaisie = {};

    for (let headerIndex = 2; headerIndex <= headerInput.length; headerIndex ++) {
        if (headerInput[headerIndex] !== undefined && currentRow[headerIndex] !== "" && currentRow[headerIndex] !== undefined) {
            if (headerInput[headerIndex].match('aide saisie')) {
                aideSaisie[headerInput[headerIndex].trim().toLowerCase()] = currentRow[headerIndex];
            } else if (currentRow[headerIndex] === true || currentRow[headerIndex] === false || currentRow[headerIndex] === 'TRUE' || currentRow[headerIndex] === 'FALSE') {
                situation[headerInput[headerIndex].trim().toLowerCase()] = (currentRow[headerIndex] === true  || currentRow[headerIndex] === 'TRUE') ? "oui" : "non";
            } else if (currentRow[headerIndex] !== 'je ne sais pas') {
                if (typeof currentRow[headerIndex] === 'string') {
                    situation[headerInput[headerIndex].trim().toLowerCase()] = `'${currentRow[headerIndex]}'`;
                } else {
                    situation[headerInput[headerIndex].trim().toLowerCase()] = currentRow[headerIndex];
                }
            }
        }
    }

    engine.setSituation(situation);
    const computeRow = [currentRow[1]];

    for (let ruleIndex = 2; ruleIndex <= headerRow.length; ruleIndex ++) {
        const rule = headerRow[ruleIndex].trim().toLowerCase();
        if (rule && rule.match("aide saisie")) {
            computeRow.push(aideSaisie[rule]);
        } else if (rule) {
            const nodeValue = engine.evaluate(rule).nodeValue;
            if (nodeValue) {
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
