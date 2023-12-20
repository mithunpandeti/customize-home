import React, { useEffect, useRef, useState } from "react";
import { auth, secretCodeRef } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { houseRef, colRef } from "../utils/firebase";
import { addDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";

const Login = () => {
  const [newUser, setNewUser] = useState(false);
  const [houses, setHouses] = useState([]);
  const [secretData, setSecretData] = useState();
  const [errorMessageFlag, setErrorMessageFlag] = useState("");
  const [validateSecretData, setValidateSecretData] = useState(false);
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const houseName = useRef(null);
  const secretCode = useRef(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    getDocs(houseRef)
    .then((snapshot)=>{
      let h = [];
      snapshot.docs.forEach((doc)=>{
        h.push(doc.data().name)
      })
      setHouses(h);
    })
  },[])

  useEffect(()=>{
    secretData && secretData.forEach((secret)=>{
      if(secret[houseName.current.value] === secretCode.current.value){
        submitForm(fullname.current.value, email.current.value, houseName.current.value);
      }  
    })
  },[secretData])

  const submitForm = (fullNameVal, emailVal, houseVal) =>{
    createUserWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, {
          displayName: fullNameVal,
        })
      .then(() => {
          const { uid } = auth.currentUser;
          addDoc(colRef, {
            email: emailVal,
            fullname: fullNameVal,
            id: uid
          })
        .then(()=>{
          const { email, displayName } = auth.currentUser;
          dispatch(
            addUser({
              uid: uid,
              email: email,
              displayName: displayName,
              orgName: houseVal
            })
            );
            navigate("/people");
        })
          
        })
        .catch((error) => {
          console.log(error);
          setErrorMessageFlag(error)
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessageFlag(errorMessage)
      })
    }
  const validateForm = () => {
    if(newUser){
      const fullNameVal = fullname.current.value;
      const emailVal = email.current.value;
      const houseVal = houseName.current.value;
      const secretVal = secretCode.current.value;
      if(!(fullNameVal&&emailVal&&secretVal&&houseVal)) setErrorMessageFlag("Please enter all details") 
      else {
        getDocs(secretCodeRef)
        .then((snapshot)=>{
          let h = [];
          snapshot.docs.forEach((doc)=>{
            h.push(doc.data())
          })
          setSecretData(h);
        })
        setErrorMessageFlag("")
      }

    }
    else{
        signInWithEmailAndPassword(
            auth,
            email.current.value,
            password.current.value
          )
            .then((userCredential) => {
              const user = userCredential.user;
              const { uid, email, displayName } = auth.currentUser;
                dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName
                })
                );
              navigate("/home");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              setErrorMessageFlag(errorMessage)
            });
    }
    
  };

  return (
    <div className=" bg-gray-100">
      <div className="p-12 w-4/12 mx-auto right-0 left-0 rounded-lg">
        <form
          className=" p-4 border-2 border-gray-300 rounded-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <h4 className="font-bold text-3xl py-4">
            {newUser ? "Sign Up" : "Sign In"}
          </h4>
          {newUser && (
            <>
              <label className=" block">Full Name</label>
              <input
                className="p-2 my-4 border rounded-lg w-full"
                type="text"
                placeholder="Full Name"
                ref={fullname}
                name="fullname"
                onKeyUp={()=>setErrorMessageFlag("")}
              />
              <label className=" block">House Name</label>
              <select ref={houseName} className=" p-2 my-2 border-2 border-gray-700 rounded-lg w-3/4">
                {
                  houses && houses.map(house => (
                    <option key={house} value={house}>{house}</option>
                  ))
                }
              </select>
              <label className=" block">Secret Code</label>
              <input
                className="p-2 my-4 border rounded-lg w-full"
                type="password"
                placeholder="Enter your house secret code"
                ref={secretCode}
                name="secretCode"
                onKeyUp={()=>setErrorMessageFlag("")}
              />
            </>
          )}
          <label className=" block">Email</label>
          <input
            className="p-2 my-4 border rounded-lg w-full"
            type="email"
            placeholder="Email"
            ref={email}
            name="email"
            onKeyUp={()=>setErrorMessageFlag("")}
          />
          <label className=" block">Password</label>
          <input
            className="p-2 my-4 border rounded-lg w-full"
            type="password"
            placeholder="Password"
            ref={password}
            name="password"
            onKeyUp={()=>setErrorMessageFlag("")}
          />
          <div>
           { newUser && <p>{"Note: Please validate the details before submitting. Details once submit, cannot edit"}</p> } 
                <p className=" text-red-700 font-bold text-lg">{errorMessageFlag}</p>
          </div>
          <div className="flex justify-between">
            {!newUser && <p className="font-bold text-blue-700 cursor-pointer" onClick={()=>{setNewUser(true); setErrorMessageFlag(""); email.current.value = ""; password.current.value=""}}>Create Account</p>}
            {newUser && <p className="font-bold text-blue-700 cursor-pointer p-2" onClick={()=>{setNewUser(false); setErrorMessageFlag(""); email.current.value = ""; password.current.value=""}}>Sign In</p>}
            <button
                className="right-0 bg-green-500 p-2 border rounded-xl text-white font-bold"
                onClick={validateForm}
            >
                {newUser ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
