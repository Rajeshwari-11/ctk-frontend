import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewEventTickets.css';

const ViewEventTickets = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true);
    const [loadingAdminStatus, setLoadingAdminStatus] = useState(false);

    const cardContainerRef = useRef(null);

    // Fetch Event Details (to display event name) and Bookings
    useEffect(() => {
        if (!isAdmin || loadingAdminStatus) return; // Only fetch if admin status is confirmed

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch Event Details
                const eventResponse = await fetch(`http://13.48.125.242:8000/api/viewtickets/${id}`,{
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
                    }});
                if (!eventResponse.ok) {
                    const errorData = await eventResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to fetch event details. Status: ${eventResponse.status}`);
                }
                const data = await eventResponse.json();
                console.log(data);
                setEventDetails(data.event);
                console.log("Events data",data.event);
                setBookings(data.bookings);
                console.log("Bookings data",data.bookings);

            } catch (err) {
                console.error("Error fetching data for ViewEventTickets:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAdmin, loadingAdminStatus]);

    const handleScroll = (direction) => {
        if (cardContainerRef.current) {
            // Dynamically calculate the width of one card, including the gap
            const card = cardContainerRef.current.querySelector('.booking-card');
            const cardWidth = card.offsetWidth; // Get the width of one card
            const cardGap = parseInt(window.getComputedStyle(cardContainerRef.current).gap) || 0; // Get the gap between cards
            const scrollAmount = cardWidth + cardGap; // Total scroll amount (card width + gap)
    
            if (direction === 'left') {
                cardContainerRef.current.scrollLeft -= scrollAmount; // Scroll left
            } else {
                cardContainerRef.current.scrollLeft += scrollAmount; // Scroll right
            }
        }
    };

    // Determine if arrows should be shown (basic visibility, can be enhanced)
    // This is a simplified check. For more robust arrow disabling,
    // you'd need to track scrollLeft against scrollWidth and clientWidth.
    const showArrows = bookings.length > 3; // Show if more than 3 cards (approx visible count)


    if (loadingAdminStatus || loading) {
        return <p className='loading-message'>Loading ticket details...</p>;
    }

    if (error) {
        return <p className='error-message'>Error: {error}</p>;
    }

    return (
        <div className='background'>
        <div className="view-tickets-container">
            <button className="back-arrow-button" onClick={() => navigate(`/event/${id}`)} title="Back to Event Details">
                &larr;
            </button>
            <h2 className='view-tickets-header'>{eventDetails?.eventName || 'Event'}</h2>
            {eventDetails && (
                <div className="event-info-header">
                    <p>
                        <span><strong>Date:</strong> {new Date(eventDetails.eventDate).toLocaleDateString()}</span>
                        <span className="info-separator"></span>
                        <span><strong>Location:</strong> {eventDetails.eventLocation}</span>
                        <span className="info-separator"></span>
                        <span><strong>Organizer:</strong> {eventDetails.eventOrganizer}</span>
                    </p>
                </div>
            )} 
            {bookings.length === 0 ? (
                <p className='no-bookings-message'>No tickets have been booked for this event yet.</p>
            ) : (
                <div className="slider-wrapper">
                    {showArrows && (
                        <button className="slider-arrow left" onClick={() => handleScroll('left')} aria-label="Scroll left">
                            &lt;
                        </button>
                    )}
                    <div className="bookings-card-container" ref={cardContainerRef}>
                            {bookings.map((booking) => (
                            <div className="booking-card" key={booking._id}>
                                <div className="card-header">
                                    <h4>Attendee: {booking.userName || 'N/A'}</h4>
                                </div>
                                <div className="card-body">
                                    <p><strong>Email:</strong> {booking.userId?.userEmail || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {booking.userPhonenumber || 'N/A'}</p>
                                    <p><strong>Tickets Booked:</strong> {booking.numberOfTickets}</p>
                                    <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                                </div>
                            </div>
                            ))}
                    </div>
                    {showArrows && (
                        <button className="slider-arrow right" onClick={() => handleScroll('right')} aria-label="Scroll right">
                            &gt;
                        </button>
                    )}
                </div>
            )}
        </div>
        </div>
    );
};

export default ViewEventTickets;
