<div align="center">
  <h3 align="center">
	<big>Nos Gestes Empreinte</big>
  </h3>

  Modèle de calcul du projet Nos Gestes Empreinte (NGE)
  <p><i>Ce modèle est une déclinaison du modèle <a href="https://github.com/incubateur-ademe/nosgestesclimat">Nos Gestes Climat</a></i></p>
</div>


## Utilisation

Le modèle est écrit avec le nouveau langage de programmation [`publicodes`](https://publi.codes).
Vous pouvez réutiliser le modèle NGE via le paquet npm `@ABC-TransitionBasCarbone/nosgestesempreinte-modele` :

```sh
yarn add @ABC-TransitionBasCarbone/nosgestesempreinte-modele
```

Exemple d'utilisation :

```ts
import rules from '@ABC-TransitionBasCarbone/nosgestesempreinte-modele/public/co2-model.FR-lang.fr.json'
import Engine from 'publicodes'

const engine = new Engine(rules)
console.log(engine.evaluate('bilan'))
```

### QuickDoc

Pour faciliter le développement, NGC a mis en place un outils de
développement local que nous avons réutilisé ici . Cet outil permet de visualiser la documentation (basée sur
[`@publicodes/react-ui`](https://publi.codes/docs/api/react-ui)) et les
résultats de la compilation des modèles et des personas, ainsi que comparer les
résultats avec les versions en production.

```bash
# installe les dépendances
yarn && cd quick-doc && yarn

# lance le serveur de développement en charge de compiler les modèles et les personas
yarn dev

# lance le client de la documentation
yarn doc
```