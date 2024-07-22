import axios from 'axios';

class UserService {
    static BASE_URL = 'http://localhost:1010';
    static accessToken = null;

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
        
            if (response.data.token) {
                UserService.accessToken = response.data.token;
                localStorage.setItem('role', response.data.role);
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    static getAccessToken() {
        return UserService.accessToken;
    }

    static async refreshToken() {
        try {
             // Note: 'withCredentials: true' ensures cookies are sent with the request
             const response = await axios.get(${UserService.BASE_URL}/auth/refresh, { withCredentials: true });
             console.log('my desired response is : ', response);
            if (response.data.token) {
                UserService.accessToken = response.data.token;
            }
            return response.data.token;
        } catch (error) {
            throw error;
        }
    }

   

    static async register(userData, token){
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}            
                }
            )
            return response;

        }catch(error){
            throw error;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`,
                 {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        }catch(error){
            throw error;
        }
    }

    static async getProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId,token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;
        }catch(error){
            throw error;
        }
    }

    static async deleteUser(userId,token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        }catch(error){
            throw error;
        }
    }

    static async updateUser(userId,userData,token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`,userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );
            return response.data;

        }catch(error){
            throw error;
        }
    }

    /* AUTHENTICATION CHECKERS*/
    static logout() {
        UserService.accessToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated(){
        const token = UserService.getAccessToken();
        return !!token;
    }

    static isAdmin(){
        const role = UserService.getAccessToken();
        return role ==='ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;   