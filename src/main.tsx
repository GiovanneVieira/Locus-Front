import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { queryClient } from '@/lib/queryClient';
import { router } from './routes/routes';
import { AuthLoader } from './components/auth/AuthLoader';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthLoader>
                <ThemeProvider>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </AuthLoader>
        </QueryClientProvider>
    </StrictMode>,
);