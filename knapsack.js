// Genetic Algorithm

class Evolution {
  maxWeightAllowance = 10
  uniqueItemCount = 10
  items = []
  initialPopulation = []
  population = []
  initialPopulationCount = 1000
  matingTemperature = 1
  mutationProbability = 0.05

  constructor({
    maxWeightAllowance,
    uniqueItemCount,
    initialPopulationCount,
    matingTemperature,
    mutationProbability,
  }) {
    this.maxWeightAllowance = maxWeightAllowance
    this.uniqueItemCount = uniqueItemCount
    this.initialPopulationCount = initialPopulationCount
    this.matingTemperature = matingTemperature
    this.mutationProbability = mutationProbability

    this.generateItems()
    this.generateInitialPopulation()
  }

  generateItems() {
    this.items = []
    for (var i = 0; i < this.uniqueItemCount; i++) {
      this.items.push({ weight: Math.random() * 10, reward: i + 1 })
    }
  }

  generateIndividual() {
    // where genes is a vector of length uniqueItemCount of 0s and 1s indicating which items are in the backpack
    const genes = []
    for (var i = 0; i < this.uniqueItemCount; i++) {
      genes.push(Math.random() > 0.5)
    }
    return { fitness: this.calculateFitness(genes), genes }
  }

  generateInitialPopulation() {
    this.initialPopulation = []
    for (var i = 0; i < this.initialPopulationCount; i++) {
      this.initialPopulation.push(this.generateIndividual())
    }
    this.population = this.initialPopulation
  }

  calculateFitness(genes) {
    let totalReward = 0
    let totalWeight = 0
    genes.forEach((gene, index) => {
      const item = this.items[index]
      if (gene) {
        totalWeight += item.weight
        totalReward += item.reward
      }
    })
    if (totalWeight > this.maxWeightAllowance) {
      return 0
    }
    return totalReward
  }

  generateCrossover(candidate1, candidate2) {
    const genes = []
    for (var i = 0; i < this.uniqueItemCount; i++) {
      // mutate
      if (Math.random() < this.mutationProbability) {
        genes.push(Math.random() < 0.5)
      } else {
        genes.push(
          Math.random() > 0.5 ? candidate1.genes[i] : candidate2.genes[i]
        )
      }
    }
    return { genes, fitness: this.calculateFitness(genes) }
  }

  evolve(numberOfIterations) {
    for (let i = 0; i < numberOfIterations; i++) {
      // fills pool of candidates with probability of their fitness according to Gibbs distribution - assuming a fitness of 0.1 for each item is the worst possible to include them in the mating pool as well
      let totalFitness = 0
      this.population.forEach((individual) => {
        totalFitness += Math.pow(
          Math.E,
          (individual.fitness === 0 ? 0.1 : individual.fitness) /
            this.matingTemperature
        )
      })
      const candidates = this.population
        .map((individual) => {
          const selectionProbability =
            Math.pow(
              Math.E,
              (individual.fitness === 0 ? 0.1 : individual.fitness) /
                this.matingTemperature
            ) / totalFitness
          return { selectionProbability, individual }
        })
        .sort((a, b) => b.selectionProbability - a.selectionProbability)
      // generate new population
      const newPopulation = []
      while (newPopulation.length < this.population.length) {
        const parent1 = candidates.find(
          (candidate) => Math.random() < candidate.selectionProbability
        )
        const parent2 = candidates.find(
          (candidate) => Math.random() < candidate.selectionProbability
        )
        if (parent1 && parent2) {
          newPopulation.push(
            this.generateCrossover(parent1.individual, parent2.individual)
          )
        }
      }
      this.population = newPopulation
    }
  }
}

const Knapsack = new Evolution({
  initialPopulationCount: 200,
  matingTemperature: 2,
  maxWeightAllowance: 10,
  uniqueItemCount: 10,
  mutationProbability: 0.05,
})
Knapsack.evolve(100)
console.log(
  JSON.stringify(
    Knapsack.population.sort((a, b) => b.fitness - a.fitness).slice(0, 5)
  )
)

// TODO: add random mutation
