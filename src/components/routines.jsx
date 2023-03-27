import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const Routines = (props) => {

    const DATABASE_URL = `http://localhost:1337/api`
    const myJWT = localStorage.getItem("token");
    const {userData} = props

    // ALL YOUR STATE ARE BELONG TO US!!
    const[routines, setRoutines] = useState([]);
    const[routineName, setRoutineName] = useState('');
    const[routineGoal, setRoutineGoal] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const[activities, setActivities] = useState([]);
    const[activityId, setActivityId] = useState(0);
    const[activityCount, setActivityCount] = useState(0);
    const[activityDuration, setactivityDuration] = useState(0);

    // GET /routines
    const getRoutinesData = async () => {
        try {
        const response = await fetch(`${DATABASE_URL}/routines`, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
            const result = await response.json();
            console.log("Results from getRoutinesData: ", result);
            setRoutines(result);
            console.log("ROUTINES FROM getRoutinesData Function: ", routines)
            return result
        } catch (error) {
            console.error("Error w/ getRoutinesData :", error);
        }
    }


    // POST /routines
    const postRoutinesData = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${DATABASE_URL}/routines`, {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myJWT}`
                },
                body: JSON.stringify({
                isPublic: isPublic,
                name: routineName,
                goal: routineGoal,
                })
            });
            const result = await response.json();
                console.log("THIS IS CREATE RESULT.ID", result);
            if(result.id) {
                setRoutines([...routines, result]);
                setRoutineName("");
                setRoutineGoal("");
                setIsPublic(false);
                document.location.reload();
            } else {
                alert("Creating routine failed.");
            }
            return result
        } catch (error) {
            console.error("Error w/ postRoutinesData", error);
            }
    }

// PATCH routines/:routineId
    // FIX THE {id} in the fetch
    const patchRoutinesIdData = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/routines/${id}`, {
            method: "PATCH",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWT}`
            },
            body: JSON.stringify({
              name: routineName,
              goal: routineGoal
            })
          });
          const result = await response.json();
          console.log(result);
          return result
        } catch (error) {
          console.error("Error w/ patchRoutinesIdData", error);
        }
      }

    // DELETE /routines/:routineId
    // FIX THE {id} in the fetch
    const deleteRoutinesData = async (id) => {
        console.log("This is the DELETE ROUTINE ID", id);
        try {
          const response = await fetch(`${DATABASE_URL}/routines/${id}`, {
            method: "DELETE",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWT}`
            },
          });
          document.location.reload();
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Error w/ deleteRoutinesData",error);
        }
    }
function deleteButton (event) {
    deleteRoutinesData(event.target.value);
}
    // POST /routines/:routineId/activities
    // FIX THE {routineId} in the fetch
    const postRoutinesIdActivitiesData = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/routines/${id}/activities`, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              activityId: activityId,
              count: activityCount, 
              duration: activityDuration
            })
          });
          const result = await response.json();
          console.log(result);
          return result
        } catch (error) {
          console.error("Error w/ postRoutinesId-ActivitiesData", error);
        }
      }


//   GET /activities
const getActivitiesData = async () => {
    try {
      const response = await fetch(`${DATABASE_URL}/activities`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      console.log("Results from getActivitiesData: ", result);
        setActivities(result);
      console.log(result);
      return result
    } catch (error) {
        console.error("Error w/ getActivitiesData :", error);
    }
  }

useEffect(() => {
    getRoutinesData();
    postRoutinesData();
    patchRoutinesIdData();
    postRoutinesIdActivitiesData();
    getActivitiesData();
}, []);

// props userData setUserData
return (
    <section className='routines'>
        {
            props.isLoggedIn ?
            <form onSubmit={postRoutinesData}>
                <textarea
                type="text"
                placeholder="Enter Routine Name"
                rows="2"
                cols="25"
                value={routineName}
                onChange={(event) => setRoutineName(event.target.value)}/>
                <textarea
                type="text"
                placeholder="Enter Routine Goal"
                rows="2"
                cols="25"
                value={routineGoal}
                onChange={(event) => setRoutineGoal(event.target.value)}/>
                <input
                type="checkbox"
                placeholder="Make Your Routine Public"
                value={isPublic}
                onChange={() => setIsPublic(!isPublic)}/>
                <label htmlFor="checkbox"> Is Your Routine Public? </label>
                <button type="submit"> Create a New Routine </button>
            </form> : <div> Please log in or create an account to make a routine. </div>
        }
        <div>{
             routines.length ? routines.map((singleRoutine) => {
                return (
                    <div key={singleRoutine.id}> 
                    { singleRoutine.isPublic ? 
                    <div className='box'>
                        <p>ROUTINE: {singleRoutine.name}</p>
                        <p>GOAL: {singleRoutine.goal}</p>
                        {/* <p>CREATED BY: {props.userData.username}</p>
                        {console.log("PROPS", userData)} */}
                        <p>ROUTINE ACTIVITES:</p>
                        { singleRoutine.activities.length ?
                        <div>
                            <p>{singleRoutine.activities[0].name}</p>
                            <p>{singleRoutine.activities[0].description}</p>
                        </div> : <div> NO DATA LOADED </div>
                        }
                        <br />
                        <button value={singleRoutine.id} onClick={deleteButton}> Delete This Routine </button>
                    </div>
                    : <div>'No public routines to show'</div>
                    }
                    </div>
                )
            }) : <div> Jsx ternary error in routines.jsx...</div>
        }</div>
    </section>
)
}

export default Routines;   
   