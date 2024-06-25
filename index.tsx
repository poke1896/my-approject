import { AppRegistry } from 'react-native';
import App from './App';
import appConfig from './app.json';

// Extrae 'name' del objeto 'expo'
const appName = appConfig.expo.name;

AppRegistry.registerComponent(appName, () => App);
