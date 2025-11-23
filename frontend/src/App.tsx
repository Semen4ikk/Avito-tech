import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {MainPage} from './pages/MainPage';
import {ItemPage} from "./pages/ItemPage.tsx";
import {StatsPage} from "./pages/StatsPage.tsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/list" element={<MainPage />} />
                <Route path="/item/:id" element={<ItemPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;