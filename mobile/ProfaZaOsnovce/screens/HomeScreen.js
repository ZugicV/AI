import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function HomeScreen() {
  const [nextClass, setNextClass] = useState(null);

  useEffect(() => {
    async function fetchNextClass() {
      // Placeholder Firestore query
      const docRef = doc(collection(db, 'schedule'), 'next');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setNextClass(snap.data());
      }
    }
    fetchNextClass();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profa za osnovce</Text>
      {nextClass && (
        <Text>Next class: {nextClass.date} {nextClass.time}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});
