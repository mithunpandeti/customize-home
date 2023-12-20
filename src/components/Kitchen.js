import React, { useEffect, useRef, useState } from "react";
import { db, kitRef, kitItemRef } from "../utils/firebase";
import { addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const Kitchen = () => {
  const itemName = useRef(null);
  const itemQuantity = useRef(null);
  const [kitItems, setKitItems] = useState([]);
  const [taskName, setTaskName] = useState();
  const users = useSelector((store)=>store.user);
  const [taskList, setTaskList] = useState([]);

  const getKitItems = () => {
    onSnapshot(kitRef, (snapshot)=>{
      let items = [];
      snapshot.docs.forEach((doc)=>{
        items.push({...doc.data(), id: doc.id})
      })
      setKitItems(items);      
    })
  }

  const getKitList = () => {
    onSnapshot(kitItemRef, (snapshot)=>{
      let tasks = [];
      snapshot.docs.forEach((doc)=>{
        tasks.push({...doc.data()})
      })
      setTaskList(tasks);      
    })
  }

  useEffect(()=>{
    getKitItems();
    getKitList();
  },[])

  const AddItems = () => {
    const findItem = kitItems.filter(kit=>kit.itemName==itemName.current.value);
    console.log(findItem)
    
    if(findItem.length==0){
      addDoc(kitRef, {
        itemName: itemName.current.value,
        itemQuantity: itemQuantity.current.value,
    })
    .then(()=>{
      itemName.current.value = "";
      itemQuantity.current.value = "";
      getKitItems();
    })
  }
  else{
    const updateKitRef = doc(db, "kitchen", findItem[0].id);
    const data = {
      itemName: itemName.current.value,
      itemQuantity: itemQuantity.current.value,
    }
    if(itemQuantity.current.value==""){
      deleteDoc(updateKitRef)
      .then(() =>{
        itemName.current.value = "";
        itemQuantity.current.value = "";
      })
    }
    else{
      updateDoc(updateKitRef, data)
      .then(()=>{
        itemName.current.value = "";
        itemQuantity.current.value = "";
      })
    }
  }
      
  }

  const HandleTask = () =>{
    //console.log(taskName, serverTimestamp(), users.displayName)
    let pointsGive = 0;
    switch(taskName){
     case "Cooking": {pointsGive = 5; break}
     case "Dish Wash": {pointsGive = 3; break}
     case "Kitchen Cleaning": {pointsGive = 3;break}
     case "Rice boiling": {pointsGive = 1;break}
     case "Vegetables cutting": {pointsGive = 5; break}
    }
    addDoc(kitItemRef, {
      taskName: taskName,
      date: serverTimestamp(),
      doneBy: users.displayName,
      pointEarned: pointsGive
  })
  .then(()=>{
    getKitList();
    setTaskName("");
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
            (kitItems && kitItems.length>0) && (
              <div className="ml-auto mr-auto w-5/12 border-2 border-gray-700 rounded-lg p-2">
              <p className="font-bold text-xl text-center">Kitchen Items</p>
              <table className="p-2 m-2 w-full">
                <thead>
                  <tr>
                    <td className=" w-1/2 font-bold p-2">Item Name</td>
                    <td className=" w-1/2 font-bold p-2">Item Quantity</td>
                  </tr>
                </thead>
                <tbody>
                {
                  kitItems.map((curr)=>(
                    <tr key={curr.itemName}>
                      <td className=" w-1/2 p-2">{curr.itemName}</td>
                      <td className=" w-1/2 p-2">{curr.itemQuantity}</td>
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
              <option>Cooking</option>
              <option>Dish Wash</option>
              <option>Kitchen Cleaning</option>
              <option>Rice boiling</option>
              <option>Vegetables cutting</option>
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
          </div>
      </div>
    </div>
    
  );
};

export default Kitchen;
