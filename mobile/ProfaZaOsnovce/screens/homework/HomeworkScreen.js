import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function HomeworkScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const qs = await getDocs(collection(db, 'homework'));
      const list = [];
      qs.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setTasks(list);
    }
    fetchTasks();
  }, []);

  return (
    <View>
      <FlatList data={tasks} keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SubmitHomework', { taskId: item.id })}>
            <Text>{item.title} - {item.dueDate}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}
