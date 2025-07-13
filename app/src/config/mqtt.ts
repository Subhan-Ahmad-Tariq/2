export const MQTT_CONFIG = {
    brokerUrl: 'mqtt://broker.hivemq.com',
    clientId: 'smart_tank_client',
    options: {
      keepalive: 60,
      clean: true,
      reconnectPeriod: 1000,
    },
  };