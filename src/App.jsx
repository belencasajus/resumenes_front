import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchView from './components/SearchView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import BookSummary from './components/BookSummary';
import SubscriptionView from './components/SubscriptionView';
import SummaryView from './components/SummaryView';
import ProfileView from './components/ProfileView';
import AudioPlayerView from './components/AudioPlayerView';
import UploadSummaryView from './components/UploadSummaryView';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/book/:id" element={<BookSummary />} />
        <Route path="/subscription" element={<SubscriptionView />} />
        <Route path="/summary/:id/summary" element={<SummaryView />} />
        <Route path="/profile" element={<ProfileView/>}/>
        <Route path="/summary/:id/audio" element={<AudioPlayerView />} />
        <Route path="/upload" element={<UploadSummaryView/>} />
      </Routes>
    </Router>
  );
}

export default App;
