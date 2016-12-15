const sendToAddon = require('./send-to-addon');
const appData = require('./app-data');

module.exports = sendMetricsEvent;

function sendMetricsEvent(object, method) {
  sendToAddon({
    action: 'metrics-event',
    payload: {
      object: object,
      method: method,
      domain: appData.domain
    }
  });
}
