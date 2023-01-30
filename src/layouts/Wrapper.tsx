import Box from '@mui/material/Box';

interface WrapperProps {
    children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => (
    <Box
        sx={{
            minHeight: 'calc(100vh - 82px - 65px)'
        }}
    >
        {children}
    </Box>
);

export default Wrapper;
