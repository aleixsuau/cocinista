import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { AuthProviderAPI, AuthProviderProps } from '../typings';

const AuthContext = createContext<AuthProviderAPI | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthtProvider');
  }

  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeFn = onAuthStateChanged(getAuth(), user => {
      setUser(user);
    });

    return unsubscribeFn;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  return signInWithPopup(auth, provider);
}

const logout = () => signOut(getAuth());
