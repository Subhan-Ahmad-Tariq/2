import * as mqtt from 'mqtt';
import config from 'config';
import logger from './logger';

interface MqttConfig {
  host: string;
  port: number;
}

class MQTTClient {
  private static instance: MQTTClient;
  private client: mqtt.MqttClient;
  private connected: boolean = false;

  private constructor() {
    const mqttConfig: MqttConfig = config.get('mqtt.broker');
    this.client = mqtt.connect(`mqtt://${mqttConfig.host}:${mqttConfig.port}`);

    this.client.on('connect', () => {
      this.connected = true;
      logger.info('MQTT Client connected');
    });

    this.client.on('error', (error) => {
      logger.error('MQTT Client error:', error);
    });

    this.client.on('close', () => {
      this.connected = false;
      logger.info('MQTT Client disconnected');
    });
  }

  static getInstance(): MQTTClient {
    if (!MQTTClient.instance) {
      MQTTClient.instance = new MQTTClient();
    }
    return MQTTClient.instance;
  }

  public publish(topic: string, message: string | Buffer): void {
    if (!this.connected) {
      throw new Error('MQTT Client not connected');
    }
    this.client.publish(topic, message, (error) => {
      if (error) {
        logger.error('Failed to publish message:', error);
      } else {
        logger.info(`Message published to topic "${topic}": ${message}`);
      }
    });
  }

  public subscribe(topic: string): void {
    if (!this.connected) {
      throw new Error('MQTT Client not connected');
    }
    this.client.subscribe(topic, (error) => {
      if (error) {
        logger.error('Failed to subscribe to topic:', error);
      } else {
        logger.info(`Subscribed to topic "${topic}"`);
      }
    });
  }

  public onMessage(callback: (topic: string, message: Buffer) => void): void {
    this.client.on('message', callback);
  }
}

export default MQTTClient.getInstance();