import environmentConfiguration from './environment.local';

export default function getConfiguration() {
  const environment = process.env.NODE_ENV;
  if (environment) {
    return environmentConfiguration;
  }
  throw new Error('Env not set');
}
