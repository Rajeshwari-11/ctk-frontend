import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/AuthProvider';
import './CreateEvent.css';

const CreateEvent = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(true);
  const [eventImage, setEventImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [submittedEvent, setSubmittedEvent] = useState({});

  // ✅ Include all fields in state
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventTicketPrice: 0,
    eventDescription: "",
    eventImage: "",
    eventOrganizer: "",
    eventCapacity: "",
    eventCategory: "",
    eventPhonenumber: "",
    eventEmail: ""
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // **Handle Image Selection**
  const handleFileChange = (e) => {
    setEventImage(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const uploadEventImage = async (imageFile) => {
      try {
        setUploadStatus('Uploading...');
        const formData = new FormData();
        formData.append("eventImage", imageFile);

        const response = await fetch('http://13.48.125.242:8000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Image upload failed');
        }

        const data = await response.json();
        setEventData((prevData) => ({ ...prevData, eventImage: data.imageUrl }));
        setUploadStatus('Uploaded!');
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadStatus('Upload failed!');
      }
    };

    if (eventImage) uploadEventImage(eventImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Event Data Before Sending:", eventData);

    if (!eventData.eventImage) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const response = await fetch("http://13.48.125.242:8000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setShowForm(false);
        setIsSubmitted(true);
        setSubmittedEvent(data.event || data || eventData); // ✅ flexible handling
      } else {
        alert("Failed to create event: " + (data.message || response.statusText));
      }
    } catch (error) {
      console.error("Event creation error:", error);
      alert("Something went wrong during event creation, please try again.");
    }
  };

  // ✅ Redirect after submission
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  if (!isAdmin) {
    return (
      <p className="text-center" style={{ fontSize: "18px", color: "#777", marginTop: '240px', marginBottom: "243px" }}>
        You do not have administrator privileges to create events.
      </p>
    );
  }

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        {showForm && (
          <>
            <h2 className="create-event-heading">Create Event</h2>
            <form className="create-event-form" onSubmit={handleSubmit}>
              <label className="create-event-formlabel">
                Event Name:
                <input
                  type="text"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleChange}
                  placeholder='Enter event name....'
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Date:
                <input
                  type="date"
                  name="eventDate"
                  value={eventData.eventDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Time:
                <input
                  type="time"
                  name="eventTime"
                  value={eventData.eventTime}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Location:
                <input
                  type="text"
                  name="eventLocation"
                  value={eventData.eventLocation}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Ticket Price:
                <input
                  type="number"
                  name="eventTicketPrice"
                  value={eventData.eventTicketPrice}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Description:
                <textarea
                  name="eventDescription"
                  value={eventData.eventDescription}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Category:
                <select
                  name="eventCategory"
                  value={eventData.eventCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  <option value="Festivals">Festivals</option>
                  <option value="Concerts">Concerts</option>
                  <option value="Plays and Exhibitions">Plays and Exhibitions</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports and Fitness">Sports and Fitness</option>
                  <option value="Book and Film Events">Book and Film Events</option>
                  <option value="Comedy Shows">Comedy Shows</option>
                  <option value="Pet Events">Pet Events</option>
                  <option value="Others">Others</option>
                </select>
              </label>

              <label className="create-event-formlabel">
                Organizer:
                <input
                  type="text"
                  name="eventOrganizer"
                  value={eventData.eventOrganizer}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Contact Number:
                <input
                  type="text"
                  name="eventPhonenumber"
                  value={eventData.eventPhonenumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Contact Email:
                <input
                  type="text"
                  name="eventEmail"
                  value={eventData.eventEmail}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Capacity:
                <input
                  type="number"
                  name="eventCapacity"
                  value={eventData.eventCapacity}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="create-event-formlabel">
                Image Filename:
                <div className="file-submission">
                  <input
                    type="file"
                    name="eventImage"
                    onChange={handleFileChange}
                    required
                  />
                  <button
                    className="upload-button"
                    type="button"
                    onClick={handleFileSubmit}
                  >
                    {uploadStatus === 'Uploading...' ? 'Uploading...' :
                      uploadStatus === 'Uploaded!' ? 'Uploaded!' : 'Upload Image'}
                  </button>
                </div>
              </label>

              <button type="submit" className="create-event-button">
                Create Event
              </button>
            </form>
          </>
        )}

        {isSubmitted && (
          <div className="creation-container">
            <h3>Event Created Successfully!</h3>
            <div>
              <p><strong>Name:</strong> {submittedEvent.eventName}</p>
              <p><strong>Date:</strong> {submittedEvent.eventDate}</p>
              <p><strong>Time:</strong> {submittedEvent.eventTime}</p>
              <p><strong>Location:</strong> {submittedEvent.eventLocation}</p>
              <p><strong>Ticket Price:</strong> ${submittedEvent.eventTicketPrice}</p>
              <p><strong>Description:</strong> {submittedEvent.eventDescription}</p>
              <p><strong>Category:</strong> {submittedEvent.eventCategory}</p>
              <p><strong>Organizer:</strong> {submittedEvent.eventOrganizer}</p>
              <p><strong>Contact:</strong> {submittedEvent.eventPhonenumber}</p>
              <p><strong>Email:</strong> {submittedEvent.eventEmail}</p>
              <p><strong>Capacity:</strong> {submittedEvent.eventCapacity}</p>

              {submittedEvent.eventImage && (
                <div>
                  <strong>Image:</strong><br />
                  <img src={submittedEvent.eventImage} alt="Event" width="200" />
                </div>
              )}

              <p>Redirecting to home page...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
