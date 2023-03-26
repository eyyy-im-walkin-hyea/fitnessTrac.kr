import React from "react";
import { useState, useEffect } from "react";
const DATABASE_URL = `postgres://localhost:5432/fitness-dev/api`


const Activities = (props) => {
    const [activities, setActivities] = useState([]);
    const [name, setName] = useState([]);
    const [description, setDescription] = useState([]);

    const allRoutines = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/activities`, {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            },
          });
      
          const routineData = await response.json();
      
          console.log(routineData);
          return routineData
        } catch (err) {
          console.error(err);
        }
      }
    
      useEffect(() => {
        allRoutines();
      }, []);
            


    return (
        <div> Hi </div>
    )
}

export default Activities;

// useEffect(() => {
//     const allActivities = async () => {
//         try {
//             const response = await fetch(`${DATABASE_URL}/activities`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     "Access-Control-Allow-Origin": "*",
//                     "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
//                     "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
//                 },
//             });

//             const result = await response.json();
//             allActivities(result);
//         } catch (err) {
//             console.error(err);
//         }
//     }
//     allActivities();
// },[])

// const makeActivities = async (e) => {
//     e.preventDefault();
//     try {
//         console.log('name, description:', name, description);
//         const response = await fetch(`${DATABASE_URL}/activities`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'Application/json',
//                 'Authorization': `Bearer ${localStorage.getItem("token")}`,
//                 "Access-Control-Allow-Origin": "*",
//                 "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
//                 "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
//             },
//             body: JSON.stringify({
//                 activity: {
//                     name,
//                     description,
//                 }
//             })
//         });
//         const data = await response.json();
//         console.log('data', data);
//         setActivity([...activity]);

//         setName('');
//         setDescription('');

//         document.location.reload();
//     } catch (error) {
//         console.log(error);
//     }
// }

// return (

//     <div>
//         <div>
//             <h4>
//                 Create an activity!
//             </h4>
//             {/* Submit form for creating new posts */}
//             <form onSubmit={makeActivities}>
//                 <input
//                     type="text"
//                     placeholder="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 <input
//                     type="description"
//                     placeholder="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 />

//                 <button type="submit">
//                     Submit
//                 </button>

//             </form>
//         </div>
//         {/* Shows the posts */}
//         <div> 
//             {
//                 activities(activity => <div key={activity.id}>
//                     <p>{activity.name}</p>
//                     <p>{activity.description}</p>
//                     </div>)
//             }
//         </div>
//     </div>

// )

// }