const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function App() {
  const [user, setUser] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [pdfUrl, setPdfUrl] = React.useState('');

  React.useEffect(() => {
    auth.onAuthStateChanged(u => setUser(u));
  }, []);

  async function login(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await auth.signInWithEmailAndPassword(email, password);
  }

  async function addLesson(e) {
    e.preventDefault();
    await db.collection('lessons').add({ title, videoUrl, pdfUrl });
    setTitle('');
    setVideoUrl('');
    setPdfUrl('');
  }

  if (!user) {
    return React.createElement('form', { onSubmit: login }, [
      React.createElement('input', { name: 'email', placeholder: 'Email' }),
      React.createElement('input', { name: 'password', type: 'password', placeholder: 'Password' }),
      React.createElement('button', { type: 'submit' }, 'Login')
    ]);
  }

  return React.createElement('div', null, [
    React.createElement('h2', null, 'Dodaj lekciju'),
    React.createElement('form', { onSubmit: addLesson }, [
      React.createElement('input', { value: title, onChange: e => setTitle(e.target.value), placeholder: 'Naslov' }),
      React.createElement('input', { value: videoUrl, onChange: e => setVideoUrl(e.target.value), placeholder: 'Video URL' }),
      React.createElement('input', { value: pdfUrl, onChange: e => setPdfUrl(e.target.value), placeholder: 'PDF URL' }),
      React.createElement('button', { type: 'submit' }, 'Dodaj')
    ])
  ]);
}

ReactDOM.render(React.createElement(App), document.getElementById('app'));
