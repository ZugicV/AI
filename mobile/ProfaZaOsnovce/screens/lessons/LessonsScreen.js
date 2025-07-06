import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function LessonsScreen({ navigation }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    async function fetchLessons() {
      const querySnapshot = await getDocs(collection(db, 'lessons'));
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setLessons(list);
    }
    fetchLessons();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList data={lessons} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
}
