import { useState, useEffect } from "react";
const DATABASE_URL = `http://localhost:1337/api`


const Activities = (props) => {
    const [activities, setActivities] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const myJWT = localStorage.getItem("token");

    useEffect(() => {
        allActivities();
      }, []);

    const allActivities = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/activities/`, {
            headers: {
                'Content-Type': 'application/json',
            },
          });
      
          const activityData = await response.json();
      
          console.log(activityData);
          setActivities(activityData);
          return activityData
        } catch (err) {
          console.error(err);
        };
      };
    
    const createActivity = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`${DATABASE_URL}/activities`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${myJWT}`
            },
            body: JSON.stringify({
              name: name,
              description: description
            }) 
          });
      
          const translatedData = await response.json();
      
          console.log(translatedData);
          if(translatedData.id) {
            setActivities([...activities, translatedData]);
            setDescription("");
            setName("");
          } else {
            alert("Creating activity failed.");
          }
          
        } catch (err) {
          console.error(err);
        }
      };

      
    
      
            


    return (
        <div> 
            <section>
                {
                    activities ? activities.map((singleActivity) => {
                        return (
                            <div key={singleActivity.id}>
                                <h2> Activity Name: <u>{singleActivity.name}</u> </h2>
                                <h2> Activity Description: <strong>{singleActivity.description}</strong></h2>
                            </div>
                        )
                    }) : <h1> No activities loaded.</h1>
                }
                 { 
                    props.isLoggedIn ? 
                    <form className="messageSender" onSubmit={createActivity}>
                        <textarea
                        type="text" 
                        placeholder="Enter Activity Name"
                        rows="2"
                        cols="25"
                        value={name}
                        onChange={(event) => setName(event.target.value)}/>
                        <textarea
                        type="text"
                        placeholder="Enter Activity Description"
                        rows="2"
                        cols="25"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)} />
                        <button type="submit" id="sendMessageButton"> Create New Activity  </button>
                    </form> : <div className="messageSender"> You do not have access to send a message. Please login or create account. </div>
                }
            </section>
            


        </div>
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