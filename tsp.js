const Evolution = require("./Evolution")

const initialPopulationCount = 100
const matingTemperature = 2
const numberOfCities = 10
const numberOfProportions = 5

const distanceBetweenCities = (city1, city2) => {
  return Math.sqrt(
    2 -
      2 *
        Math.cos(
          (2 *
            Math.PI *
            Math.min(
              Math.abs(city1 - city2),
              numberOfCities - Math.abs(city1 - city2)
            )) /
            numberOfCities
        )
  )
}

const calculateFitness = (genes) => {
  let totalDistance = 0
  const cities = genes
    .map((gene, index) => ({
      index,
      value: gene,
    }))
    .sort((gene1, gene2) => gene1.value - gene2.value)

  cities.reduce((previousCity, currentCity) => {
    if (previousCity) {
      totalDistance += distanceBetweenCities(
        previousCity.index,
        currentCity.index
      )
    }
    return currentCity
  }, null)

  totalDistance += distanceBetweenCities(
    cities[cities.length - 1].index,
    cities[0].index
  )

  return (2 * Math.PI) / totalDistance
}

const tspEvolution = new Evolution({
  initialPopulation: () => {
    function generateIndividual() {
      const genes = []
      for (var i = 0; i < numberOfCities; i++) {
        genes.push(Math.random())
      }
      return { fitness: calculateFitness(genes), genes }
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
    let slicingPoints = []
    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    for (var i = 0; i < numberOfProportions; i++) {
      slicingPoints.push(getRandomInt(1, numberOfCities - 2))
    }
    slicingPoints.push(numberOfCities - 1)
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
    return genes
  },
  mutate: (genes) => {
    for (var i = 0; i < uniqueItemCount; i++) {
      if (Math.random() < mutationProbability) {
        genes[i] = Math.random()
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
      function selectParent() {
        const target = Math.random()
        let collected = candidates[0].selectionProbability
        let index = 1
        while (collected < target && index < candidates.length)
          collected += candidates[index++].selectionProbability
        return candidates[index - 1]
      }
      const parent1 = selectParent()
      const parent2 = selectParent()

      if (parent1 && parent2) {
        parents.push([parent1, parent2])
      }
    }
    return parents
  },
})

tspEvolution.evolve(100)

console.log(
  JSON.stringify(
    tspEvolution.population.sort((a, b) => b.fitness - a.fitness).slice(0, 5)
  )
)
