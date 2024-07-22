import { useEffect, useState } from "react";
import axios from "axios";
import UserService from "../../service/UserService";
import styles from './ProfilePage.module.css';


function ProfilePage() {  
    const [profileInfo, setProfileInfo] = useState({});
    const [records, setRecords] = useState([]);

   // Fetch profile info
   const fetchProfileInfo = async () => {
    try {
        if (token) {
            console.log('my profile page token is : ', token);
            const response = await UserService.getProfile(token);
            setProfileInfo(response.data.ourUsers);
        }else{
            console.log('empty token broo my profile page token is : ', token);
        }
    } catch (error) {
        console.log('Error fetching profile info:', error);
    }
};

    // Fetch records
    const fetchRecords = async () => {
        try {
            const res = await axios.get('https://reqres.in/api/users?page=2');
            setRecords(res.data.data);
        } catch (err) {
            console.log('Error fetching records:', err);
        }
    };

    // Refresh the profile page whenever the component is mounted
    useEffect(() => {
        fetchProfileInfo();
        fetchRecords();
    }, []);

    const recordList = records.map((record) => <li key={record.id}>{record.email}</li>);

    return (
        <>
            <div className={styles.container}>
                <h2>My Profile</h2>
                <p>Name: {profileInfo.name}</p>
                <p>Email: {profileInfo.email}</p>
                <p>City: {profileInfo.city}</p>
            </div>
            <div className={styles.container}>
                <h1>My Clients</h1>
                <ol>
                    {recordList}
                </ol>
            </div>
        </>
    );
}

export default ProfilePage;
