const Ticker = require("../../");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Ticker module", () => {
  it("status method", async () => {
    const tick = new Ticker(["key1", "key2"]);
    expect(tick.status("key1")).toBe(false);
    expect(tick.status("key2")).toBe(false);

    expect(tick.status("key1", true)).toBe(true);
    expect(tick.status("key2", true)).toBe(true);
    expect(tick.status("key1")).toBe(true);
    expect(tick.status("key2")).toBe(true);

    expect(tick.status("key1", false)).toBe(false);
    expect(tick.status("key2", false)).toBe(false);
    expect(tick.status("key1")).toBe(false);
    expect(tick.status("key2")).toBe(false);

    expect(tick.status("key1", 34)).toBe(true);
    expect(tick.status("key2", "string")).toBe(true);
    expect(tick.status("key1")).toBe(true);
    expect(tick.status("key2")).toBe(true);

    expect(tick.status("key1", null)).toBe(false);
    expect(tick.status("key2", 0)).toBe(false);
    expect(tick.status("key1")).toBe(false);
    expect(tick.status("key2")).toBe(false);

    expect(() => {
      tick.status("key3");
    }).toThrow();

    expect(() => {
      tick.status("key4", true);
    }).toThrow();
  });

  it("runner method, AsyncFunction", async () => {
    const tick = new Ticker(["key1", "key2"]);

    const fn = async () => {
      await sleep(100);
      return tick.status("key1");
    };

    // 未来某个时刻状态恢复，代码会继续执行
    setTimeout(() => {
      tick.status("key1", true);
    }, 3000);

    const fn1 = tick.runner(fn, "key1");
    const res = await fn1();
    expect(res).toBe(true);
  });

  it("runner method, normal function", async () => {
    const tick = new Ticker(["key1", "key2"]);

    const fn = () => tick.status("key1");

    // 未来某个时刻状态恢复，代码会继续执行
    setTimeout(() => {
      tick.status("key1", true);
    }, 1000);

    const fn1 = tick.runner(fn, "key1", 5);
    const res = await fn1();
    expect(res).toBe(true);
  });

  it("tock method", async () => {
    const tick = new Ticker(["key1", "key2"]);
    let status = false;

    const tock = async () => {
      await sleep(20);
      return status;
    };

    expect(() => {
      tick.tock(tock, "key3", 100);
    }).toThrow();

    const tockFn = tick.tock(tock, "key1", 1500);
    await tockFn();

    expect(tick.status("key1")).toBe(false);
    status = true;
    await tockFn();

    expect(tick.status("key1")).toBe(true);
  });
});
