const async = require("async");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @param {Array<string>} _keys Dependency server's names
 * @class
 * @return {Ticker} Instance
 */
function Ticker(_keys) {
  const stats = {};
  const keys = new Set(_keys);
  for (const k of keys) stats[k] = false;

  /**
   * read/write status value
   * @memberof Ticker
   * @instance
   * @param {string} key server's unique key
   * @param {boolean} [value] server's status value
   *
   * @return {boolean} server's current status value
   */
  function status(key, value) {
    if (!keys.has(key)) throw Error(`The key non-exists: ${key}`);
    if (value !== undefined) stats[key] = Boolean(value);

    return stats[key];
  }

  /**
   * Dependency detection runner
   * @memberof Ticker
   * @instance
   * @param {AsyncFunction} hitFn detection function return true or false
   * @param {string} key server‘s key
   * @param {number} sleepMS two times called interval ms
   *
   * @return {AsyncFunction} detection runner be called by async.forever
   */
  const tock = (hitFn, key, sleepMS) => {
    if (!keys.has(key)) throw Error(`The key non-exists: ${key}`);
    sleepMS = Math.max(1000, sleepMS | 0);

    return async () => {
      // 执行心跳函数
      const value = await hitFn();
      status(key, value);

      await sleep(sleepMS);
    };
  };

  /**
   * For a function add dependency detection
   * @memberof Ticker
   * @instance
   * @param {function} fn Orig function, it will be add dependency detection
   * @param {string} key dependency server's key
   * @param {number} [sleepMS=100] dependency detection interval ms
   *
   * @return {function} 返回处理后的函数
   */
  const runner = (fn, key, sleepMS = 1000) => {
    // 最小10毫秒
    if (sleepMS < 10) sleepMS = 10;
    const run = async (...args) => {
      await async.until(
        async () => status(key),
        async () => {
          await sleep(sleepMS);
        }
      );

      return fn(...args);
    };

    return run;
  };

  return { status, runner, tock };
}

module.exports = Ticker;
