import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-notifications';

export const registerForPushNotificaitons = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Define the trigger shape
const timeIntervalTrigger = {
  type: 'timeInterval',
  seconds: 10,
  repeats: false,
} as Notifications.NotificationTriggerInput;

export const scheduleLocalNotificaiton = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "👀 Don't forget!",
      body: 'Check your favorite users today!',
    },
    trigger: timeIntervalTrigger,
  });
};
