import React from 'react';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthContext';
import { Register } from './Register';
import '@testing-library/jest-dom'

test("Register test", () => {
  // Create a router with the memory history
  const router = createBrowserRouter([
    { path: '/', element: <Register />},
    { path: '/Register', element: <Register />},
    { path: '/User', element: <Register />},
    { path: '/Login', element: <Register />},
    ]
  );

  render(
    <AuthProvider>
      < RouterProvider router={router}>
        <Register/>
      </RouterProvider>
    </AuthProvider>
  );

  expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
});