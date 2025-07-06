import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Lozinka" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Prijavi se" onPress={login} />
      <Button title="Registruj se" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
