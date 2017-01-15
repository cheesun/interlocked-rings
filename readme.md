Interlocked Rings
=================

This package includes my answers to the 3 questions posed in the Interlocked Rings problem (see Interlocked Rings.pdf).

The code is written in node.js (ES2015) and was developed with v7.4.0. No external dependencies beyond the node standard library are required.

Files
-----

 - readme.md - this file
 - Interlocked Rings.pdf - original question posed here
 - question1.js - outputs the min and max sums for 5 interlocking rings
 - question2.js - tests for rings.js
 - question3.md - analysis of solutions for 500 rings
 - rings.js - implementation of interlocking rings solver
 - memo.js - simple memo implementation, used by rings.js
 - testing.js - simple test framework
 - interlock.js - brute force implementation used for cross-checking

Running the code
----------------

### Question 1

    > node question1.js
    { min: 11, max: 14 }

### Question 2

	> node question2.js
    ---------------
    Preparing to run tests
    ---------------
    Testing solve...
    ---------------
    [PASSED] it should find correct solution with 5 rings
    ---------------
    [PASSED] it should find correct solution with 6 rings
    ---------------
    [PASSED] it should properly handle case with negative rings
    ---------------
    [PASSED] it should properly handle case with 0 rings
    ---------------
    [PASSED] it should find correct solution with 1 rings
    ---------------
    [PASSED] it should find that there are no solutions with 2 rings
    ---------------
    [PASSED] it should allow the use of an externally defined memo
    ---------------
    [PASSED] it should require less processing if the memo contains cached answers
    ---------------
    tested: solve
    { tests: 8, passes: 8, failures: 0 }

Question 3
---------------

Please see question3.md
