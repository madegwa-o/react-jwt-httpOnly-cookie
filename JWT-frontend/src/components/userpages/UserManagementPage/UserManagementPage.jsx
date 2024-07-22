import { useEffect, useState } from "react";
import UserService from "../../service/UserService";
import styles from './UserManagementPage.module.css'
import { Link } from "react-router-dom";

function UserManagementPage(){
    const[users,setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    },[]);

    const fetchUsers = async () => {
        try {
            const token = UserService.getAccessToken();
            console.log('my user management page token is : ',token);

            const response = await UserService.getAllUsers(token);
            
            if (Array.isArray(response.ourUsersList)) {
                setUsers(response.ourUsersList);
            } else {
                setUsers([]); // Set to empty array if the response is not as expected
            }

        }catch(error){
            console.error('Error fetching users:',error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const confirmDelete =  window.confirm('Do you hate this user');
            const token = localStorage.getItem('token');
            if(confirmDelete){
                await UserService.deleteUser(userId,token);
                fetchUsers();
            }

        }catch(error){
            console.error('Error deleting users:',error);
        }
    }

    return(
        <div className={styles.pageContainer}>
                <h1>users</h1>
                <button className={styles.button}><Link to='/register'>Add User</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className={styles.Button} onClick={() => deleteUser(user.id)}>Delete Me</button>
                                    <button className={styles.Button}><Link to={`/update-user/${user.id}`}>Update</Link></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    )


}

export default UserManagementPage;