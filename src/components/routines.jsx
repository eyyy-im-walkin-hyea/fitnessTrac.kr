import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const Routines = (props) => {

    const DATABASE_URL = `http://localhost:1337/api`
    const myJWT = localStorage.getItem("token");

    // ALL YOUR STATE ARE BELONG TO US!!
    const[routines, setRoutines] = useState([]);
    const[routineName, setRoutineName] = useState('');
    const[routineGoal, setRoutineGoal] = useState('');
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
    const postRoutinesData = async () => {
        try {
            const response = await fetch(`${DATABASE_URL}/routines`, {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myJWT}`
                },
                body: JSON.stringify({
                name: routineName,
                goal: routineGoal,
                isPublic: true
                })
            });
            const result = await response.json();
                console.log(result);
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
    const deleteRoutinesData = async () => {
        try {
          const response = await fetch(`${DATABASE_URL}/routines/${id}`, {
            method: "DELETE",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJWT}`
            },
          });
          const result = await response.json();
          console.log(result);
          return result
        } catch (error) {
          console.error("Error w/ deleteRoutinesData",error);
        }
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
    deleteRoutinesData();
    postRoutinesIdActivitiesData();
    getActivitiesData();
}, []);

// props userData setUserData
return (
    <section>
        <div>{
             routines.length ? routines.map((singleRoutine) => {
                return (
                    <div key={singleRoutine.id}> 
                    { singleRoutine.isPublic ? 
                    <div>
                        <p>ROUTINE: {singleRoutine.name}</p>
                        <p>GOAL: {singleRoutine.goal}</p>
                        <br />
                        <p>ACTIVITIES: </p>

                        { activities.length ? activities.map((singleActivity) => {
                        return (
                            <div key={singleActivity.id}>
                                <p>NAME: {singleActivity.name}</p>
                                <p>DESCRIPTION: {singleActivity.description}</p>
                                <p>COUNT: {singleActivity.count}</p>
                                <p>DURATION: {singleActivity.duration}</p>
                                <br />
                            </div>
                        )      
                        }) : "" }

                        {/* <p>Created by: {creatorName}</p> */}
                        {/* {console.log("CL FROM JSX ",singleRoutine)} */}
                    </div>
                    : <div>'No public routines to show'</div>
                    }
                    {/* { activities.length ? activities.map((singleActivity) => {
                        return (
                            <div key={singleActivity.id}>
                                <p>NAME: {singleActivity.name}</p>
                                <p>DESCRIPTION: {singleActivity.description}</p>
                                <p>COUNT: {singleActivity.count}</p>
                                <p>DURATION: {singleActivity.duration}</p>
                                <br />
                                <br />
                            </div>
                        )      
                        }) : "" } */}
                    </div>
                )
            }) : <div> Nothing matching your ternary...</div>
        }</div>
    </section>
)
}

export default Routines;   
   