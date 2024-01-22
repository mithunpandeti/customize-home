import React, { useEffect, useRef, useState } from 'react';
import { colRef, db } from '../utils/firebase';
import { collection, getDocs, getFirestore, addDoc, doc, deleteDoc, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { updatePeople } from '../utils/peopleSlice';
import { useNavigate } from 'react-router-dom';

const People = () => {
  const currentUser = useSelector((store)=>store.user);
  const email = useRef(null);
  const fullname = useRef(null);
  const image = useRef(null);
  const about = useRef(null);
  const specialities = useRef(null);
  const people = useSelector((store)=>store.people);
  const [deletePerson, setDeletePerson] = useState(null);
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(deletePerson) deletePeople(deletePerson)
  },[deletePerson])

  const validateForm = () => {

  const q = query(colRef, where("id","==",currentUser.uid))

  onSnapshot(q, (snapshot) =>{
    snapshot.docs.forEach((doc)=>{
      setDeletePerson(doc.id);
    })
  })
  }

  const deletePeople = (person) => {
    const spec =  specialities.current.value;
  const myArray = spec.split(",");
    const docRef = doc(db, 'people', person);
    updateDoc(docRef, {
      email: currentUser.email,
      fullname: currentUser.displayName,
      image: image.current.value,
      about: about.current.value,
      specialities: myArray,
      id: currentUser.uid
  })
    .then(()=>{
        setDeletePerson("");
        navigate("/home")
    })
  }

  return (
    <div className=" bg-gray-100">
      <div className="p-12 w-4/12 mx-auto right-0 left-0 rounded-lg">
        <form
          className=" p-4 border-2 border-gray-300 rounded-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <h4 className="font-bold text-3xl py-4">
            {"Edit Profile"}
          </h4>
          <label className=" block">Image</label>
          <input
            className="p-2 my-4 border rounded-lg w-full"
            type="text"
            placeholder="Image URL"
            ref={image}
            name="image"
          />
          <label className=" block">About</label>
          <input
            className="p-2 my-4 border rounded-lg w-full"
            type="text"
            placeholder="about"
            ref={about}
            name="about"
          />
          <label className=" block">Specialities</label>
          <input
            className="p-2 my-4 border rounded-lg w-full"
            type="text"
            placeholder="Add Specialities with comma separated"
            ref={specialities}
            name="specialities"
          />
            <button
                className="right-0 bg-green-500 p-2 border rounded-xl text-white font-bold"
                onClick={validateForm}
            >
                {"Update Profile"}
            </button>
        </form>
            {/*
              people.length>0 && 
              <div className='p-4 border-2 border-gray-300 rounded-lg'>
                <h4 className="font-bold text-3xl py-4">
                    {"Delete People"}
                </h4>
                <table>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                  {
                    people.map((person)=>(
                      <tr>
                        <td>{person.fullname}</td>
                        <td>
                          <button className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded cursor-pointer" onClick={()=>deletePeople(person.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  }
                </table>
              </div>
                */}
      </div>
    </div>
  )
}

export default People