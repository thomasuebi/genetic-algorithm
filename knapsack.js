const Evolution = require("./Evolution")

const initialPopulationCount = 100
const uniqueItemCount = 10
const matingTemperature = 2
const maxWeightAllowance = 10
let items = []

const calculateFitness = (genes) => {
  let totalReward = 0
  let totalWeight = 0
  genes.forEach((gene, index) => {
    const item = items[index]
    if (gene) {
      totalWeight += item.weight
      totalReward += item.reward
    }
  })
  if (totalWeight > maxWeightAllowance) {
    return 0
  }
  return totalReward
}

const knapSackEvolution = new Evolution({
  initialPopulation: () => {
    function generateIndividual() {
      // where genes is a vector of length uniqueItemCount of 0s and 1s indicating which items are in the backpack
      const genes = []
      for (var i = 0; i < uniqueItemCount; i++) {
        genes.push(Math.random() > 0.5)
      }
      return { fitness: calculateFitness(genes), genes }
    }

    // Generate Items
    for (var i = 0; i < uniqueItemCount; i++) {
      items.push({ weight: Math.random() * 10, reward: i + 1 })
    }

    const initialPopulation = []
    for (var i = 0; i < initialPopulationCount; i++) {
      initialPopulation.push(generateIndividual())
    }
    return initialPopulation
  },
  mutationProbability: 0.05,
  calculateFitness,
  generateCrossover: (candidate1, candidate2) => {
    const genes = []
    for (var i = 0; i < uniqueItemCount; i++) {
      genes.push(
        Math.random() > 0.5 ? candidate1.genes[i] : candidate2.genes[i]
      )
    }
    return genes
  },
  mutate: (genes) => {
    for (var i = 0; i < uniqueItemCount; i++) {
      if (Math.random() < mutationProbability) {
        genes[i] = Math.random() < 0.5
      }
    }
    return genes
  },
  selection: (population) => {
    // fills pool of candidates with probability of their fitness according to Gibbs distribution - assuming a fitness of 0.1 for each item is the worst possible to include them in the mating pool as well
    let totalFitness = 0
    population.forEach((individual) => {
      totalFitness += Math.pow(
        Math.E,
        (individual.fitness === 0 ? 0.1 : individual.fitness) /
          matingTemperature
      )
    })
    const candidates = population
      .map((individual) => {
        const selectionProbability =
          Math.pow(
            Math.E,
            (individual.fitness === 0 ? 0.1 : individual.fitness) /
              matingTemperature
          ) / totalFitness
        return { selectionProbability, individual }
      })
      .sort((a, b) => b.selectionProbability - a.selectionProbability)
    // generate new population
    const parents = []
    while (parents.length < population.length) {
      const parent1 = candidates.find(
        (candidate) => Math.random() < candidate.selectionProbability
      )
      const parent2 = candidates.find(
        (candidate) => Math.random() < candidate.selectionProbability
      )

      if (parent1 && parent2) {
        parents.push([parent1, parent2])
      }
    }
    return parents
  },
})

knapSackEvolution.evolve(10)

console.log(
  JSON.stringify(
    knapSackEvolution.population
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 5)
  )
)
