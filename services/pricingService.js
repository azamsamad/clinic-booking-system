const bus = require("../eventBus/bus");
const { log } = require("../utils/logger");
const catalog = require("../store/serviceCatalog");

bus.on("BOOKING_REQUESTED", (data) => {
  const services = data.services.map(s => s.trim());

  let basePrice = 0;
  let effectivePrice = 0;

  services.forEach(service => {
    const item = catalog[data.gender][service];
    basePrice += item.basePrice;
    effectivePrice += item.effectivePrice;
  });

  const today = new Date().toISOString().slice(5, 10);
  const birthday = data.dob.slice(5, 10);

  const eligible =
    basePrice > 1000 ||
    (data.gender === "Female" && today === birthday);

  log("PricingService", data.requestId, "PRICING_DONE", {
    basePrice,
    effectivePrice,
    eligible
  });

  bus.emit("PRICING_DONE", {
    ...data,
    basePrice,
    effectivePrice,
    eligible
  });
});
