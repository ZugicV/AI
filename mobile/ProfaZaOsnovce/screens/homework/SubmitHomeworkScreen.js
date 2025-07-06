import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, auth, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

export default function SubmitHomeworkScreen({ route }) {
  const { taskId } = route.params;
  const [image, setImage] = useState(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function uploadHomework() {
    if (!image) return;
    const res = await fetch(image);
    const blob = await res.blob();
    const storageRef = ref(storage, `homework/${auth.currentUser.uid}/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'homeworkSubmissions'), {
      taskId,
      userId: auth.currentUser.uid,
      url,
      createdAt: Date.now()
    });
    setImage(null);
  }

  return (
    <View>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Odaberi sliku" onPress={pickImage} />
      <Button title="Predaj" onPress={uploadHomework} />
    </View>
  );
}
