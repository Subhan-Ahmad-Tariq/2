// src/@types/prom-client.d.ts
declare module 'prom-client' {
  export class Counter {
    constructor(config: { name: string; help: string; labelNames?: string[] });
    inc(value?: number): void;
    labels(...labels: string[]): Counter;
  }

  export class Histogram {
    constructor(config: { name: string; help: string; labelNames?: string[]; buckets?: number[] });
    observe(value: number): void;
    startTimer(): () => void;
    labels(...labels: string[]): Histogram;
  }

  export class Gauge {
    constructor(config: { name: string; help: string; labelNames?: string[] });
    set(value: number): void;
    inc(value?: number): void;
    dec(value?: number): void;
    labels(...labels: string[]): Gauge;
  }

  export const register: {
    metrics(): Promise<string>;
    contentType: string;
    registerMetric(metric: any): void;
  };

  export function collectDefaultMetrics(config?: { prefix?: string; register?: any }): void;
}