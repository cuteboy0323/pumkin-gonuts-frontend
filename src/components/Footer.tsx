import { AppBar, Toolbar, Container, Typography } from '@mui/material';

const Footer = () => (
    <Container>
        <AppBar
            component="footer"
            position="static"
            sx={{
                boxShadow: 'none',
                borderColor: 'divider',
                borderStyle: 'dashed',
                borderWidth: 1,
                borderBottom: 'none',
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                bgcolor: 'background.paper',
                backgroundImage: 'none'
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'center',
                    minHeight: 64
                }}
            >
                <Typography color="textSecondary">
                    Powered by TrueDefi
                </Typography>
            </Toolbar>
        </AppBar>
    </Container>
);

export default Footer;
