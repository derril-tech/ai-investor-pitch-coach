// Created automatically by Cursor AI (2024-08-24)
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { z } from 'zod';

export class PitchCoachClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001/v1', token?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  async health(): Promise<any> {
    const response: AxiosResponse = await this.client.get('/health');
    return response.data;
  }

  // Add more API methods here as they are implemented
}
