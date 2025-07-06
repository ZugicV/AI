import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeworkScreen from './HomeworkScreen';
import SubmitHomeworkScreen from './SubmitHomeworkScreen';

const Stack = createNativeStackNavigator();

export default function HomeworkStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeworkHome" component={HomeworkScreen} options={{ title: 'Domaći zadaci' }} />
      <Stack.Screen name="SubmitHomework" component={SubmitHomeworkScreen} options={{ title: 'Predaj domaći' }} />
    </Stack.Navigator>
  );
}
