import { EnvProps, ConfigProps } from 'types/config';
import { CHAIN_ID } from './constants/networks';

const NODE_ENV = process.env.NODE_ENV;

// ** Secret config variables should be located in .env. [Todo]
const ENV: EnvProps = {
    development: {},
    production: {},
    test: {}
};

const Config: ConfigProps = {
    env: ENV[NODE_ENV],
    isDark: false
};

export const CIDS = {
    MAINNET: 56,
    TESTNET: 97
};

export const CONTRACTS_STORE = {
    [CIDS.MAINNET]: {
        TOKEN: {
            ADDRESS: '0x3B87Fa66d15FeC22c5129303FA057Ab20C13fC3a',
            ABI: require('./abi/token.json'),
            BEP20_ABI: require('./abi/bep20.json')
        },
        SWAP: {
            ADDRESS: '0x3CB3e44233044cF33913C29f738a188886D4b146',
            ABI: require('./abi/swap.json')
        }
    },
    [CIDS.TESTNET]: {
        TOKEN: {
            ADDRESS: '0xD73fAe7f963418643022bd10e1a0DA6e834a2779',
            ABI: require('./abi/token.json'),
            BEP20_ABI: require('./abi/bep20.json')
        },
        SWAP: {
            ADDRESS: '0xaAbdD41743d99ee38F00fF4b092b5f08a5EF6B30',
            ABI: require('./abi/swap.json')
        }
    }
};

export const CONTRACTS = CONTRACTS_STORE[CHAIN_ID];

export const BASE_BSC_SCAN_URLS = {
    [CIDS.MAINNET]: 'https://bscscan.com',
    [CIDS.TESTNET]: 'https://testnet.bscscan.com'
};

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CHAIN_ID];

export const ConnectorNames = {
    Injected: 'injected',
    WalletConnect: 'walletconnect',
    BSC: 'bsc'
};

export default Config;
