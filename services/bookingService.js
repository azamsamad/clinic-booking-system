const bus = require("../eventBus/bus");
const db = require("../store/bookingDB");
const { v4: uuid } = require("uuid");
const { log } = require("../utils/logger");

bus.on("DISCOUNT_APPLIED", (data) => {
  try {
    const finalPrice = data.effectivePrice * 0.88;
    const referenceId = uuid();

    db.save({ ...data, finalPrice, referenceId });

    log("BookingService", data.requestId, "BOOKING_SUCCESS", {
      finalPrice,
      referenceId
    });

    bus.emit("BOOKING_SUCCESS", { finalPrice, referenceId });

  } catch (err) {
    bus.emit("ROLLBACK_DISCOUNT", data);
    bus.emit("BOOKING_FAILED", { reason: err.message });
  }
});

bus.on("DISCOUNT_SKIPPED", (data) => {
  const referenceId = uuid();

  db.save({
    ...data,
    finalPrice: data.basePrice,
    referenceId
  });

  log("BookingService", data.requestId, "BOOKING_SUCCESS_NO_DISCOUNT");

  bus.emit("BOOKING_SUCCESS", {
    finalPrice: data.basePrice,
    referenceId
  });
});
