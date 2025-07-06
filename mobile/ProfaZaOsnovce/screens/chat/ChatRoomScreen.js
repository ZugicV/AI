import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Button, Text } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function ChatRoomScreen({ route }) {
  const { groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'chatGroups', groupId, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, snapshot => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setMessages(list);
    });
    return () => unsub();
  }, [groupId]);

  async function send() {
    if (!text.trim()) return;
    await addDoc(collection(db, 'chatGroups', groupId, 'messages'), {
      text,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });
    setText('');
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={messages} keyExtractor={i => i.id} renderItem={({ item }) => (
        <Text>{item.text}</Text>
      )} />
      <TextInput value={text} onChangeText={setText} placeholder="Poruka" />
      <Button title="Pošalji" onPress={send} />
    </View>
  );
}
