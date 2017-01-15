'use strict'

// my implementation of Johnson Trotter algorithm for generating permutations
class Permutator {
  constructor(choices) {
    this.more = true;
    this.items = choices.slice().sort().map(function (x) {
      return {
        'value': x,
        'left' : true
      }
    })
  }

  next() {
    if (!this.more) return undefined;
    var output = this.items.map(function(x) {return x.value});
    var moved = this.move();
    if (moved != null) {
      this.flip(moved);
    } else {
      this.more = false;
    }
    return output;
  }

  move() {
    var max = { 'value' : -1 };
    var pos = undefined;
    for(var i=0; i < this.items.length; i++) {
      var current = this.items[i];
      if (current.value > max.value) {
        if (
          (current.left && i > 0 && this.items[i-1].value < current.value) ||
          (!current.left && i < this.items.length - 1 && this.items[i+1].value < current.value)
          ) {
            max = current;
            pos = i;
          }
      }
    }

    if (pos == undefined) return null;
    if (max.left) {
      this.items[pos] = this.items[pos-1];
      this.items[pos-1] = max;
    } else {
      this.items[pos] = this.items[pos+1];
      this.items[pos+1] = max;
    }
    return max;
  }

  flip(moved) {
    this.items.forEach(
      function (current) {
        if (current.value > moved.value) {
          current.left = !current.left;
        }
      }
    );
  }
}

var sumWindow = function(array, start, length) {
  if(array.length - start - length < 0) throw RangeError('impossible!');
  return array.slice(start, start + length).reduce(function(sum, current) { return sum + current }, 0);
}

var checkValid = function(arrangement) {
  var firstRing = sumWindow(arrangement, 0, 2);
  var lastRing = sumWindow(arrangement, arrangement.length - 2, 2);
  if (firstRing != lastRing) return false;

  var sum = firstRing;
  for (var i=1; i<=arrangement.length-4; i+=2) {
    var current = sumWindow(arrangement, i, 3);
    if (current != sum) return false;
  }

  return sum;
}

var interlockingRings = function(numberOfRings) {
  var numberOfChoices = (numberOfRings - 1) * 2 + 1;
  var choices = [];
  for (var i=1; i<=numberOfChoices; i++) choices.push(i);

  var permutations = new Permutator(choices);

  var lastCombo = null;
  var count = -1;
  var min = numberOfChoices * 2;
  var max = 1;

  while (true) {
    lastCombo = permutations.next();
    if (lastCombo != undefined) {
      var sum = checkValid(lastCombo);
      if (sum) {
        var odd = 0;
        var even = 0;
        for (var i=0; i<lastCombo.length; i++) {
          if (i%2 == 0) even += lastCombo[i];
          else odd += lastCombo[i];
        }
        console.log(`sum(${lastCombo}) = ${sum}`);
        min = Math.min(min, sum);
        max = Math.max(max, sum);
      }
      count ++;
    } else break;
  }

  console.log(`Min was ${min} and max was ${max} in ${count} possibilities`);
}

interlockingRings(5);
