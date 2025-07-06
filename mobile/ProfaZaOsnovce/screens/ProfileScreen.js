import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../firebase';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  async function save() {
    if (user) {
      await user.updateProfile({ displayName });
    }
  }

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Ime" />
      <Button title="Sačuvaj" onPress={save} />
    </View>
  );
}
