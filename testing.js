const assert = require('assert');

class Test {
  constructor(module){
    this.module = module;
    this.currentContext = null;
    this.statObject = {
      'tests' : 0,
      'passes' : 0,
      'failures' : 0
    }
    this.results = new Map();
    this.printLineBreak();
    console.log('Preparing to run tests');
  }

  // called when a test passes
  pass(description) {
    this.results.get(this.currentContext).passes++;
    this.results.get(this.currentContext).tests++;
    console.log(`[PASSED] ${description}`);
  }

  // called when a test fails
  fail(description, error) {
    this.results.get(this.currentContext).failures++;
    this.results.get(this.currentContext).tests++;
    var message = error.message;
    if (error.name != 'AssertionError') error.stack;
    console.log(`[FAILED] ${description}\n${message}`);
  }

  printLineBreak(){
    console.log('---------------');
  }

  // print a summary
  summarize() {
    for (var result of this.results) {
      this.printLineBreak();
      console.log(`tested: ${result[0]}`);
      console.log(result[1]);
    }
  }

  // create a context for a group of tests
  context(target, scopedTests) {
    this.printLineBreak();
    console.log(`Testing ${target}...`);

    this.currentContext = target;
    this.results.set(target, Object.assign({}, this.statObject, this.results.get(target)));

    var testTarget = this.module[target];
    var testRunner = this;

    scopedTests(function(description, testScript, relationship, expected) {
      let fullDescription = `it should ${description}`;
      testRunner.printLineBreak();
      try {
        let result = testScript(testTarget, assert);
        if (relationship != undefined) assert[relationship](result, expected);
        testRunner.pass(fullDescription);
      } catch (error) {
        testRunner.fail(fullDescription, error);
      }
    })
  }
}

exports.Test = Test;
