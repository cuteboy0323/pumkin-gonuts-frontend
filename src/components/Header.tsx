import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';

import { StackProps } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import { useWeb3React } from '@web3-react/core';
import { useWalletModal } from './WalletModal';

import { BASE_BSC_SCAN_URL } from 'config';

import MaterialUISwitch from './ToggleSwitch';

import { isMobile } from 'react-device-detect';

const Header = () => {
    const { isDark, onChangeThemeMode } = useConfig();
    const { login, logout } = useAuth();
    const { account } = useWeb3React();
    const { onPresentConnectModal } = useWalletModal(login, logout);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const WalletDetail: React.FC<StackProps> = (props) => {
        return (
            <Stack
                {...props}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    bgcolor: 'background.default',
                    padding: (theme) => theme.spacing(4.25 / 8, 5 / 8),
                    borderRadius: 1
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton size="small">
                        <AccountBalanceWalletRoundedIcon />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary">
                        {account &&
                            `${account.substring(0, 8)} ... ${account.substring(
                                account.length - 8
                            )}`}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                        <CopyToClipboard text={account}>
                            <IconButton size="small">
                                <ContentCopyRoundedIcon fontSize="small" />
                            </IconButton>
                        </CopyToClipboard>
                        <Link
                            underline="none"
                            target="_blank"
                            href={`${BASE_BSC_SCAN_URL}/address/${account}`}
                        >
                            <IconButton size="small">
                                <TravelExploreRoundedIcon fontSize="small" />
                            </IconButton>
                        </Link>
                    </Stack>
                </Stack>
                <IconButton
                    onClick={logout}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        ml: 1,
                        borderRadius: 0.75
                    }}
                >
                    <LogoutRoundedIcon />
                </IconButton>
            </Stack>
        );
    };

    return (
        <Container>
            <AppBar
                position="static"
                sx={{
                    boxShadow: 'none',
                    borderColor: 'divider',
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderTop: 'none',
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    bgcolor: 'background.paper',
                    backgroundImage: 'none'
                }}
            >
                <Toolbar sx={{ height: (theme) => theme.spacing(10) }}>
                    <Box
                        component="img"
                        src={require('../assets/img/logo.png')}
                        alt="logo"
                        sx={{
                            height: '100%',
                            py: 2
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <MaterialUISwitch
                        checked={isDark}
                        onChange={onChangeThemeMode}
                        sx={{
                            mx: 2
                        }}
                    />
                    {(() => {
                        if (account) {
                            if (!isMobile) {
                                return <WalletDetail />;
                            }
                            return (
                                <Button
                                    onClick={handlePopoverOpen}
                                    variant="outlined"
                                    size="large"
                                >
                                    {account && `${account.substring(0, 4)}...`}
                                </Button>
                            );
                        } else {
                            if (!isMobile) {
                                return (
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Button
                                            onClick={onPresentConnectModal}
                                            variant="contained"
                                            size="large"
                                        >
                                            Connect Wallet
                                        </Button>
                                    </Stack>
                                );
                            }
                            return (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Button
                                        onClick={onPresentConnectModal}
                                        variant="contained"
                                        size="large"
                                    >
                                        <AccountBalanceWalletRoundedIcon />
                                    </Button>
                                </Stack>
                            );
                        }
                    })()}
                </Toolbar>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <WalletDetail />
                </Popover>
            </AppBar>
        </Container>
    );
};

export default Header;
