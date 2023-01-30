import { lazy } from 'react';

// project imports
import Layout from 'layouts';
import Loadable from 'components/Loadable';

const Swap = Loadable(lazy(() => import('pages/Swap')));

const MainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
        {
            path: '/swap',
            element: <Swap />
        }
    ]
};

export default MainRoutes;
