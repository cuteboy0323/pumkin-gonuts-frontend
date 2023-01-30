// import { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';

// import Loadable from 'components/Loadable';

// const Landing = Loadable(lazy(() => import('../pages/Landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([
        { path: '/', element: <Navigate to="/swap" /> },
        MainRoutes
    ]);
}
