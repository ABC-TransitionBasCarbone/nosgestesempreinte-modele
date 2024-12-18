/// ---------------------- Retrieving the regions models ----------------------

import path from 'path'
import fs from 'fs'
import { exit } from 'process'

import {
  customAssocPath,
  readYAML
} from '@incubateur-ademe/nosgestesclimat-scripts/utils'
export const regionModelsPath = path.resolve('data/i18n/models')

// TODO: use this type when we will be able to use typescript
// export type RegionAuthor = {
// 	nom: string,
// 	url?: string,
// }
//
// export type RegionParams = {
// 	nom: string,
// 	gentilé: string,
// 	authors?: RegionAuthor[],
// }

export const defaultModelCode = 'FR'
export const defaultRegionModelParam = {
  FR: {
    fr: { code: 'FR', nom: 'France métropolitaine', gentilé: 'française' },
  }
}
export const supportedRegionPath = 'public/supportedRegions.json'

//
// Reads all regions models and create a json file containing params of each region.
//
// Only XX-fr.publicodes files are read in 'data/i18n/models' directory, their are the base models.
// (XX-YY.publicodes files are not read, they are the translation of the base models.)
//
// The default region and hardcoded one is FR.
//
export const supportedRegions = fs
  .readdirSync(regionModelsPath)
  .reduce((acc, filename) => {
    if (!filename.match(/[A-Z]{2}.*.publicodes/)) {
      return acc
    }
    try {
      const langRegex = filename.match(/(?<=[A-Z]{2}-).*(?=.publicodes)/) // match lang param in filename
      const lang = langRegex[0]
      const regionPath = path.join(regionModelsPath, filename)
      const rules = readYAML(regionPath)
      const params = rules['params']
      if (params === undefined) {
        console.log(
          ` ❌ The file ${filename} doesn't contain a 'params' key, aborting...`
        )
        exit(-1)
      }
      const code = rules.params.code
      return customAssocPath([code, lang], params, acc)
    } catch (err) {
      console.log(
        ' ❌ An error occured while reading the file:',
        filename,
        ':\n\n',
        err.message
      )
      exit(-1)
    }
  }, defaultRegionModelParam)

export const supportedRegionCodes = Object.keys(supportedRegions)
