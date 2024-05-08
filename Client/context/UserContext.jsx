import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/profile')
                setUser(response.data);
            } catch(err) {
                if(err.response) {
                    navigate('/login');
                    toast.error(err.response.data.err);
                }
            }
        };
        fetchData()
    }, [navigate]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            { children }
        </UserContext.Provider>
    )
}