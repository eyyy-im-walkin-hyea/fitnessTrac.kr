import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const DATABASE_URL = `https://fitnesstrackr-zvm8.onrender.com/api`


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
   
            <section className="routines">
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
                    </form> : <div className="form-createAct-reject"> Please log in or create an account to make an activity. </div>
                }
                {
                    activities ? activities.map((singleActivity, index) => {
                        return (
                            <div className='box' key={singleActivity.id}>
                                <p> Activity Name: {singleActivity.name}</p>
                                <p> Activity Description: {singleActivity.description}</p>
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
                    }) : <h3> No activities loaded.</h3>
                }
            </section>
            
    )
}

export default Activities;