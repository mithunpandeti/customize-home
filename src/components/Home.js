import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Home = () => {

    const [perf, setPerf] = useState([]);
    const [prev, setPrev] = useState([]);
    const people = useSelector((store)=>store.people);
    const taskList = useSelector((store)=>store.kitchenItems);
    const washList = useSelector((store)=>store.washItems);
    const [rank, setRank] = useState([]);
    const [prevRank, setPrevRank] = useState([]);
    const curr = new Date;
    const first = curr.getDate() - curr.getDay(); 
    const last = first + 6;

    const firstday = Date.parse(new Date(curr.setDate(first)));
    const lastday = Date.parse(new Date(curr.setDate(last)));
    const lastfirstday = Date.parse(new Date(curr.setDate(first-7)));
    const lastlastday = Date.parse(new Date(curr.setDate(first-1)));
    const current = Date.now();

    useEffect(()=>{
      let yy = [];
      let zz = [];
      taskList && taskList.map((tasks) => {
        let current = Date.parse(tasks.date);
        if(current >= firstday && current <= lastday){
          yy.push(tasks);
        }

      })
      washList && washList.map((wtasks) => {
        let current = Date.parse(wtasks.date);
        if(current >= firstday && current <= lastday){
          yy.push(wtasks);
        }
      })
      setPerf(yy);

      taskList && taskList.map((tasks) => {
        let current = Date.parse(tasks.date);
        if(current >= lastfirstday && current <= lastlastday){
          zz.push(tasks);
        }        
      })
      washList && washList.map((wtasks) => {
        let current = Date.parse(wtasks.date);
        if(current >= lastfirstday && current <= lastlastday){
          zz.push(wtasks);
        }
      })
      setPrev(zz);

    },[taskList])

    useEffect(()=>{
      const result = Object.groupBy(perf, ({ doneBy }) => doneBy);
      let marks = [];
      for (const property in result) {
        let name = property;
        let sum=0;
        result[property].map(re=>{
          sum = sum + re.pointEarned;
        })
        const person = {name: name, value: sum}
        marks.push(person);
      }
      setRank(marks);

      const prevResult = Object.groupBy(prev, ({ doneBy }) => doneBy);
      let prevMarks = [];
      for (const property in prevResult) {
        let name = property;
        let sum=0;
        prevResult[property].map(re=>{
          sum = sum + re.pointEarned;
        })
        const person = {name: name, value: sum}
        prevMarks.push(person);
      }
      setPrevRank(prevMarks);

    },[perf,prev])

    rank.sort((a, b) => a.value - b.value);
    prevRank.sort((a, b) => a.value - b.value);

  return (
    <div className=' pt-6 pb-6 ml-auto mr-auto w-10/12'>
      <div>
        <p className='text-center text-2xl font-bold'>Our Team</p>
          <div className='flex flex-wrap m-5'>
              {
                people && people.map((user,i)=>(
                  <div key={i} className="max-w-sm p-4 m-2 rounded overflow-hidden shadow-lg">
                    {
                      user.image ? <img className="w-80 text-center ml-auto mr-auto rounded-full h-60" src={user.image} alt={user.fullname}/> : <img className="w-80 text-center ml-auto mr-auto rounded-full h-60" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC0HlQ_ckX6HqCAlqroocyRDx_ZRu3x3ezoA&usqp=CAU" alt={user.fullname}/>
                    }
                      <div className="px-6 py-4">
                          <div className="font-bold text-xl mb-2">{user.fullname}</div>
                          <p className="text-gray-700 text-base">
                              {user.about}
                          </p>
                      </div>
                      <div className="px-6 pt-4 pb-2">
                        {
                          user.specialities && user.specialities.map((spec,i)=>(
                            <span key={i} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{spec}</span>
                          ))
                        }
                      </div>
                  </div>
                ))  
              }
          </div> 
      </div>
      <div className='ml-auto mr-auto w-5/12 p-2'>
        <h4 className='text-xl font-bold p-4 text-center'>{"Top Performers of this Week: "+new Date(curr.setDate(first)).toDateString()+" - "+new Date(curr.setDate(last)).toDateString()}</h4>
        <div className='border-2 border-gray-700 rounded-lg'>
          <table className='w-full'>
            <thead>
              <tr className=' border-b-2 border-gray-700 rounded-lg'>
                <th className='w-1/2 text-center'>
                  {"Name"}
                </th>
                <th className='w-1/2 text-center'>
                  {"Points Earned"}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                rank && rank.toReversed().map((r,i)=>(
                  <tr key={i}>
                    <td className='w-1/2 text-center'>{r.name}</td>
                    <td className='w-1/2 text-center'>{r.value}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>  
      <div className='ml-auto mr-auto w-5/12 p-2'>
        <h4 className='text-xl font-bold p-4 text-center'>{"Top Performers of Previous Week: "+new Date(curr.setDate(first-7)).toDateString()+" - "+new Date(curr.setDate(first-1)).toDateString()}</h4>
        <div className='border-2 border-gray-700 rounded-lg'>
          <table className='w-full'>
            <thead>
              <tr className=' border-b-2 border-gray-700 rounded-lg'>
                <th className='w-1/2 text-center'>
                  {"Name"}
                </th>
                <th className='w-1/2 text-center'>
                  {"Points Earned"}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                prevRank && prevRank.toReversed().map((r,i)=>(
                  <tr key={i}>
                    <td className='w-1/2 text-center'>{r.name}</td>
                    <td className='w-1/2 text-center'>{r.value}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div> 
    </div>
  )
}

export default Home