// frontend/app/index.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screen/HomeScreen';

export default function HomeRoute() {
  const { user, signOut } = useContext(AuthContext);
  return <HomeScreen user={user} onSignOut={signOut} />;
}
