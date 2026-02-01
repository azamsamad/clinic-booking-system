let DAILY_LIMIT = 2;
let count = 0;

module.exports = {
  canApply() {
    console.log(
      `[COUNTER CHECK] Used: ${count}, Limit: ${DAILY_LIMIT}`
    );
    return count < DAILY_LIMIT;
  },
  increment() {
    count++;
    console.log(
      `[COUNTER INCREMENT] New count: ${count}`
    );
  },
  decrement() {
    if (count > 0) count--;
    console.log(
      `[COUNTER ROLLBACK] New count: ${count}`
    );
  },
  status() {
    return { count, DAILY_LIMIT };
  }
};
