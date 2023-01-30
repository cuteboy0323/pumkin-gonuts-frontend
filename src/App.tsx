import { ToastListener } from 'contexts/ToastsContext';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

function App() {
    return (
        <BrowserRouter basename="">
            <Routes />
            <ToastListener />
        </BrowserRouter>
    );
}

export default App;
