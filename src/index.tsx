import App from './App';

import {
    Root,
    MuiThemeProvider,
    ConfigProvider,
    ToastsProvider,
    ModalProvider,
    Web3ReactProvider,
    Web3Provider
} from './providers';

Root.render(
    <ConfigProvider>
        <MuiThemeProvider>
            <Web3ReactProvider>
                <Web3Provider>
                    <ToastsProvider>
                        <ModalProvider>
                            <App />
                        </ModalProvider>
                    </ToastsProvider>
                </Web3Provider>
            </Web3ReactProvider>
        </MuiThemeProvider>
    </ConfigProvider>
);
