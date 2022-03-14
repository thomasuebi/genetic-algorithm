import java.util.Random;

public class GeneticAlgorithm {

    private static final int POPULATION_SIZE = 100;
    private static final int MAX_GENERATIONS = 1000;
    private static final double MUTATION_RATE = 0.01;
    private static final double ELITISM_RATE = 0.2;


    private static final Random RANDOM = new Random();

    private static KnapSack knapsack;

    private Individual evolvePopulation(Individual[] population, int maxGenerations) {
        // Keep track of the current generation.
        int generation = 1;

        // Start with the first individual.
        Individual fittest = population[0];

        // Keep going until we hit the maximum number of generations.
        while (generation < maxGenerations) {

            // Create a new population.
            Individual[] newPopulation = new Individual[POPULATION_SIZE];

            // Sort this population in descending order.
            sortPopulation(population);

            // Keep the best individuals.
            for (int i = 0; i < POPULATION_SIZE * ELITISM_RATE; i++) {
                newPopulation[i] = population[i];
            }

            // Breed the next individuals.
            for (int i = (int) (POPULATION_SIZE * ELITISM_RATE); i < POPULATION_SIZE; i++) {
                Individual parent1 = selectParent(population);
                Individual parent2 = selectParent(population);
                Individual child = breed(parent1, parent2);
                newPopulation[i] = child;
            }

            // Mutate some individuals.
            for (int i = 0; i < POPULATION_SIZE; i++) {
                mutate(newPopulation[i]);
            }

            // Evolve the population.
            population = newPopulation;

            // Increment the current generation.
            generation++;
        }

        // Return the fittest individual in the population.
        return fittest;
    }

    private Individual selectParent(Individual[] population) {
        // Pick a random number between 0 and the population size.
        int index = RANDOM.nextInt(POPULATION_SIZE);

        // Return the individual at this index.
        return population[index];
    }

    private Individual breed(Individual parent1, Individual parent2) {
        // Create new individual.
        Individual child = new Individual();

        // Loop through each item in the individual.
        for (int i = 0; i < parent1.getGenes().length; i++) {
            // If this item should be from parent 1 or 2
            if (RANDOM.nextDouble() < 0.5) {
                child.getGenes()[i] = parent1.getGenes()[i];
            } else {
                child.getGenes()[i] = parent2.getGenes()[i];
            }
        }

        return child;
    }

    private void sortPopulation(Individual[] population) {
        // Sort the population in descending order based on fitness
        for (int i = 0; i < population.length - 1; i++) {
            for (int j = i + 1; j < population.length; j++) {
                if (population[i].getFitness() < population[j].getFitness()) {
                    Individual temp = population[i];
                    population[i] = population[j];
                    population[j] = temp;
                }
            }
        }
    }

    private void mutate(Individual individual) {
        // Loop through each item in the individual.
        do {
            for (int i = 0; i < individual.getGenes().length; i++) {
                // If this item should be mutated.
                if (RANDOM.nextDouble() < MUTATION_RATE) {
                    // Flip the bit.
                    individual.getGenes()[i] = !individual.getGenes()[i];
                }
            }
        } while (!knapsack.isValidSolution(individual.getGenes()));
    }

    class Individual {

        private boolean[] genes;
        private int fitness;

        public Individual() {
            genes = new boolean[knapsack.getNumberOfItems()];
            for (int i = 0; i < knapsack.getNumberOfItems(); i++) {
                genes[i] = RANDOM.nextBoolean();
            }
            fitness = knapsack.calculateFitness(genes);
        }

        public boolean[] getGenes() {
            return genes;
        }

        public int getFitness() {
            return fitness;
        }

        public void setFitness(int fitness) {
            this.fitness = fitness;
        }

        public void setGenes(boolean[] genes) {
            this.genes = genes;
        }
    }

    public static void main(String[] args) {

        // Create a random Knapsack problem.
        knapsack = new KnapSack(10, 20);

        // Create Genetic algorithm
        GeneticAlgorithm ga = new GeneticAlgorithm();

        // Create a population of random individuals.
        Individual[] population = new Individual[POPULATION_SIZE];
        for (int i = 0; i < POPULATION_SIZE; i++) {
            population[i] = ga.new Individual();
        }

        // Evolve the population to reach a solution.
        Individual fittest = ga.evolvePopulation(population, MAX_GENERATIONS);

        // print the knapsack
        knapsack.printKnapsack();

        // print the optimal fitness
        System.out.println("Optimal fitness: " + knapsack.calculateOptimalFitness());


        // Print the fittest individual.
        System.out.println("Fittest individual: " + fittest.getFitness());


    }
}
