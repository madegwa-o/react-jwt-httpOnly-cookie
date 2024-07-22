import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/navbar/Navbar';
import LoginPage from './components/auth/Login/LoginPage';
import RegistrationPage from './components/auth/Registration/RegistrationPage';
import FooterComponent from './components/common/footer/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userpages/updateUser/UpdateUser';
import UserManagementPage from './components/userpages/UserManagementPage/UserManagementPage';
import ProfilePage from './components/userpages/profilePage/ProfilePage';
import styles from './App.module.css';



function App(){
  
  
  return(
      <div className={styles.body}>
        
        <div>
          <BrowserRouter>
    
            <div className={styles.head}>
            <h1>Guava</h1>
            <Navbar/>
            </div>
            
            <div className={styles.content}>
              <Routes>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/profile" element={<ProfilePage />} />
                {UserService.adminOnly() && (
                  <>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/admin/user-management" element={<UserManagementPage />} />
                    <Route path="/update-user/:userId" element={<UpdateUser />} />
                  </>
                )}
                <Route path="*" element={<Navigate to='login' />}/>
              </Routes>
            </div>
            <div className={styles.footer}>
                <FooterComponent />
            </div>
      
          </BrowserRouter>
     
        </div>
      </div>
  )

}

export default App;