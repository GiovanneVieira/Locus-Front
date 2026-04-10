import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { queryClient } from '@/lib/queryClient';
import { router } from './routes/routes';
import { Toaster } from 'sonner';
import { Spinner } from './components/ui/spinner';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <RouterProvider router={router} />
                    <Toaster
                        richColors
                        position="top-right"
                        icons={{
                            loading: <Spinner className='text-card'/>,
                        }}></Toaster>
                </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
