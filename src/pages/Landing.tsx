import { Button, ButtonProps } from '@mui/material';
import { useWalletModal } from 'components/WalletModal';
import useAuth from 'hooks/useAuth';

const Landing = ({ children, ...props }: ButtonProps) => {
    const { login, logout } = useAuth();
    const { onPresentConnectModal } = useWalletModal(login, logout);

    return (
        <Button onClick={onPresentConnectModal} {...props}>
            Connect Wallet
        </Button>
    );
};

export default Landing;
