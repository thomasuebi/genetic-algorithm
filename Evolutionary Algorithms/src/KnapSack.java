import java.util.Arrays;

public class KnapSack {
    /**
     * creates a knapsack with a given capacity
     * index 0 is the value, index 1 is the weight
     */

    int[][] knapsack;

    public static int[][] randomKnapsack(int n, int w) {
        int[][] items = new int[n+1][2];
        for (int i = 0; i < n; i++) {
            items[i][0] = i + 1;
            items[i][1] = (int) (Math.random() * 10);
        }
        items[n][0] = w;
        return items;
    }

    public void printKnapsack() {
        for (int[] ints : knapsack) {
            System.out.println(ints[0] + " " + ints[1]);
        }
    }

    public KnapSack(int n, int w) {
        knapsack = randomKnapsack(n, w);
    }

    public int calculateFitness(boolean[] genes) {
        // fitness is the sum of the values of the selected items
        int fitness = 0;
        for (int i = 0; i < genes.length; i++) {
            if (genes[i]) {
                fitness += knapsack[i][0];
            }
        }
        return fitness;
    }

    public int calculateOptimalFitness() {
        // Try every combination of items and return the best one
        int[] fitnesses = new int[(int) Math.pow(2, getNumberOfItems())];
        for (int i = 0; i < fitnesses.length; i++) {
            boolean[] solution = intToBinary(i);
            if (isValidSolution(solution)) {
                fitnesses[i] = calculateFitness(solution);
            } else {
                fitnesses[i] = 0;
            }
        }
        System.out.println(Arrays.toString(intToBinary(maxIndex(fitnesses))));
        return fitnesses[maxIndex(fitnesses)];
    }

    public boolean isValidSolution(boolean[] solution) {
        // if the sum of the weights of the selected items is less than the knapsack's capacity
        int sum = 0;
        for (int i = 0; i < solution.length; i++) {
            if (solution[i]) {
                sum += knapsack[i][1];
            }
        }
        return sum <= getKnapsackWeight();
    }

    public boolean[] intToBinary(int i) {
        boolean[] binary = new boolean[getNumberOfItems()];
        for (int j = 0; j < getNumberOfItems(); j++) {
            binary[j] = (i & (1 << j)) != 0;
        }
        return binary;
    }

    public int maxIndex(int[] array) {
        int max = array[0];
        int index = 0;
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
                index = i;
            }
        }
        return index;
    }

    public int[][] getKnapsack() {
        return knapsack;
    }

    public int getKnapsackWeight() {
        return knapsack[knapsack.length - 1][0];
    }

    public int getKnapsackItemValue(int i) {
        if (i < 0 || i >= getNumberOfItems()) {
            throw new IllegalArgumentException("Item index out of bounds");
        }
        return knapsack[i][0];
    }

    public int getKnapsackItemWeight(int i) {
        if (i < 0 || i >= getNumberOfItems()) {
            throw new IllegalArgumentException("Item index out of bounds");
        }
        return knapsack[i][1];
    }

    public int getNumberOfItems() {
        return knapsack.length - 1;
    }

}