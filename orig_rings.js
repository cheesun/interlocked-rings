class Memo {
  constructor() {
    this.table = {};
    this.hit = 0;
    this.miss = 0;
  }
  findOrSet(params, toRun) {
    var key = params.toString();
    if (this.table[key] == undefined) {
      this.miss++;
      this.table[key] = toRun();
    } else this.hit++;
    return this.table[key];
  }
  report(){
    var totalCalls = this.hit + this.miss;
    console.log({
      'totalCalls': totalCalls,
      'cache hit ratio' : this.hit/totalCalls
    })
  }
}
var memo = new Memo();

var solutionsForSum = function(target, usedSet, choicesSet) {
  // console.log(`solutionsForSum(${target}, [${[...usedSet]}], [${[...choicesSet]}])`);

  var choicesAvailable = [];
  for (var choice of choicesSet) {
    if (usedSet.has(choice)) continue;
    choicesAvailable.push(choice);
  }

  return memo.findOrSet([target, choicesAvailable], function () {
    var result = [];
    // special case when there's 1 item left
    var lastItem = choicesAvailable.length == 1
    for (var choice of choicesAvailable) {

      if (lastItem && choice == target) {
        result.push([choice]);
        break;
      }

      var counterpart = target - choice;
      if (choice != counterpart && !usedSet.has(counterpart) && choicesSet.has(counterpart)) {
        result.push([choice, counterpart]);
      }
    }
    // console.log(result);
    return result;
  });

}

var solutionExistsForSum = function(sum, choices) {
  // console.log(`solutionExistsForSum(${sum}, ${[...choices]})`);
  var used = []; // stack for our candidate solution
  var choicesSet = new Set(choices);
  var branches = [solutionsForSum(sum, new Set(used), choicesSet)];

  while (true) {
    // console.log(`used = [${used}]`);
    // console.log(branches);

    if (branches.length == 0) {
      console.log(`no solution for sum ${sum}`);
      return false;
    }

    if (used.length == choicesSet.size) {
      console.log(`solution for sum ${sum}: ${used.reduce((a, b)=>a.concat(b), [])}`)
      return true;
    }

    nodesExplored++;
    var candidateSolution = branches[branches.length-1].pop();

    if(candidateSolution == undefined) {
      used.pop();
      used.pop();
      branches.pop();
    } else {
      // console.log('------------');
      // console.log(candidateSolution);
      used.push(...candidateSolution);

      var currentSum = sum;
      if (used.length != 0) currentSum = sum - used[used.length - 1];

      branches.push(solutionsForSum(currentSum, new Set(used), choicesSet))
    }

  }
}


var solveRings = function(numberOfRings) {
  var numberOfPositions = (numberOfRings * 2) - 1;
  var choices = [];
  for (var i=1; i<=numberOfPositions; i++) choices.push(i);

  var minimumSum, maximumSum = numberOfPositions * 2;

  // get lowest
  for (var sum = numberOfPositions + 1; sum < maximumSum; sum ++) {
    if (solutionExistsForSum(sum, new Set(choices))) {
      minimumSum = sum;
      break;
    }
  }

  for (var sum = maximumSum - 1; sum > minimumSum; sum --) {
    if (solutionExistsForSum(sum, new Set(choices))) {
      maximumSum = sum;
      break;
    }
  }

  return { 'min' : minimumSum, 'max' : maximumSum };
}


var factorial = function(n) {
  var result = 1;
  for (var i=0; i<n; i++) result *= n;
  return result;
}

var nodesExplored = 0;
var perf = [{'explored': 1, 'total': 1, 'percentage':100, 'growth':NaN}];
for (var i=15; i<16; i++) {
  nodesExplored = 0;
  var startTime = Date.now();
  console.log(solveRings(i));
  var endTime = Date.now();
  var metrics = {
    'explored': nodesExplored,
    'total' : factorial(i * 2 - 1),
    'elapsed' : (endTime - startTime) / 1000
  }
  metrics.percentage = 100 * metrics.explored / metrics.total;
  metrics.growth = metrics.explored / perf[perf.length-1].explored;
  console.log(metrics);
  memo.report();
  perf.push(metrics);
}

module.exports = {
  'solutionsForSum' : solutionsForSum,
  'solutionExistsForSum' : solutionExistsForSum,
  'solveRings' : solveRings
}
