import * as mqtt from 'mqtt';
import { DeviceService } from '../services/DeviceService';
import { MQTTHandler } from './handlers';

export class MQTTBroker {
  private client!: mqtt.Client; // This tells TypeScript that it will be initialized later.
  private deviceService: DeviceService;
  private handler: MQTTHandler;

  constructor() {
    this.deviceService = new DeviceService();
    this.handler = new MQTTHandler(this.deviceService);
  }

  connect() {
    this.client = mqtt.connect('mqtt://localhost:1883');

    this.client.on('connect', () => {
      console.log('MQTT Broker connected');
      this.subscribeToTopics();
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message);
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });
  }

  private subscribeToTopics() {
    this.client.subscribe('smarttank/+/data');
    this.client.subscribe('smarttank/+/status');
    this.client.subscribe('smarttank/+/command');
  }

  private handleMessage(topic: string, message: Buffer) {
    const [prefix, deviceId, type] = topic.split('/');
    
    try {
      const payload = JSON.parse(message.toString());
      
      switch (type) {
        case 'data':
          this.handler.handleData(deviceId, payload);
          break;
        case 'status':
          this.handler.handleStatus(deviceId, payload);
          break;
        case 'command':
          this.handler.handleCommand(deviceId, payload);
          break;
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  }
}