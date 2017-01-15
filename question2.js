const rings = require('./rings');
const testing = require('./testing'); // I put together a simple testing library so that there are no external dependencies

var test = new testing.Test(rings);

test.context('solve', function(itShould) {
  // does it solve the problem? the expected answers are verified by a separate program (interlock.js)
  itShould('find correct solution with 5 rings',
    (subject) => subject(5),
    'deepEqual', { 'min' : 11, 'max' : 14 }, 'deepEqual'
  );

  itShould('find correct solution with 6 rings',
    (subject) => subject(6),
    'deepEqual', { 'min' : 14, 'max' : 17 }
  );

  // special cases
  itShould('properly handle case with negative rings',
    (subject) => subject(-1),
    'deepEqual', {'min' : undefined, 'max' : undefined}
  );

  itShould('properly handle case with 0 rings',
    (subject) => subject(0),
    'deepEqual', {'min' : undefined, 'max' : undefined}
  );

  itShould('find correct solution with 1 rings',
    (subject) => subject(1),
    'deepEqual', {'min' : 1, 'max' : 1}
  );

  itShould('find that there are no solutions with 2 rings',
    (subject) => subject(2),
    'deepEqual', {'min' : undefined, 'max' : undefined}
  );

  // test memo functionality
  itShould('allow the use of an externally defined memo', (subject, assert) => {
    let memoLib = require('./memo');
    let memo = new memoLib.Memo();
    let result = subject([5], memo);
    assert.deepEqual(result, { 'min' : 11, 'max' : 14 });
    assert(0 < memo.hit);
    assert(0 < memo.miss);
  });

  itShould('require less processing if the memo contains cached answers', (subject, assert) => {
    let memoLib = require('./memo');
    let memo = new memoLib.Memo();
    subject([5], memo);
    let lookupsAfterFirstRun = memo.hit + memo.miss;
    subject([5], memo);
    assert(lookupsAfterFirstRun < memo.hit + memo.miss);
    assert((memo.hit + memo.miss) / lookupsAfterFirstRun < 1.05, 'the memo should save 95% of the work');

  });
});

test.summarize();
