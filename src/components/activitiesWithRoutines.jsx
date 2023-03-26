import {useParams, Link} from "react-router-dom";
import { useEffect, useState } from "react";
const DATABASE_URL = `http://localhost:1337/api`

const ActWithRoutine = (props) => {
    const { activityId } = useParams();
    const [publicRoutine, setPublicRoutine] = useState([]);

    useEffect(() => {
        getPublicRoutineActivities();
    }, []);

    const getPublicRoutineActivities = async () => {
        console.log("gPR actId", activityId)
        try {
          const response = await fetch(`${DATABASE_URL}/activities/${activityId}/routines`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const translatedData = await response.json();
          console.log(translatedData);
          if (translatedData) {
            setPublicRoutine(translatedData);
          } else {
            console.log("This is the error with public routine w/ act", error);
          };
          
        } catch (err) {
          console.error(err);
        }
      }
    return (
        <div> See all the routines from the activity! 
        {
            publicRoutine.isPublic  ?
            publicRoutine.map((singleRoutine, index)=> {
                return (
                    <section key={index}>
                        <h2> Routine: {singleRoutine.name}</h2>
                        <h2> Routine goal: {singleRoutine.goal}</h2>
                        {
                            publicRoutine.activities ?
                            publicRoutine.activities.map((activity, index)=> {
                                return (
                                    <section key={index}>
                                        <h2> Activity: {activity.name}</h2>
                                        <h2> Activity Description: {activity.description}</h2>
                                        <h2> Duration: {activity.duration}</h2>
                                        <h2> Count: {activity.count}</h2>
                                    </section>
                                )
                            }): <div> no activity data</div>
                            
                        }
                    </section>
                )
            }) : <div> no routine data </div>
        }
        </div>
    )
};

export default ActWithRoutine;