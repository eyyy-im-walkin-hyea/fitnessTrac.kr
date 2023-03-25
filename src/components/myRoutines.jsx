// import {CreateRoutine, EditRoutine} from './index'
// import {GetRoutinesByUser,GetCurrentUsername, DeleteRoutine} from '../api'

// const MyRoutines = ({myroutines, setMyRoutines}) => {

//     // const handleDeleteSubmit = async ({id}) => {
//     //     try {   
//     //             const res = await DeleteRoutine(id)
//     //             const myRoutines = await GetRoutinesByUser(GetCurrentUsername());
//     //             setMyRoutines(myRoutines)
//     //     } catch (error) {
//     //         console.error(error)
//     //         alert('Error Creating Routine', error)
//     //     }
//     // }
    
//     return (
//         <div>
//             <h1>My Routines</h1>                
//             {myroutines.map(({id, creatorName, goal, isPublic=true ,name, activities }) => (
//                 <div key={id}> 
//                     <p>Routine: {name}</p>
//                     <p>Created by {creatorName}</p>
//                     <p>Goal: {goal}</p>
//                     <br />
//                     <br />
//                     {activities.length ? (
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Name</th>
//                                     <th>Description</th>
//                                     <th>Count</th>
//                                     <th>Duration</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                     {activities.map(({ id, name, description, count, duration}) => (
//                                         <tr key={id} >
//                                             <td>{name}</td>
//                                             <td>{description}</td>
//                                             <td>{count}</td>
//                                             <td>{duration}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                         </table>
//                     ) : ""}
//                     {/* <CreateRoutine myroutines={myroutines}  setMyRoutines={setMyRoutines} />
//                     <EditRoutine setMyRoutines={setMyRoutines} id={id} setMyRoutines={setMyRoutines} name={name} goal={goal} isPublic = {isPublic}/>
//                     <button key={`delete${id}`} onClick={() => handleDeleteSubmit({id})} >Delete</button> */}
//                 </div>
//             ))}           
//         </div>   
//     )
// }

// export default MyRoutines;