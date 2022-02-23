// Genetic Algorithm

class Evolution {
  population = []
  mutationProbability = 0.05
  calculateFitness = (genes) => 0
  generateCrossover = (parent1, parent2, calculateFitness) => ({
    genes: [],
    fitness: 0,
  })
  selection = (population) => population
  mutate = (genes) => genes

  constructor({
    initialPopulation,
    mutationProbability,
    calculateFitness,
    generateCrossover,
    selection,
    mutate,
  }) {
    this.population = initialPopulation()
    this.mutationProbability = mutationProbability
    this.calculateFitness = calculateFitness
    this.generateCrossover = generateCrossover
    this.selection = selection
    this.mutate
  }

  evolve(numberOfIterations) {
    for (let i = 0; i < numberOfIterations; i++) {
      const parents = this.selection(this.population)

      // generate new population
      const newPopulation = []

      parents.forEach(([parent1, parent2]) => {
        const genes = this.mutate(
          this.generateCrossover(parent1.individual, parent2.individual)
        )
        newPopulation.push({
          genes,
          fitness: this.calculateFitness(genes),
        })
      })

      this.population = newPopulation
    }
  }
}

module.exports = Evolution
