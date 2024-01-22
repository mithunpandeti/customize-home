// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

import { collection, getDocs, getFirestore, addDoc, query, where, onSnapshot, orderBy, serverTimestam, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkrZnH3bGUIvlolnW_LnbkoRf7NEaVthk",
  authDomain: "chithram-82578.firebaseapp.com",
  projectId: "chithram-82578",
  storageBucket: "chithram-82578.appspot.com",
  messagingSenderId: "123657625667",
  appId: "1:123657625667:web:e03a0e1cfdc6ad1c1ef4f6",
  measurementId: "G-0W4E2Y6KE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
export const colRef = collection(db, "people");
export const kitRef = collection(db, "kitchen");
export const kitItemRef = collection(db, "kitchenItem");
export const houseRef = collection(db, "house");
export const secretCodeRef = collection(db, "secretCode");
export const washRef = collection(db, "washroom");
export const washItemRef = collection(db, "washroomItem");
export const washingRef = collection(db, "washingStatus");

/*getDocs(colRef)
.then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    people.push({...doc.data(), id: doc.id})
  })
  
const dispatch = useDispatch();
  dispatch(updatePeople(people))
})*/

//query

/*const q = query(colRef, where("author","==","Mithun"), orderBy('title', 'desc'))

onSnapshot(q, (snapshot) =>{
  let books = [];
  snapshot.docs.forEach((doc)=>{
    books.push({...doc.data(), id: doc.id})
  })
})

//update Doc

export const docRef = collection(db, "people", "id");

updateDoc(docRef, {
  title: "updated title"
})*/

// CreatedAt: serverTimestamp()

export const auth = getAuth();