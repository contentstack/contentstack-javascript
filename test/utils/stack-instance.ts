import dotenv from 'dotenv';
import * as contentstack from '../../src/lib/contentstack';
import { StackConfig } from '../../src/lib/types';

dotenv.config();

function stackInstance() {
  const params: StackConfig = {
    apiKey: process.env.API_KEY || '',
    deliveryToken: process.env.DELIVERY_TOKEN || '',
    environment: process.env.ENVIRONMENT || '',
  };

  return contentstack.Stack(params);
}

export { stackInstance };
