import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../service/UserService";

function UpdateUser(){

    const navigate = useNavigate();
    const { userId } = useParams();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
        city: ''
    });


    useEffect(() => {
        fetchUserDataById(userId);
    },[userId]);

    const fetchUserDataById = async (userId) => {
        try {
            const token = UserService.getAccessToken();
            const response = await UserService.getUserById(userId,token);
            const {name,email,role,city} = response.ourUsers;
            setUserData({name,email,role,city});

        }catch(error){
            console.error('error fetching  user data: ',error)
        }
    };

    const handleIputChange = (e) => {
        const {name, value} = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const confirmUpdate = window.confirm('You hate me, Dont you');
            if (confirmUpdate){
                const token = localStorage.getItem('token');
                const response = await UserService.deleteUser(userId,userData,token);
                console.log(response)
                navigate('/admin/user-management')
            }

        }catch(error){
            console.error('Error updating user profile:', error);
            alert(error)
        }
    }

    return(
        <div>
            <h2>update this mof**</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"name="name" value={userData.name} onChange={handleIputChange} />
                <input type="text"name="email" value={userData.email} onChange={handleIputChange} />
                <input type="text"name="role" value={userData.role} onChange={handleIputChange} />
                <input type="text"name="city" value={userData.city} onChange={handleIputChange} />
                <button type="submit">Update</button>
            </form>

        </div>
    );
}
export default UpdateUser;