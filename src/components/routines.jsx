import React from 'react';

const Routines = ({routines}) => {
    
    return (
        <div>
            <h1>Routines</h1>
            {routines.map(({id, creatorName, goal, name, activities }) => (
                <div key={id}> 
                    <p>Routine: {name}</p>
                    <p>Created by: {creatorName}</p>
                    <p>Goal: {goal}</p>
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
            ))}           
        </div>   
    )
}

export default Routines;