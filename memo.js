class Memo {
  constructor() {
    this.table = new Map();
    this.hit = 0;
    this.miss = 0;
  }

  // generate a consistent key for use in the memo
  keyFor(scope, params) {
    return `${scope}|${params.map((x)=>x.toString()).join('|')}`;
  }

  // return value from memo, otherwise run the 'generate' function, store and return that
  memoize(scope, params, generate) {
    var key = this.keyFor(scope, params);
    var result = this.table.get(key);

    if (result == undefined) {
      // the value of a cache hit/miss is proportional to key length
      // which is in turn proportional to the number of remaining choices
      this.miss += key.length;
      result = generate();
      this.table.set(key, result);
    } else this.hit += key.length;
    return result;
  }

  // print some stats about the memo
  report() {
    console.log({
      'ratio' : this.hit / (this.hit + this.miss),
      'hit' : this.hit,
      'miss' : this.miss,
    });
  }
}

exports.Memo = Memo;
