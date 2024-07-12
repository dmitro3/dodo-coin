import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'next/link';
import {AuthProvider} from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Page from './page';
import WalletPage from './pages/WalletPage';
import FriendsPage from './pages/FriendsPage';
import MissionsPage from './pages/MissionsPage';
import PaymentPage from "./pages/PaymentPage";

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Page/>}/>
                        <Route path="/wallet" element={<WalletPage/>}/>
                        <Route path="/friends" element={<FriendsPage/>}/>
                        <Route path="/missions" element={<MissionsPage/>}/>
                        <Route path="/payment" element={<PaymentPage/>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
