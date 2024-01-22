import { addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db, washItemRef, washRef } from '../utils/firebase';
import { useSelector } from 'react-redux';
import { washingRef } from '../utils/firebase';

const Washroom = () => {
  const itemName = useRef(null);
  const itemQuantity = useRef(null);
  const [washItems, setWashItems] = useState();
  const [taskList, setTaskList] = useState([]);
  const [taskName, setTaskName] = useState();
  const [washingId, setWashingId] = useState();
  const [washing, setWashing] = useState({
    status:"", user:"",
  });
  const users = useSelector((store)=>store.user);

  const getWashItems = () => {
    onSnapshot(washRef, (snapshot)=>{
      let items = [];
      snapshot.docs.forEach((doc)=>{
        items.push({...doc.data(), id: doc.id})
      })
      setWashItems(items);    
    })
  }

  const getWashList = () => {
    onSnapshot(washItemRef, (snapshot)=>{
      let tasks = [];
      snapshot.docs.forEach((doc)=>{
        tasks.push({...doc.data()})
      })
      setTaskList(tasks);      
    })
  }

  useEffect(()=>{
    getWashItems();
    getWashList();
    getWashingsStatus();
  },[])

  const AddItems = () => {

    const findItem = washItems.filter(kit=>kit.itemName==itemName.current.value);
    
    if(findItem.length==0){
      addDoc(washRef, {
        itemName: itemName.current.value,
        itemQuantity: itemQuantity.current.value,
    })
    .then(()=>{
      itemName.current.value = "";
      itemQuantity.current.value = "";
      getWashItems();
    })
  }
  else{
    const updateWashRef = doc(db, "washroom", findItem[0].id);
    const data = {
      itemName: itemName.current.value,
      itemQuantity: itemQuantity.current.value,
    }
    if(itemQuantity.current.value==""){
      deleteDoc(updateWashRef)
      .then(() =>{
        itemName.current.value = "";
        itemQuantity.current.value = "";
      })
    }
    else{
      updateDoc(updateWashRef, data)
      .then(()=>{
        itemName.current.value = "";
        itemQuantity.current.value = "";
      })
    }
  }
      
  }

  const HandleTask = () =>{
    let pointsGive = 0;
    switch(taskName){
     case "Sink Wash": {pointsGive = 4; break}
     case "Toilet Wash": {pointsGive = 5; break}
    }
    addDoc(washItemRef, {
      taskName: taskName,
      date: serverTimestamp(),
      doneBy: users.displayName,
      pointEarned: pointsGive
  })
  .then(()=>{
    getWashList();
    setTaskName("");
  })
  }

  const addWashingStatus = () => {
    const data = {
      status:"yes", name:users.displayName
    }
    const updateWashingRef = doc(db, "washingStatus", washingId);
    updateDoc(updateWashingRef, data)
    .then(()=>{
      getWashingsStatus();
    })
  }

  const removeWashingStatus = () => {
    const data = {
      status:"", name:""
    }
    const updateWashingRef = doc(db, "washingStatus", washingId);
    updateDoc(updateWashingRef, data)
    .then(()=>{
      getWashingsStatus();
    })
  }

  const getWashingsStatus = () => {
    onSnapshot(washingRef, (snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        setWashing({...doc.data()}); 
        setWashingId(doc.id) 
      })
    })
  }

  return (
    <div className="bg-gray-100">
      <div className="pt-6 pb-6 ml-auto mr-auto w-10/12">
      <div className="">
          <p className=" font-bold text-xl">Add Items</p>
          <div className="p-2">
            <p className=" inline-block">Item Name:</p>
            <input
              ref={itemName}
              className="m-1 p-1 border-2 border-gray-800 rounded-lg"
              type="text"
            />
            <p className=" inline-block">Item Quantity:</p>
            <input
              ref={itemQuantity}
              className="m-1 p-1 border-2 border-gray-800 rounded-lg"
              type="text"
            />
            <button
              className=" w-36 bg-green-700 rounded-lg p-1 text-white font-bold"
              type="button"
              onClick={AddItems}
            >
              Add/Update
            </button>
          </div>
          <p>To delete item: enter item name, leave item Quantity empty and click on Add/Update.</p>
        </div>
        {
            (washItems && washItems.length>0) && (
              <div className="ml-auto mr-auto w-5/12 border-2 border-gray-700 rounded-lg p-2">
              <p className="font-bold text-xl text-center">Washroom Items</p>
              <table className="p-2 m-2 w-full">
                <thead>
                  <tr>
                    <td className=" w-1/2 font-bold p-2">Item Name</td>
                    <td className=" w-1/2 font-bold p-2">Item Quantity</td>
                  </tr>
                </thead>
                <tbody>
                {
                  washItems.map((curr)=>(
                    <tr key={curr.itemName}>
                      <td className="p-2">{curr.itemName}</td>
                      <td className="p-2">{curr.itemQuantity}</td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
            )
          }
          <div className="m-2 my-6">
            <p className=" font-bold text-xl m-2">Add Task</p>
            <select className="p-2 my-4 mx-2 rounded-lg border-2 border-gray-700" value={taskName} onChange={(e)=>setTaskName(e.target.value)}>
              <option value="">Please select</option>
              <option>Sink Wash</option>
              <option>Toilet Wash</option>
            </select>
            {
              taskName && (
                <div className="p-2">
                  <p>You have selected: <span className="font-bold text-lg">{taskName}</span></p>
                  <p>Please click confirm to add the task</p>
                  <button onClick={HandleTask} className="bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 m-2 border border-green-500 hover:border-transparent rounded cursor-pointer">Confirm</button>
                </div>
              )
            }
            {
              taskList && (
                <div className="ml-auto mr-auto w-5/12 border-2 border-gray-700 rounded-lg p-2">
                  <p className="font-bold text-xl text-center">Tasks done this week</p>
                  <table className="p-2 m-2 w-full">
                    <thead>
                      <tr>
                        <td className=" font-bold p-2">Task Name</td>
                        <td className=" font-bold p-2">Task done by</td>
                        <td className=" font-bold p-2">Date</td>
                        <td className=" font-bold p-2">Points gained</td>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      taskList.map((curr,id)=>(
                        <tr key={id}>
                          <td className="p-2">{curr.taskName}</td>
                          <td className="p-2">{curr.doneBy}</td>
                          {curr.date && <td className="p-2">{(curr.date.toDate().getMonth()+1)+"/"+curr.date.toDate().getDate()+"/"+curr.date.toDate().getFullYear()}</td>}
                          <td className="p-2">{curr.pointEarned}</td>
                        </tr>
                      ))
                    }
                    </tbody>
                    
                  </table>
                </div>
              )
            }
            <div className='ml-auto mr-auto w-5/12 '>
              <div className=' m-6 text-center '>
                <p className='font-bold inline-block mb-2'>{"Washing Machine Status: "}</p>
                {
                  washing.status=="" ? <span className=' text-green-900 font-bold p-2'>Vacant</span> : <span className=' text-red-700 font-bold p-2'>Occupied by {washing.name}</span>
                }
                  {
                    washing.status=="" && 
                    <div>
                      <p className=' mb-4 inline-block mr-4'>
                        {"Are you using Washing Machine?"}
                      </p>
                      <p onClick={()=>{addWashingStatus()}} className=' cursor-pointer inline-block bg-blue-700 text-white font-bold p-2 border border-blue-700 rounded-lg w-16'>
                        Yes
                      </p>
                    </div>
                  }
                  {
                    washing.status=="yes" && washing.name==users.displayName &&
                    <div>
                      <p className=' mb-4 inline-block mr-4'>
                        {"Have you completed using Washing Machine?"}
                      </p>
                      <p onClick={()=>{removeWashingStatus()}} className=' cursor-pointer inline-block bg-blue-700 text-white font-bold p-2 border border-blue-700 rounded-lg w-16'>
                        Yes
                      </p>
                    </div>
                  }
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Washroom