import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/utilities/AuthProvider';
import NavBar from './components/utilities/Navbar';
import Footer from './components/utilities/Footer';
import HomePage from './components/home/HomePage';
import LoginPage from './components/utilities/LoginPage';
import SignUp from './components/utilities/SignUp';
import AboutUs from './components/utilities/AboutUs';
import ContactUs from './components/utilities/ContactUs';
import DisplayEvents from './components/events/DisplayEvents';
import EventDetails from './components/events/EventDetail';
import CreateEvent from './components/admin/CreateEvent';
import BookingForm from './components/user/BookingForm';
import Feedback from './components/user/Feedback';
import ProfilePage from './components/utilities/ProfilePage';
import ViewFeedback from './components/admin/ViewFeedback';
import ViewEventTickets from './components/admin/ViewEventTickets';
import Faqs from './components/utilities/Faqs';
import 'bootstrap/dist/css/bootstrap.min.css';
import UpdateEvent from './components/admin/UpdateEvent';
import ResetPassword from './components/user/ResetPassword';
import ForgotPassword from './components/user/ForgotPassword';
import { NotificationProvider } from './components/utilities/NotificationsContext';
import Inbox from './components/admin/Inbox';
import ScrollToTop from './components/utilities/ScrollToTop';



const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <div style={{ backgroundColor: '#000' }}>
            <NavBar />
            <div>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/home' element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/events" element={<DisplayEvents />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/createEvent" element={<CreateEvent />} />
                <Route path="/updateEvent/:id" element={<UpdateEvent />} />
                <Route path='/booking/:id' element={<BookingForm />} />
                <Route path="/feedback/:id" element={<Feedback />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/viewfeedback/:id" element={<ViewFeedback />} />
                <Route path="/vieweventtickets/:id" element={<ViewEventTickets />} />
                <Route path="/faq" element={<Faqs />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/inbox/:id" element={<Inbox />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;