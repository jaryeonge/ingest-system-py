import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Since from './components/Since/Since';
import Config from './components/Config/Config';
import Process from './components/Process/Process';
import MainBox from './components/BoxComponent/MainBox';
import Login from './components/Login/Login';
import {isUserLoggedIn} from './api/authenticateAPI';

function App() {
    if (!isUserLoggedIn()) {
        return <Login />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainBox><Config /></MainBox>}/>
                <Route path='/process' element={<MainBox><Process /></MainBox>}/>
                <Route path='/since' element={<MainBox><Since /></MainBox>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
