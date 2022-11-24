import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6lnZBrMw6AL6fSsqVsGsAZby2u0sY4GI",
  authDomain: "todos-9fde2.firebaseapp.com",
  projectId: "todos-9fde2",
  storageBucket: "todos-9fde2.appspot.com",
  messagingSenderId: "843047370664",
  appId: "1:843047370664:web:60c5ae3a417d0920d7e79d",
  storageBucket: "gs://todos-9fde2.appspot.com"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);