import React, { useEffect } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, colRef, kitItemRef, washItemRef } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { getDocs, onSnapshot } from "firebase/firestore";
import { removePeople, updatePeople } from "../utils/peopleSlice";
import { addItems } from "../utils/kitchenItemSlice";
import { addWashItems } from "../utils/washItemSlice";

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
          })
        );
        navigate("/home");
        /*
        getDocs(colRef)
        .then((snapshot)=>{
          snapshot.docs.forEach((doc)=>{
            people.push({...doc.data(), id: doc.id})
          })
          dispatch(updatePeople(people))
        })
        */
        onSnapshot(colRef, (snapshot)=>{
          let people = [];
          snapshot.docs.forEach((doc)=>{
            people.push({...doc.data()})
          })
          dispatch(updatePeople(people))
        })
      } else {
        dispatch(removeUser());
        dispatch(removePeople())
        navigate("/");
      }

      onSnapshot(kitItemRef, (snapshot)=>{
        let tasks = [];
        snapshot.docs.forEach((doc)=>{
          let valone = {...doc.data()};
          if(valone.date) valone.date = valone.date.toDate().toString();
          tasks.push(valone)
        }
        )
        dispatch(addItems(tasks)) 
      });

      onSnapshot(washItemRef, (snapshot)=>{
        let tasks = [];
        snapshot.docs.forEach((doc)=>{
          let valone = {...doc.data()};
          if(valone.date) {
            valone.date = valone.date.toDate().toString();}
          tasks.push(valone)
        }
        )
        dispatch(addWashItems(tasks)) 
      });

    });
    //this gets called when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  return (
    <div className="Header w-full flex justify-between shadow-xl">
      <div className="logo">
        {user ? (
          <Link to="/home">
            <img className="w-24 h-24" src={logo} />
          </Link>
        ) : (
          <img className="w-24 h-24" src={logo} />
        )}
      </div>
      {user && (
        <div className="nav-items p-9">
          <ul className="flex space-x-2">
            <li className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Link to="/Kitchen">Kitchen</Link>
            </li>
            <li className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Link to="/living">Living Room</Link>
            </li>
            <li className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Link to="/washroom">Washroom</Link>
            </li>
            <li className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Link to="/bedroom">Bedroom</Link>
            </li>
            <li className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              <Link to="/people">Profile</Link>
            </li>
            <li
              className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
