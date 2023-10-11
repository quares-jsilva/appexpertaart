/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native'
import App from './src/App'
import * as Notifications from './src/libs/notifications'
import { name as appName } from './app.json'
import 'intl-pluralrules';

Notifications.configure()

AppRegistry.registerComponent(appName, () => App)
