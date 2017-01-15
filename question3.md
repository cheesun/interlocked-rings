# Analysis of my solution

As per my solution, one can approach this problem by scanning over the possible sums and solving the decision problem of whether an arrangement exists. This multiplies the time complexity by O(n) as the number of possible sums is proportional linearly to the number of rings.

To solve the decision problem, I use a top-down dynamic programming algorithm which recursively (depth first) searches for a sub-problem which is known to have a solution. The solution to these sub-problems are memoized which provides some pruning of the search tree. However the running time is still exponential = O(2^n) on the number of rings/positions.

This gives a running time of O(numberOfSums * 2^n) => O(n * 2^n) => O(2^n) which is exponential.

Space used is O(n^2 + n^2) => O(n^2) which is also exponential, though to a lesser degree than the time complexity:

* O(n^2) to store the branches (different pairs of numbers that could satisfy the current target sum at that level of the search tree)
* O(2^n) to store the solution of any particular sub-problem



# Implementing a feasible solution for 500 rings

The key problems with the current solution are that both time and space complexity are exponential. 50 rings already takes an inordinate amount of time and 500 rings is certainly unfeasible.


## First determine whether there is a more efficient solution (in terms of complexity class) to the problem than the one I'm using.

### Look more closely at the numerical structure of the problem

There is the possibility that there are some niceties about the numerical structure of the problem which would allow a better solution. For example, during testing it was noted that the sum of the odd positions of the solution and the sum of the even positions of the solution always added up to a multiple of the number of rings. This suggests there is more structure to exploit in pruning the tree. Unfortunately, I've not discovered anything consequential so far.

It may even be possible to calculate the minimum and maximum sums without needing to find a solution.

### Or prove that there isn't one, by reduction from an existing NP-complete or NP-hard problem

I haven't had time to produce a proof for reduction of an existing NP-complete problem to the interlocking rings problem but I would need to do this if I wanted to show that it's unlikely that I will find a polynomial time (non exponential) solution to the problem. Sudoku, which is very similar to this problem and known to be NP-complete, may be a good place to start for this reduction.


## Explore other high-level options

### How confident do we need to be of the solution?

If an answer is only needed with high probability, then stochastic and heuristic methods may be able to converge on a likely solution in a reasonable amount of time. I would lean towards simulated annealing as a possible algorithm to pursue.

### Switch to a different language

Javascript is not the fastest language - re-implementing in a lower level or just generally faster language would improve the runtime.

In addition, picking a language that supports stackless programming would also prevent stack overflows (the current implementation is stack dependent due to recursion).

### Parallelize

Parallelization opens up the option of increasing the amount of compute power to try to get the solution faster - though bear in mind that since the complexity grows exponentially this may be a fruitless endeavour.

The algorithm I use is amenable to parallelization, and can be partitioned on both the sums we solve for, and on the branches of each level. If on one machine, we can run the memo as an in-memory service. If parallelizing across a cluster, it would make sense to store only keys above a certain length in a network-available memo service, as a significant time saving would be required to outweigh the cost of network latency. Keys below a certain length could continue to use a local in-memory memo.

### Quantum computing

It is possible that quantum computers may be able to bring this problem into the realm of feasibility. I've not yet attempted to create a quantum algorithm to solve this problem. Whether or not it is 'feasible' to obtain a quantum computer is a matter of opinion :)



## If not, optimize the implementation as much as possible

### Try to exploit the numerical structure of the problem

One example: My current solution already places bounds on the possible sums, based purely on the arithmetic impossibility of achieving a sum smaller than the largest number in the choices or larger than twice the largest number. It may be possible to improve on these bounds, thereby reducing the number of sums we explore. There may also be other properties of the structure which would allow better pruning of the search tree.

### Switch from top-down to bottom-up dynamic programming

Bottom-up dynamic programming techniques tend to be faster, with reduced stack unwinds and space usage of only O(n^2). The key is that one needs to find the correct ordering of sub-problems to solve. I was unable to find a formulation of the bottom-up(generative) algorithm in time provided, but it's likely there is one due to the numerical structure.

### Switch from stack to loop implementation

My current solution is recursive for the sake of clarity. This could be re-implemented as a loop in conjunction with a stack (in Javascript, an array). This would save time on memory stack winding and unwinding which is relatively expensive. In addition, it would prevent stack-overflow problems when the problem depth (999 for 500 rings) is deeper than stack depth (machine specific). 

### Optimize the memo

There are some sub-solutions which will never be needed once a super-solution is found. This fact could be used to clear out entries in the memo table that are no longer required and save memory. This should reduce the memo storage requirement from O(n^2) to O(n) as well since it is akin to keeping only leaf nodes in a tree.

Another option is to use something like an LRU cache to automatically evict solutions once the memo reaches a certain size. The downside is that this would cause increased exploration of solutions.

### Reduce memory overhead

Switching to a generator/streaming implementation of sumOptions would reduce the storage requirement of solutionExists to O(n) instead of O(n^2). This is because the options would not be stored, and only accessed when needed.
