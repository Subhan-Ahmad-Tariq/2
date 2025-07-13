import mqtt, { MqttClient } from 'mqtt';

const MQTT_URL = 'wss://broker.hivemq.com/mqtt'; // Use "wss://" for web compatibility
let client: MqttClient;

export const connectMQTT = (onMessage: (topic: string, message: string) => void) => {
  client = mqtt.connect(MQTT_URL);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('message', (topic: string, message: Buffer) => {
    onMessage(topic, message.toString()); // ✅ Ensures message is converted from Buffer
  });
};

export const publishMessage = (topic: string, message: string) => {
  if (client) {
    client.publish(topic, message);
  }
};

export const subscribeToTopic = (topic: string) => {
  if (client) {
    client.subscribe(topic, (err: Error | null) => {  // ✅ Fix: Allow `null`
      if (err) {
        console.error(`Failed to subscribe to topic: ${topic}`, err);
      }
    });
  }
};
