import { useMemo } from 'react';
import { Web3Context } from 'contexts/web3';

import Web3 from 'web3';

import useActiveWeb3React from 'hooks/useActiveWeb3React';

type Web3ProviderProps = {
    children: React.ReactNode;
};

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    const { library } = useActiveWeb3React();
    const getWeb3 = () => {
        if (!library) return {};
        return new Web3((library.provider || library.connection.url) as any);
    };
    const web3 = useMemo(() => getWeb3(), [library]);

    return (
        <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>
    );
};

export default Web3Provider;
