const DAY_IN_MS = 24 * 60 * 60 * 1000;

let count = 0;
let lastResetTime = Date.now();

function resetIfNeeded() {
  const now = Date.now();
  if (now - lastResetTime >= DAY_IN_MS) {
    count = 0;
    lastResetTime = now;
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        service: "DiscountCounter",
        event: "DAILY_RESET",
        message: "Discount counter reset after 24 hours"
      })
    );
  }
}

module.exports = {
  increment() {
    resetIfNeeded();
    count++;
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        service: "DiscountCounter",
        event: "INCREMENT",
        currentCount: count
      })
    );
  },

  decrement() {
    resetIfNeeded();
    count = Math.max(0, count - 1);
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        service: "DiscountCounter",
        event: "DECREMENT",
        currentCount: count
      })
    );
  },

  getCount() {
    resetIfNeeded();
    return count;
  },

  forceResetForDemo() {
    count = 0;
    lastResetTime = Date.now();
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        service: "DiscountCounter",
        event: "MANUAL_RESET"
      })
    );
  }
};
