const bus = require("../eventBus/bus");
const counter = require("../store/discountCounter");
const { log } = require("../utils/logger");

const DAILY_LIMIT = 2; // configurable daily quota

bus.on("PRICING_DONE", (data) => {
  if (!data.eligible) {
    bus.emit("NO_DISCOUNT", data);
    return;
  }

  // auto-resets the counter if 24 hours have passed
  const currentCount = counter.getCount();

  if (currentCount >= DAILY_LIMIT) {
    log("DiscountService", data.requestId, "QUOTA_EXCEEDED", {
      currentCount,
      DAILY_LIMIT
    });
    bus.emit("DISCOUNT_QUOTA_EXCEEDED", data);
    return;
  }

  counter.increment();

  log("DiscountService", data.requestId, "DISCOUNT_APPLIED", {
    currentCount: counter.getCount()
  });

  bus.emit("DISCOUNT_APPLIED", data);
});

bus.on("ROLLBACK_DISCOUNT", (data) => {
  counter.decrement();

  log("DiscountService", data.requestId, "DISCOUNT_ROLLED_BACK", {
    currentCount: counter.getCount()
  });
});
