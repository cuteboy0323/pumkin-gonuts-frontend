import Header from 'components/Header';
import Footer from 'components/Footer';

import Wrapper from './Wrapper';

import Stack from '@mui/material/Stack';

import { Outlet } from 'react-router-dom';

const MainLayout = () => (
    <Stack>
        <Header />
        <Wrapper>
            <Outlet />
        </Wrapper>
        <Footer />
    </Stack>
);

export default MainLayout;
