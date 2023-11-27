import './src/lib/dayjs';
import { StatusBar, Button } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'
import * as Notifications from 'expo-notifications';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  }),
})

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  async function scheduleNotification() {
    const trigger = new Date(Date.now());
    // trigger.setMinutes(trigger.getMinutes() + 1)
    // trigger.setSeconds(trigger.getSeconds() + 1)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Ola, Victor😒',
        body: 'Voce praticou os habitos hoje?'
      },
      trigger
    })
  }

  async function getNotification() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    console.log(schedule)
  }


  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }
  return (
    <>
      {/* <Button title='Enviar' onPress={scheduleNotification} />
      <Button title='Angendadas' onPress={getNotification} /> */}
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
    </>
  );
}


