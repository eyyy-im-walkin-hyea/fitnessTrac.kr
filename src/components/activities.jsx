import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const DATABASE_URL = `http://localhost:1337/api`


const Activities = (props) => {
    const [activities, setActivities] = useState([]);
    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [publicRoutine, setPublicRoutine] = useState([]);
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

      const updateActivity = async (activityId) => {
        console.log("updateAct Id", activityId)
        try {
          const response = await fetch(`${DATABASE_URL}/activities/${activityId}`, {
            method: "PATCH",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWT}`
            },
            body: JSON.stringify({
              name: updateName,
              description: updateDescription
            })
          });
      
            const translatedData = await response.json();
            console.log(translatedData);
            if (translatedData.id && myJWT) {
                setActivities([...activities.filter((activity) => activity.id !== activityId), translatedData]);
            }
          } catch (err) {
          console.error(err);
          }
      }
      function updateButton (event) {
        console.log("Button is clicked");
        updateActivity(event.target.value)
      };

      
      
            


    return (
   
            <section className="act-sec">
            { 
                    props.isLoggedIn ? 
                    <form className="form-createAct" onSubmit={createActivity}>
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
                    </form> : <div className="form-createAct-reject"> You do not have access to send a message. Please login or create account. </div>
                }
                {
                    activities ? activities.map((singleActivity, index) => {
                        return (
                            <div className="act1" key={singleActivity.id}>
                                <h2 style={{color: "blue"}}> Activity Name: <u>{singleActivity.name}</u> </h2>
                                <h2> Activity Description: <strong>{singleActivity.description}</strong></h2>
                                {
                                    props.isLoggedIn ?
                                    <form className="upd-act-form" onSubmit={updateButton}>
                                        <textarea
                                        type="text"
                                        placeholder="Update Activity Name"
                                        value={singleActivity[index]}
                                        rows="1"
                                        cols="20"
                                        onChange={(event) => setUpdateName(event.target.value)}/>
                                        <textarea
                                        type="text"
                                        placeholder="Update Activity Description"
                                        value={singleActivity[index]}
                                        rows="1"
                                        cols="20"
                                        onChange={(event) => setUpdateDescription(event.target.value)}/>
                                        <button type="submit" value={singleActivity.id}> Update Activity </button>
                                        <Link to={`/activities/${singleActivity.id}/routines`}> Click here for routines with this activity.</Link>

                                    </form>
                                    : <div className="form-updAct-reject"> Please login or create an account to update an activity.</div>
                                }
                               
                            </div>
                        )
                    }) : <h1> No activities loaded.</h1>
                }
            </section>
            
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