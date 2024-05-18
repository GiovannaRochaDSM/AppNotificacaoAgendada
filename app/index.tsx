import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.addNotificationResponseReceivedListener(response => {
  const uri = response.notification.request.content.data.uri;
  if (uri) {
    Linking.openURL(uri);
  }
});

export default function Index() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('You need to enable permissions in settings.');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync(
      {projectId: 'app-notificacao-agendada-9692a'}
    )).data;
  }

  async function schedulePushNotification(date: Date) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Está na hora de sair!",
        body: 'Vá para a FATEC.',
        data: { uri: 'geo:0,0?q="Fatec Maua"' },
      },
      trigger: date,
    });
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to the notification scheduler app!</Text>
      <Button
        title="Schedule a Notification"
        onPress={() => schedulePushNotification(new Date(Date.now() + 10000))} // Schedules for 10 seconds later
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#ecf0f1',
  },
});
