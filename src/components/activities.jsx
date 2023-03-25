import React from "react";
import { useState } from "react";
const DATABASE_URL = `postgres://localhost:5432/fitness-dev`


const CreateActivity = ({ activity, setActivity }) => {
    const [name, setName] = useState([]);
    const [description, setDescription] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            console.log('name, description:', name, description);
            const response = await fetch(`${DATABASE_URL}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                },
                body: JSON.stringify({
                    activity: {
                        name,
                        description,
                    }
                })
            });
            const data = await response.json();
            console.log('data', data);
            setActivity([...activity]);

            setName('');
            setDescription('');

            document.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div>
            <div>
                <h4>
                    Create an activity!
                </h4>

                <form onSubmit={submitHandler}>
                    <input
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="description"
                        placeholder="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit">
                        Submit
                    </button>

                </form>
            </div>
        </div>

    )

}

export default CreatePost;