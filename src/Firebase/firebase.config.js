import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";

const firebaseConfig={
  apiKey: "AIzaSyAM4PNUlf4dRGdR28MSznbPSo9Yu3gInbM",
  authDomain: "doctor-mnagement-system.firebaseapp.com",
  projectId: "doctor-mnagement-system",
  storageBucket: "doctor-mnagement-system.firebasestorage.app",
  messagingSenderId: "329343299952",
  appId: "1:329343299952:web:0753f9a36f5fe581eddfb5"
}

const app = initializeApp(firebaseConfig);
export const  auth =getAuth(app);
// export default app;