const bookings = new Map();

module.exports = {
  save(data) {
    if (data.simulateFailure === "DB") {
      throw new Error("DB_WRITE_FAILED");
    }
    bookings.set(data.referenceId, data);
  }
};
