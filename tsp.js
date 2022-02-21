// Genetic Algorithm

class Evolution {
  numberOfCities = 1
  initialPopulation = []
  population = []
  initialPopulationCount = 1000
  matingTemperature = 1
  mutationProbability = 0.05
  numberOfProportions = 5

  constructor({
    numberOfCities,
    initialPopulationCount,
    matingTemperature,
    mutationProbability,
    numberOfProportions,
  }) {
    this.numberOfCities = numberOfCities
    this.initialPopulationCount = initialPopulationCount
    this.matingTemperature = matingTemperature
    this.mutationProbability = mutationProbability
    this.numberOfProportions = numberOfProportions

    this.generateInitialPopulation()
  }

  generateIndividual() {
    // where genes is a vector of length uniqueItemCount of 0s and 1s indicating which items are in the backpack
    const genes = []
    for (var i = 0; i < this.numberOfCities; i++) {
      genes.push(Math.random())
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
    let totalDistance = 0
    const cities = genes
      .map((gene, index) => ({
        index,
        value: gene,
      }))
      .sort((gene1, gene2) => gene1.value - gene2.value)

    cities.reduce((previousCity, currentCity) => {
      if (previousCity) {
        totalDistance += this.distanceBetweenCities(
          previousCity.index,
          currentCity.index
        )
      }
      return currentCity
    }, null)

    totalDistance += this.distanceBetweenCities(
      cities[cities.length - 1].index,
      cities[0].index
    )

    return (2 * Math.PI) / totalDistance
  }

  distanceBetweenCities(city1, city2) {
    return Math.sqrt(
      2 -
        2 *
          Math.cos(
            (2 *
              Math.PI *
              Math.min(
                Math.abs(city1 - city2),
                this.numberOfCities - Math.abs(city1 - city2)
              )) /
              this.numberOfCities
          )
    )
  }

  generateCrossover(candidate1, candidate2) {
    const genes = []
    let slicingPoints = []
    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    for (var i = 0; i < this.numberOfProportions; i++) {
      slicingPoints.push(getRandomInt(1, this.numberOfCities - 2))
    }
    slicingPoints.push(this.numberOfCities - 1)
    slicingPoints = slicingPoints.sort((a, b) => a - b)

    let previousSlicingIndex = 0
    for (var i = 0; i < slicingPoints.length; i++) {
      genes.push(
        ...(Math.random() > 0.5
          ? candidate1.genes.slice(previousSlicingIndex, slicingPoints[i])
          : candidate2.genes.slice(previousSlicingIndex, slicingPoints[i]))
      )
      previousSlicingIndex = slicingPoints[i]
    }

    // TODO: mutate

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

const TSP = new Evolution({
  initialPopulationCount: 200,
  matingTemperature: 2,
  mutationProbability: 0.05,
  numberOfCities: 10,
  numberOfProportions: 5,
})
TSP.evolve(100)
console.log(
  JSON.stringify(
    TSP.population
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 5)
      .map((individual) => ({
        ...individual,
        cities: individual.genes
          .map((gene, index) => ({ index, value: gene }))
          .sort((gene1, gene2) => gene1.value - gene2.value)
          .map((gene) => gene.index),
      }))
  )
)
