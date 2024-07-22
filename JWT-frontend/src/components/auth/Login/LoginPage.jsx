import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/service/setupAxiosInterceptors';  
import styles from './Login.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userData = await login(email, password);
        console.log(userData);
        if (userData.data.token) {
            localStorage.setItem('role', userData.data.role);
            navigate('/profile');
        } else {
            setError(userData.message);
        }
    } catch (error) {
        setError(error.message);
        setTimeout(() => {
            setError('');
        }, 5000);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
  };

  return (
    <div className={styles.container}>
        <h1>Login</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.LoginForm}>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className={styles.username}>
                        <input type="text" onChange={handleEmailChange} placeholder="Your Email" />
                    </div>
                    <div className={styles.password}>
                        <input type="password" onChange={handlePasswordChange} placeholder="Your Password" />
                    </div>
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    </div>
  );
}

export default LoginPage;

