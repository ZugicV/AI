import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ChatListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      const qs = await getDocs(collection(db, 'chatGroups'));
      const list = [];
      qs.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setGroups(list);
    }
    fetchGroups();
  }, []);

  return (
    <View>
      <FlatList data={groups} keyExtractor={i => i.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { groupId: item.id })}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}
