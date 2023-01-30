import useLocalStorage from 'hooks/useLocalStorage';
import { ConfigContext, initialState } from 'contexts/config';

type ConfigProviderProps = {
    children: React.ReactNode;
};

const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [config, setConfig] = useLocalStorage('pumpin-config', {
        ...initialState
    });

    const onChangeThemeMode = () => {
        setConfig((prevState) => ({
            ...prevState,
            isDark: !prevState.isDark
        }));
    };

    return (
        <ConfigContext.Provider value={{ ...config, onChangeThemeMode }}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigProvider;
