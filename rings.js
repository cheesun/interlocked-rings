memoLib = require('./memo');

// produce pairs of numbers within the available choices that sum to the target
function sumOptions(target, usedSet, choicesSet, memo) {
  var choicesAvailable = [];
  for (var choice of choicesSet) { if (!usedSet.has(choice)) choicesAvailable.push(choice) };


  // if we've already been asked for these before, just return what's in the memo
  return memo.memoize('sumOptions', [target, choicesAvailable], function () {
    if (choicesSet.size - usedSet.size < 2) {
      // console.log(`sumOptions(${target}, [${[...usedSet]}], [${[...choicesSet]}])`);
      throw RangeError('need more than 2 options');
    }

    var result = [];
    for (var choice of choicesSet) {
      if(usedSet.has(choice)) continue;
      var counterpart = target - choice;
      if (choice != counterpart && !usedSet.has(counterpart) && choicesSet.has(counterpart)) {
        result.push([choice, counterpart]);
      }
    }
    return result;
  });
}

// recursively find a solution and report it back up the call chain
function _solutionExists(sum, target, used, choices, memo) {
  var choicesAvailable = [];
  for (var choice of choices) { if (!used.has(choice)) choicesAvailable.push(choice) };

  // if we've explored this part of the solution tree before we should know whether there was a solution
  return memo.memoize('solutionExists', [sum, target, choicesAvailable], function() {
    var nRemaining = choicesAvailable.length;

    // if we don't have enough choices for another ring,
    // we should be able to figure out whether we've found a solution
    if (nRemaining == 0) return true;
    if (nRemaining == 1) {
      for (var choice of choices) { if (!used.has(choice) && choice == target) return true };
      return false;
    }

    // try the different options that sum to the required amount
    for (option of sumOptions(target, used, choices, memo)) {
      var newUsed = new Set(used);
      newUsed.add(option[0]);
      newUsed.add(option[1]);
      if (_solutionExists(sum, sum - option[1], newUsed, choices, memo)) return true;
    }
    return false;
  })

}

function solutionExists(sum, choices, memo) {
  return _solutionExists(sum, sum, new Set(), choices, memo);
}

// solve the interlocking rings problem for numberOfRings rings,
// by trying to find a solution for different sums
// it's also possible to pass in an optional memo to allow caching of solutions from multiple runs
function solve(numberOfRings, memo) {
  if (memo == undefined) memo = new memoLib.Memo(); // else reuse an existing memo

  // build the list of choices
  var numberOfPositions = (numberOfRings * 2) - 1;
  var choices = [];
  for (var i = 1; i <= numberOfPositions; i++) choices.push(i);

  // these are some rough ranges for where the min and max should lie
  var minimumPossibleSum = numberOfPositions;
  var maximumPossibleSum = numberOfPositions * 2 - 1;
  var minimumSum, maximumSum;

  // try sums from the theoretical minimum,
  // the first one we find is the minimum sum
  for (var sum = minimumPossibleSum; sum <= maximumPossibleSum; sum ++) {
    if (solutionExists(sum, new Set(choices), memo)) {
      // console.log(`found solution for sum = ${sum}`);
      minimumSum = sum;
      maximumSum = sum;
      break;
    } else {
      // console.log(`no solution for sum = ${sum}`);
    }
  }

  // try sums from the theoretical maximum,
  // the first one we find is the maximum sum
  for (var sum = maximumPossibleSum; sum > minimumSum; sum --) {
    if (solutionExists(sum, new Set(choices), memo)) {
      // console.log(`found solution for sum = ${sum}`);
      maximumSum = sum;
      break;
    } else {
      // console.log(`no solution for sum = ${sum}`);
    }
  }

  return { 'min' : minimumSum, 'max' : maximumSum };
}

exports.solve = solve;
