const bus = require("../eventBus/bus");
const counter = require("../store/discountCounter");
const { log } = require("../utils/logger");

bus.on("PRICING_DONE", (data) => {
  if (!data.eligible) {
    bus.emit("DISCOUNT_SKIPPED", data);
    return;
  }

  if (!counter.canApply()) {
    log("DiscountService", data.requestId, "QUOTA_EXCEEDED");
    bus.emit("DISCOUNT_QUOTA_EXCEEDED", data);
    return;
  }

  counter.increment();
  log("DiscountService", data.requestId, "DISCOUNT_APPLIED");
  bus.emit("DISCOUNT_APPLIED", data);
});

bus.on("ROLLBACK_DISCOUNT", (data) => {
  counter.decrement();
  log("DiscountService", data.requestId, "DISCOUNT_ROLLED_BACK");
});
