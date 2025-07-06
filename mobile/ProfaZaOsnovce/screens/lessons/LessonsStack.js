import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LessonsScreen from './LessonsScreen';
import LessonDetailScreen from './LessonDetailScreen';

const Stack = createNativeStackNavigator();

export default function LessonsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LessonsHome" component={LessonsScreen} options={{ title: 'Lekcije' }} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ title: 'Detalji lekcije' }} />
    </Stack.Navigator>
  );
}
