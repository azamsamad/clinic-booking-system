const readline = require("readline");
const { v4: uuid } = require("uuid");
const bus = require("../eventBus/bus");
const catalog = require("../store/serviceCatalog");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(res => rl.question(q, res));
}

async function runBooking() {
  const name = await ask("\nName: ");
  const gender = await ask("Gender (Male/Female): ");
  const dob = await ask("DOB (YYYY-MM-DD): ");

  console.log("\nAvailable services:");
  Object.entries(catalog[gender]).forEach(([service, item]) => {
    if (item.basePrice !== item.effectivePrice) {
      console.log(
        `- ${service}: ₹${item.effectivePrice} (original ₹${item.basePrice})`
      );
    } else {
      console.log(`- ${service}: ₹${item.effectivePrice}`);
    }
  });

  const services = (await ask(
    "\nSelect services (comma-separated, e.g. XRay,ECG): "
  )).split(",");

  const requestId = uuid();

  return new Promise(async (resolve) => {

    const onQuotaExceeded = async (data) => {
      const ans = await ask(
        "❌ Discount quota reached. Continue without discount? (y/n): "
      );
      if (ans.toLowerCase() === "y") {
        bus.emit("DISCOUNT_SKIPPED", data);
      } else {
        console.log("❌ Booking cancelled");
        cleanup();
        resolve();
      }
    };

    const onSuccess = (data) => {
      console.log("\n✅ Booking confirmed");
      console.log("Reference ID:", data.referenceId);
      console.log("Final Price: ₹" + data.finalPrice);
      cleanup();
      resolve();
    };

    function cleanup() {
      bus.off("DISCOUNT_QUOTA_EXCEEDED", onQuotaExceeded);
      bus.off("BOOKING_SUCCESS", onSuccess);
    }

    bus.on("DISCOUNT_QUOTA_EXCEEDED", onQuotaExceeded);
    bus.on("BOOKING_SUCCESS", onSuccess);

    bus.emit("BOOKING_REQUESTED", {
      requestId,
      name,
      gender,
      dob,
      services
    });
  });
}

(async () => {
  console.log("🚀 Clinic Booking System Started");
  console.log("📦 Discount counter is GLOBAL for this run");

  while (true) {
    await runBooking();
    const again = await ask("\nDo you want to make another booking? (y/n): ");
    if (again.toLowerCase() !== "y") {
      console.log("\n👋 Exiting system");
      rl.close();
      process.exit(0);
    }
  }
})();
