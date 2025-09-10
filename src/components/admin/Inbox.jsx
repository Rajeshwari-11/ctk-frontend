import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useAuth} from '../utilities/AuthProvider';
import './Inbox.css';

function Inbox() {
    const { queryId } = useParams();
    const {isAdmin,isAuthenticated}=useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replies, setReplies] = useState({});

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch('http://13.48.125.242:8000/api/admin-get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setContacts(data);

                const initialReplies = {};
                data.forEach(contact => {
                    initialReplies[contact._id] = '';
                });
                setReplies(initialReplies);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch contacts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    useEffect(() => {
        if (!loading && queryId) {
            const element = document.getElementById(queryId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [loading, queryId]);

    const handleReplyChange = (id, value) => {
        setReplies(prev => ({ ...prev, [id]: value }));
    };

    const handleSendReply = async (id, contactEmail) => {
        const reply = replies[id];
        if (!reply || reply.trim() === '') {
            alert("Please enter a reply before sending.");
            return;
        }

        try {
            const response = await fetch('http://13.48.125.242:8000/api/admin-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
                },
                body: JSON.stringify({contactId: id, adminReply: reply, userEmail: contactEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            setReplies(prev => ({ ...prev, [id]: '' }));
            setContacts(prevContacts =>
                prevContacts.map(c =>
                    c._id === id ? { ...data.contact } : c
                )
            );
        } catch (err) {
            console.error("Failed to send reply:", err);
            alert("Failed to send reply. Please try again. Error: " + err.message);
        }
    };

    if (loading) {
        return <div className="inbox-status">Loading contact messages...</div>;
    }

    if (error) {
        return <div className="inbox-status inbox-error">Error: {error}</div>;
    }

    if (!isAdmin) {
        return (
          <p className="text-center" style={{ fontSize: "18px", color: "#777", marginTop: '240px', marginBottom: "243px" }}>
            You do not have administrator privileges to create events.
          </p>
        );
      }

    return (
        <div className="background">
            <div className="inbox-container">
                <h1>User Enquiries</h1>
                {contacts.length === 0 ? (
                    <p className="inbox-status">No contact messages found.</p>
                ) : (
                    <div className="inbox-list">
                        {contacts.map((contact) => (
                            <div key={contact._id} id={contact._id} className="inbox-item">
                                <div className="inbox-item-header">
                                    <strong>Name:</strong> {contact.contactName}
                                </div>
                                <p><strong>Email: </strong> {contact.contactEmail}</p>
                                <p><strong>Phone: </strong> {contact.contactPhoneNumber}</p>
                                <div className="inbox-item-message">
                                    <p><strong>Message: </strong></p>
                                    <p>{contact.contactMessage}</p>
                                </div>

                                {contact.adminReply ? (
                                    <div className="inbox-previous-reply">
                                        <strong>Admin Reply:</strong>
                                        <p>{contact.adminReply}</p>
                                        <p className="inbox-resolved-status">
                                            {contact.isResolved
                                                ? 'This enquiry has been resolved.'
                                                : 'User not found, please mail them directly.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="inbox-admin-reply-section">
                                        <textarea
                                            className="inbox-text-area"
                                            placeholder="Enter your response here.."
                                            value={replies[contact._id] || ''}
                                            onChange={(e) => handleReplyChange(contact._id, e.target.value)}
                                        />
                                        <button
                                            className="inbox-send-reply-button"
                                            onClick={() => handleSendReply(contact._id, contact.contactEmail)}
                                        >
                                            Send Reply
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inbox;