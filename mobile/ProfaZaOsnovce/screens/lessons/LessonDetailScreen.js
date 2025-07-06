import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function LessonDetailScreen({ route }) {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    async function fetchLesson() {
      const snap = await getDoc(doc(db, 'lessons', lessonId));
      if (snap.exists()) {
        setLesson(snap.data());
      }
    }
    fetchLesson();
  }, [lessonId]);

  if (!lesson) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Text>{lesson.title}</Text>
      {lesson.videoUrl && (
        <WebView source={{ uri: lesson.videoUrl }} style={{ height: 200 }} />
      )}
      {lesson.pdfUrl && (
        <WebView source={{ uri: lesson.pdfUrl }} style={{ flex: 1 }} />
      )}
    </View>
  );
}
