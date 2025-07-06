import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function CalendarScreen() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function fetchClasses() {
      const qs = await getDocs(collection(db, 'schedule'));
      const list = [];
      qs.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setClasses(list);
    }
    fetchClasses();
  }, []);

  return (
    <View>
      <FlatList data={classes} keyExtractor={i => i.id} renderItem={({ item }) => (
        <Text>{item.date} {item.time} - {item.type}</Text>
      )} />
    </View>
  );
}
