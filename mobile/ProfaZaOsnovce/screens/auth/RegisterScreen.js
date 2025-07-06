import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function register() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Lozinka" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Registruj" onPress={register} />
    </View>
  );
}
