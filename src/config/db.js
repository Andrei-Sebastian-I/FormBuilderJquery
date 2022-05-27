
import Firebase from 'firebase'
let config = {
  apiKey: "AIzaSyCLkWU6KQrZZACLjhscTCTyKSsR2KfrrYg",
  authDomain: "adaptme-panel.firebaseapp.com",
  projectId: "adaptme-panel",
  storageBucket: "adaptme-panel.appspot.com",
  messagingSenderId: "1066331446116",
  appId: "1:1066331446116:web:f2b9f9f4733a85cc3bf871",
  measurementId: "G-C6BN4GTGJQ",
  databaseURL:"https://adaptme-panel-default-rtdb.europe-west1.firebasedatabase.app/"
};

  export default !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.app();
  export const db =  !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.database();
  export const firestorage =  !Firebase.apps.length ? Firebase.initializeApp(config) : Firebase.storage();