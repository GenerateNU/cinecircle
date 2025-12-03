import HomeScreen from '../../screen/HomeScreen';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
export default function HomeRoute() {
    const { user, signOut } = useContext(AuthContext);
    return <HomeScreen user={user} onSignOut={signOut}/>
}