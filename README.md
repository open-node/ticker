# @open-node/ticker
Record log info to logfile, info log by date, error log by error.code

[![Build status](https://travis-ci.com/open-node/ticker.svg?branch=master)](https://travis-ci.org/open-node/ticker)
[![codecov](https://codecov.io/gh/open-node/ticker/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/ticker)

# Installation
<pre>npm i @open-node/ticker --save</pre>

# Usage
<pre>
const Ticker = require('@open-node/ticker');

const ticker = Ticker(['server1', 'server2', 'server3']);

// Upload server1 status with call checkServer1AsyncFn per 2 second
ticker.tock(checkServer1AsyncFn, 'server1', 2 * 1000);

cosnt server1Availability = ticker.status('server1'); // server1Availability is true or false

const fn1IfServer1Availability = ticker.runner(fn1, 'server1');

await fn1IfServer1Availability(); // fn1 be called when server1 is enabled unless fn1 will be wait, unit server1 is enabled
</pre>



<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Ticker][1]
    -   [Parameters][2]
    -   [status][3]
        -   [Parameters][4]
    -   [tock][5]
        -   [Parameters][6]
    -   [runner][7]
        -   [Parameters][8]

## Ticker

### Parameters

-   `_keys` **[Array][9]&lt;[string][10]>** Dependency server's names

Returns **[Ticker][11]** Instance

### status

read/write status value

#### Parameters

-   `key` **[string][10]** server's unique key
-   `value` **[boolean][12]?** server's status value

Returns **[boolean][12]** server's current status value

### tock

Dependency detection runner

#### Parameters

-   `hitFn` **AsyncFunction** detection function return true or false
-   `key` **[string][10]** server‘s key
-   `sleepMS` **[number][13]** two times called interval ms

Returns **AsyncFunction** detection runner be called by async.forever

### runner

For a function add dependency detection

#### Parameters

-   `fn` **[function][14]** Orig function, it will be add dependency detection
-   `key` **[string][10]** dependency server's key
-   `sleepMS` **[number][13]** dependency detection interval ms (optional, default `100`)

Returns **[function][14]** 返回处理后的函数

[1]: #ticker

[2]: #parameters

[3]: #status

[4]: #parameters-1

[5]: #tock

[6]: #parameters-2

[7]: #runner

[8]: #parameters-3

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[11]: #ticker

[12]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[14]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
