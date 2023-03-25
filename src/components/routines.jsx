import { useState, useEffect } from 'react';

const Routines = (props) => {

    const { routinesProps } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const DATABASE_URL = `postgres://localhost:5432/fitness-dev`;

// FILTER WITH SEARCHBOX & SET TO LOWERCASE
    let filteredRoutines = routinesProps.filter((singleRoutinesElement) => {
        let lowercasedCreatorId = singleRoutinesElement.creatorId.toLowerCase();
        let lowercasedName = singleRoutinesElement.name.toLowerCase();
        let lowercasedGoal = singleRoutinesElement.goal.toLowerCase();
        return lowercasedName.includes(searchQuery.toLowerCase()) || 
            lowercasedGoal.includes(searchQuery.toLowerCase()) ||
            lowercasedCreatorId.includes(searchQuery.toLowerCase())
    })

// FETCH DATA FROM DB
    const fetchData = async () => {
        try {
            const response = await fetch (`${DATABASE_URL}/routines`);
            const translatedData = await response.json();
            props.setRoutinesProps(translatedData.routines)
        }   catch (error) {
            document.body.style.cursor = "wait";
            console.log("Error w/ fetchData func in routines.jsx", error);
        }
    };
    useEffect(() => {
        fetchData()
    },[]);

    return (
        <section>
            <div>
{/* SEARCHBOX */}
                <input 
                    className="searchbox"
                    type="text"
                    placeholder="Search Routines..."
                    onChange={(event) => {
                            setSearchQuery(event.target.value)
                    }}>
                </input>
            </div>
                <br/>
{/* ANY USER NOT LOGGED IN */}
            <div>{
                filteredRoutines.length && filteredRoutines.isPublic ? filteredRoutines.map((singleRoutinesElement, i) => {
                    return (
                        <div key={id}> 
                            <p>Routine: {name}</p>
                            <p>Goal: {goal}</p>
                            <p>Created by: {creatorName}</p>
                        <br />
                        <br />
                            {activities.length ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Count</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities.map(({ id, name, description, count, duration}) => (
                                            <tr key={id} >
                                                <td>{name}</td>
                                                <td>{description}</td>
                                                <td>{count}</td>
                                                <td>{duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : ""}
                        </div>
                    )
                }) : <div> No post matching your request. Try Again
                </div>
            }</div>
        </section>
    )
}

export default Routines;

{/* <div key={i}> 
<p to={`/routines/${singleRoutinesElement._id}`}> {singleRoutinesElement.name} </p>
<p>Goal: {singleRoutinesElement.goal}</p>
<p>Creator Id: {singlePostElement.creatorId}</p>
<br/>                  
</div> */}






// return (
//     <div>
//         <h1>Routines</h1>
//         {routines.map(({id, creatorName, goal, name, activities }) => (
//             <div key={id}> 
//                 <p>Routine: {name}</p>
//                 <p>Created by: {creatorName}</p>
//                 <p>Goal: {goal}</p>
//                 <br />
//                 <br />
//                 {activities.length ? (
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Description</th>
//                                 <th>Count</th>
//                                 <th>Duration</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {activities.map(({ id, name, description, count, duration}) => (
//                                 <tr key={id} >
//                                     <td>{name}</td>
//                                     <td>{description}</td>
//                                     <td>{count}</td>
//                                     <td>{duration}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : ""}
//             </div>
//         ))}           
//     </div>   
// )
// }