module.exports.log = (service, requestId, event, extra = {}) => {
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    service,
    requestId,
    event,
    ...extra
  }));
};
