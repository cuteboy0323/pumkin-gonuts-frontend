import { useEffect, useState, useContext } from 'react';

import { Web3Context } from 'contexts/web3';
import { useWeb3React } from '@web3-react/core';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import SwapVertIcon from '@mui/icons-material/SwapVert';

import { CHAIN_ID } from '../config/constants/networks';
import { CONTRACTS } from '../config';

import useAuth from 'hooks/useAuth';
import useToast from 'hooks/useToast';

import { TokenProps } from 'types/swap';
import { useWalletModal } from 'components/WalletModal';

const { TOKEN, SWAP } = CONTRACTS;

const Swap = () => {
    const { login, logout } = useAuth();
    const { toastSuccess, toastError } = useToast();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const [isLoading, setIsLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [inputTokenBalance, setInputTokenBalance] = useState();
    const [outputTokenBalance, setOutputTokenBalance] = useState();
    const [inputAmount, setInputAmount] = useState({
        number: '',
        wei: ''
    });
    const [outputAmount, setOutputAmount] = useState({
        number: '',
        wei: ''
    });
    const [isBuy, setIsBuy] = useState(true);

    const [inputToken, setInputToken] = useState<TokenProps>({
        symbol: 'BNB',
        icon: require('../assets/img/bnb.png'),
        isBase: true,
        decimal: 18,
        address: ''
    });

    const [outputToken, setOutputToken] = useState<TokenProps>({
        symbol: 'PUMPN',
        icon: require('../assets/img/pumpn.png'),
        address: TOKEN.ADDRESS,
        decimal: 9,
        isBase: false
    });

    const { web3 } = useContext(Web3Context);
    const { chainId, account } = useWeb3React();

    const fromWei = (val, decimal) => {
        if (decimal) {
            return val / 10 ** decimal;
        }
        if (val && web3) {
            return web3.utils.fromWei(val.toString());
        }
        return 0;
    };
    const toWei = (val, decimal) => {
        if (decimal) {
            return val * 10 ** decimal;
        }
        if (val && web3) {
            return web3.utils.toWei(val.toString());
        }
        return 0;
    };
    const toBN = (val) => {
        if (val && web3) {
            return new web3.utils.BN(String(val));
        }
    };
    const fn = (val = 0, decimal = 4) => {
        return Number(Number(val).toFixed(decimal)).toLocaleString();
    };

    const resetAmount = () => {
        setInputAmount({
            number: '',
            wei: ''
        });
        setOutputAmount({
            number: '',
            wei: ''
        });
    };

    const update = () => {
        if (!web3.eth || String(chainId) !== CHAIN_ID || !account) return;
        if (inputToken.isBase) {
            web3.eth.getBalance(account).then((balance) => {
                setInputTokenBalance(balance);
            });
        } else {
            const tokenIns = new web3.eth.Contract(
                TOKEN.BEP20_ABI,
                inputToken.address
            );
            tokenIns.methods
                .balanceOf(account)
                .call()
                .then((balance) => {
                    setInputTokenBalance(balance);
                });
        }
        if (outputToken.isBase) {
            web3.eth.getBalance(account).then((balance) => {
                setOutputTokenBalance(balance);
            });
        } else {
            const tokenIns = new web3.eth.Contract(
                TOKEN.BEP20_ABI,
                outputToken.address
            );
            tokenIns.methods
                .balanceOf(account)
                .call()
                .then((balance) => {
                    setOutputTokenBalance(balance);
                });
        }
    };

    useEffect(() => {
        if (!web3.eth || !account) return;
        if (!isBuy && inputAmount.wei) {
            const tokenIns = new web3.eth.Contract(
                TOKEN.BEP20_ABI,
                inputToken.address
            );
            tokenIns.methods
                .allowance(account, SWAP.ADDRESS)
                .call()
                .then((result) => {
                    const allowance = toBN(result);
                    const amount = toBN(inputAmount.wei);
                    if (allowance.lt(amount)) {
                        setIsApproved(false);
                    } else {
                        setIsApproved(true);
                    }
                });
        }
    }, [isBuy, inputAmount]);

    useEffect(() => {
        update();
    }, [account, web3, chainId, isBuy]);

    const buy = () => {
        setIsLoading(true);
        const iawb = toBN(inputAmount.wei);
        const swapIntance = new web3.eth.Contract(SWAP.ABI, SWAP.ADDRESS);
        swapIntance.methods
            .buy()
            .send({ from: account, value: iawb })
            .then(() => {
                setIsLoading(false);
                update();
                resetAmount();
                toastSuccess('Transaction Submitted Successfully');
            })
            .catch((e) => {
                e.message
                    ? toastError(e.message)
                    : toastError(`${e.toString().slice(0, 50)}...`);
                setIsLoading(false);
            });
    };

    const sell = () => {
        setIsLoading(true);
        const iawb = toBN(inputAmount.wei);
        const swapIntance = new web3.eth.Contract(SWAP.ABI, SWAP.ADDRESS);
        swapIntance.methods
            .sell(iawb)
            .send({ from: account })
            .then(() => {
                setIsLoading(false);
                update();
                resetAmount();
                toastSuccess('Transaction Submitted Successfully');
            })
            .catch((e) => {
                e.message
                    ? toastError(e.message)
                    : toastError(`${e.toString().slice(0, 50)}...`);
                setIsLoading(false);
            });
    };

    const approve = () => {
        setIsLoading(true);
        const tokenInstance = new web3.eth.Contract(
            TOKEN.BEP20_ABI,
            inputToken.address
        );
        const amount = toBN(inputTokenBalance);
        tokenInstance.methods
            .approve(SWAP.ADDRESS, amount)
            .send({ from: account })
            .then(() => {
                setIsLoading(false);
                setIsApproved(true);
                toastSuccess('Transaction Submitted Successfully');
            })
            .catch((e) => {
                e.message
                    ? toastError(e.message)
                    : toastError(`${e.toString().slice(0, 50)}...`);
                setIsLoading(false);
            });
    };

    const updateOutByInput = (value: any) => {
        const swapIns = new web3.eth.Contract(SWAP.ABI, SWAP.ADDRESS);
        const iawb = toBN(value);
        if (Number(value) <= 0) {
            return setOutputAmount({
                number: '',
                wei: ''
            });
        }
        if (isBuy) {
            swapIns.methods
                .getAmountOutFromBuy(iawb)
                .call()
                .then(({ amountOut }) => {
                    setOutputAmount({
                        number: fromWei(amountOut, outputToken.decimal),
                        wei: amountOut
                    });
                });
        } else {
            swapIns.methods
                .getAmountOutFromSell(iawb)
                .call()
                .then(({ amountOut }) => {
                    setOutputAmount({
                        number: fromWei(amountOut, outputToken.decimal),
                        wei: amountOut
                    });
                });
        }
    };

    const updateInByOutput = (value) => {
        const swapIns = new web3.eth.Contract(SWAP.ABI, SWAP.ADDRESS);
        if (Number(value) <= 0) {
            return setInputAmount({
                number: '',
                wei: ''
            });
        }
        const oawb = toBN(value);
        if (isBuy) {
            swapIns.methods
                .getAmountInFromBuy(oawb)
                .call()
                .then(({ amountIn }) => {
                    setInputAmount({
                        number: fromWei(amountIn, inputToken.decimal),
                        wei: amountIn
                    });
                });
        } else {
            swapIns.methods
                .getAmountInFromSell(oawb)
                .call()
                .then(({ amountIn }) => {
                    setInputAmount({
                        number: fromWei(amountIn, inputToken.decimal),
                        wei: amountIn
                    });
                });
        }
    };

    const handleChange = (event) => {
        const {
            target: { id, value }
        } = event;
        if (id === 'input-token') {
            updateOutByInput(toWei(value, inputToken.decimal));
            setInputAmount({
                wei: toWei(value, inputToken.decimal),
                number: value
            });
        } else {
            updateInByOutput(toWei(value, outputToken.decimal));
            setOutputAmount({
                wei: toWei(value, outputToken.decimal),
                number: value
            });
        }
    };

    const setMax = () => {
        updateOutByInput(inputTokenBalance);
        setInputAmount({
            number: fromWei(inputTokenBalance, inputToken.decimal),
            wei: inputTokenBalance
        });
    };

    const exchangeBaseQuote = () => {
        const tempB = outputToken;
        const tempQ = inputToken;
        setInputToken(tempB);
        setOutputToken(tempQ);
        setIsBuy(!isBuy);
        setInputAmount(outputAmount);
        setOutputAmount(inputAmount);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    mt: 4,
                    margin: 'auto',
                    boxShadow: '6px 2px 12px 0px rgba(0, 0, 0, 0.1)',
                    maxWidth: (theme) => theme.spacing(47.5),
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                        {
                            margin: 0,
                            WebkitAppearance: 'none'
                        },
                    '& input[type=number]': {
                        MozAppearance: 'textfield'
                    }
                }}
            >
                <Stack
                    alignItems="center"
                    direction="column"
                    sx={{ pt: 2, mb: 2 }}
                >
                    <Typography variant="h5">Swap</Typography>
                    <Typography color="textSecondary">
                        Trade tokens in an instant
                    </Typography>
                    <Divider
                        flexItem
                        sx={{
                            mt: 2
                        }}
                    />
                </Stack>
                <CardContent
                    component={Stack}
                    alignItems="center"
                    direction="column"
                    sx={{
                        p: (theme) => theme.spacing(2, 4)
                    }}
                >
                    <Stack
                        direction={'column'}
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Stack
                            direction={'row'}
                            alignItems="center"
                            justifyContent={'space-between'}
                        >
                            <Stack
                                direction={'row'}
                                alignItems="center"
                                spacing={1}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        width: (theme) => theme.spacing(4)
                                    }}
                                    src={inputToken.icon}
                                />
                                <Typography>{inputToken.symbol}</Typography>
                            </Stack>
                            <Typography color="textSecondary">
                                {(() => {
                                    if (!inputTokenBalance) {
                                        return (
                                            <Stack
                                                component="span"
                                                direction="row"
                                                alignItems="center"
                                            >
                                                Balance:
                                                <Skeleton
                                                    animation="wave"
                                                    sx={{
                                                        ml: 1,
                                                        minWidth: (theme) =>
                                                            theme.spacing(8)
                                                    }}
                                                />
                                            </Stack>
                                        );
                                    }
                                    return `Balance: ${fn(
                                        fromWei(
                                            inputTokenBalance,
                                            inputToken.decimal
                                        ),
                                        6
                                    )}`;
                                })()}
                            </Typography>
                        </Stack>
                        <TextField
                            id="input-token"
                            margin="normal"
                            type="number"
                            inputProps={{
                                placeholder: '0.00',
                                min: 0,
                                step: 0.01
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    background: 'rgba(85, 119, 253, 0.1)'
                                },
                                '& fieldset': {
                                    border: 'none'
                                }
                            }}
                            disabled={
                                !account || !inputTokenBalance || isLoading
                            }
                            value={inputAmount.number}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={setMax}
                                            disabled={!inputTokenBalance}
                                            sx={{
                                                minWidth: (theme) =>
                                                    theme.spacing(5),
                                                ml: 1
                                            }}
                                        >
                                            Max
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Divider>
                            <IconButton
                                onClick={exchangeBaseQuote}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, .05)',
                                    mt: 2,
                                    mb: 2
                                }}
                            >
                                <SwapVertIcon />
                            </IconButton>
                        </Divider>
                        <Stack
                            direction={'row'}
                            alignItems="center"
                            justifyContent={'space-between'}
                        >
                            <Stack
                                direction={'row'}
                                alignItems="center"
                                spacing={1}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        width: (theme) => theme.spacing(4)
                                    }}
                                    src={outputToken.icon}
                                />
                                <Typography>{outputToken.symbol}</Typography>
                            </Stack>
                            <Typography color="textSecondary">
                                {(() => {
                                    if (!outputTokenBalance) {
                                        return (
                                            <Stack
                                                component="span"
                                                direction="row"
                                                alignItems="center"
                                            >
                                                Balance:
                                                <Skeleton
                                                    animation="wave"
                                                    sx={{
                                                        ml: 1,
                                                        minWidth: (theme) =>
                                                            theme.spacing(8)
                                                    }}
                                                />
                                            </Stack>
                                        );
                                    }
                                    return `Balance: ${fn(
                                        fromWei(
                                            outputTokenBalance,
                                            outputToken.decimal
                                        ),
                                        4
                                    )}`;
                                })()}
                            </Typography>
                        </Stack>
                        <TextField
                            id="output-token"
                            margin="normal"
                            type={'number'}
                            inputProps={{
                                placeholder: '0.00',
                                min: 0,
                                step: 0.01
                            }}
                            disabled={
                                !account || !outputTokenBalance || isLoading
                            }
                            value={outputAmount.number}
                            onChange={handleChange}
                            sx={{
                                '& .MuiInputBase-root': {
                                    background: 'rgba(85, 119, 253, 0.1)'
                                },
                                '& fieldset': {
                                    border: 'none'
                                }
                            }}
                        />
                        {(() => {
                            if (!account) {
                                return (
                                    <LoadingButton
                                        size="large"
                                        variant="contained"
                                        onClick={onPresentConnectModal}
                                        sx={{
                                            mt: 2
                                        }}
                                    >
                                        Connect Wallet
                                    </LoadingButton>
                                );
                            } else {
                                if (
                                    !inputAmount.number ||
                                    !outputAmount.number
                                ) {
                                    return (
                                        <LoadingButton
                                            size="large"
                                            variant="contained"
                                            disabled
                                            sx={{
                                                mt: 2
                                            }}
                                        >
                                            Enter an amount
                                        </LoadingButton>
                                    );
                                }
                                const iawb = toBN(inputAmount.wei);
                                const btbb = toBN(inputTokenBalance);
                                if (iawb.gt(btbb)) {
                                    return (
                                        <LoadingButton
                                            size="large"
                                            variant="contained"
                                            disabled
                                            sx={{
                                                mt: 2
                                            }}
                                        >
                                            Insufficient {inputToken.symbol}{' '}
                                            balance
                                        </LoadingButton>
                                    );
                                }
                                if (isBuy) {
                                    return (
                                        <LoadingButton
                                            loading={isLoading}
                                            size="large"
                                            variant="contained"
                                            onClick={buy}
                                            sx={{
                                                mt: 2
                                            }}
                                        >
                                            Buy
                                        </LoadingButton>
                                    );
                                } else {
                                    if (isApproved) {
                                        return (
                                            <LoadingButton
                                                loading={isLoading}
                                                size="large"
                                                variant="contained"
                                                onClick={sell}
                                                sx={{
                                                    mt: 2
                                                }}
                                            >
                                                SELL
                                            </LoadingButton>
                                        );
                                    } else {
                                        return (
                                            <LoadingButton
                                                loading={isLoading}
                                                size="large"
                                                variant="contained"
                                                onClick={approve}
                                                sx={{
                                                    mt: 2
                                                }}
                                            >
                                                approve
                                            </LoadingButton>
                                        );
                                    }
                                }
                            }
                        })()}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Swap;
