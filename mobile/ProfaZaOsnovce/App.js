import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import LessonsStack from './screens/lessons/LessonsStack';
import CalendarScreen from './screens/CalendarScreen';
import HomeworkScreen from './screens/homework/HomeworkStack';
import ChatStack from './screens/chat/ChatStack';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Lessons: 'book',
            Calendar: 'calendar',
            Homework: 'pencil',
            Chat: 'chatbox',
            Profile: 'person'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Lessons" component={LessonsStack} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Homework" component={HomeworkScreen} />
        <Tab.Screen name="Chat" component={ChatStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
