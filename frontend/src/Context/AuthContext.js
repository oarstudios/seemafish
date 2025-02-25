
// create context 
// create reducer
// create context provider
    // use the created reducer 
    // create function for storage change 
    // useEffect for storage 
    // function to update local storage manually 

    import { createContext, useReducer, useEffect } from 'react';

    // create context 
    // create reducer
    // create context provider
        // use the created reducer 
        // create function for storage change 
        // useEffect for storage 
        // function to update local storage manually 
    
    
    export const AuthContext = createContext();
    
    export const authReducer = (state, action) => {
        switch (action.type) {
            case 'LOGIN':
                return { user: action.payload.user, token: action.payload.token };
            case 'LOGOUT':
                return { user: null };
            default:
                return state;
        }
    };
    
    export const AuthContextProvider = ({ children }) => {
        const [state, dispatch] = useReducer(authReducer, {
            user: null,
        });
    
        // Function to handle localStorage change
        const handleStorageChange = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        };
    
        useEffect(() => {
            // Get user from localStorage on component mount
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('authcontext', user);
            if (user) {
                dispatch({ type: 'LOGIN', payload: user });
            }
    
            // Listen for changes to localStorage in other tabs/windows
            window.addEventListener('storage', handleStorageChange);
    
            // Clean up the event listener when the component is unmounted
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }, []);
    
        // Manually trigger handleStorageChange on login/logout within the same tab
        const manualUpdate = (user) => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                localStorage.removeItem('user');
                dispatch({ type: 'LOGOUT' });
            }
            handleStorageChange(); // Trigger manually in case of updates in the same tab
        };
    
        return (
            <AuthContext.Provider value={{ ...state, dispatch, manualUpdate }}>
                {children}
            </AuthContext.Provider>
        );
    };
    