import React from 'react';
import { Login } from './Login';

export function Register() {
  // Renders the same unified auth component, which uses current location to show signup state.
  return <Login />;
}
