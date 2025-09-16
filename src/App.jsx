import React, { Suspense, lazy } from "react";
import Loading from "./components/Loading/Loading";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/utilities/AuthProvider";
import NavBar from "./components/utilities/Navbar";
import Footer from "./components/utilities/Footer";
import { NotificationProvider } from "./components/utilities/NotificationsContext";
import ScrollToTop from "./components/utilities/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Lazy imports
const HomePage = lazy(() => import("./components/home/HomePage"));
const LoginPage = lazy(() => import("./components/utilities/LoginPage"));
const SignUp = lazy(() => import("./components/utilities/SignUp"));
const AboutUs = lazy(() => import("./components/utilities/AboutUs"));
const ContactUs = lazy(() => import("./components/utilities/ContactUs"));
const DisplayEvents = lazy(() => import("./components/events/DisplayEvents"));
const EventDetails = lazy(() => import("./components/events/EventDetail"));
const CreateEvent = lazy(() => import("./components/admin/CreateEvent"));
const BookingForm = lazy(() => import("./components/user/BookingForm"));
const Feedback = lazy(() => import("./components/user/Feedback"));
const ProfilePage = lazy(() => import("./components/utilities/ProfilePage"));
const ViewFeedback = lazy(() => import("./components/admin/ViewFeedback"));
const ViewEventTickets = lazy(() =>
  import("./components/admin/ViewEventTickets")
);
const Faqs = lazy(() => import("./components/utilities/Faqs"));
const UpdateEvent = lazy(() => import("./components/admin/UpdateEvent"));
const ResetPassword = lazy(() => import("./components/user/ResetPassword"));
const ForgotPassword = lazy(() => import("./components/user/ForgotPassword"));
const Inbox = lazy(() => import("./components/admin/Inbox"));

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <div style={{ backgroundColor: "#000" }}>
            <NavBar />
            <div>
              {/* ✅ Suspense fallback loader */}
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/events" element={<DisplayEvents />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/createEvent" element={<CreateEvent />} />
                  <Route path="/updateEvent/:id" element={<UpdateEvent />} />
                  <Route path="/booking/:id" element={<BookingForm />} />
                  <Route path="/feedback/:id" element={<Feedback />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/viewfeedback/:id" element={<ViewFeedback />} />
                  <Route
                    path="/vieweventtickets/:id"
                    element={<ViewEventTickets />}
                  />
                  <Route path="/faq" element={<Faqs />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/inbox/:id" element={<Inbox />} />
                </Routes>
              </Suspense>
            </div>
            {/* <Footer /> */}
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
