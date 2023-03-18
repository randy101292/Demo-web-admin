import firebase from 'firebase'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: "G-K1SFSP3V79",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const appCheck = firebase.appCheck();
appCheck.activate('6Lcf_OgfAAAAAKi4Qf1uBh4y_8r_KDQM9cPDCpMD');

if (window.location.hostname === "localhost") {
  db.settings({
    host: "localhost:8080",
    ssl: false
  });

  firebase.app().functions('asia-southeast1').useEmulator("localhost", 5001);
  auth.useEmulator("http://localhost:9099");
}

const fbase = firebase;

export {
  fbase,
  db,
  auth
}
