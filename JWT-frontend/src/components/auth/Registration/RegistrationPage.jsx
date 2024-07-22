import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../service/UserService";
import styles from './Registration.module.css'
function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        role:'',
        city:''
    });

    const handleInputChange = (e) =>{
        const {name,value} = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');
            const response = await UserService.register(formData,token);

            //clear the form afterwards
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: '',
            })

            alert('uyu msee ashatu join');
            navigate('admin/user-management');

        }catch(error){
            console.error('Error registering user:', error);
            alert('An error occurred while registering user');
        }
    }

    return (
        <div className={styles.container}>
            <h1>Registration Page</h1>
            <div className={styles.regForm}>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name"/>
                <input type="text" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email"/>
                <input type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password"/>
                <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Role"/>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City"/>

                <button type="submit">Register</button>
            </form>
            </div>
        </div>
    )
}

export default RegistrationPage;