/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { UserContext } from './AuthContext';

// Teaching material: returning any for simplicity
export const useAuthContext = (): any => useContext(UserContext);
