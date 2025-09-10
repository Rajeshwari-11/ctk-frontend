import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faQuestionCircle, faUserFriends, faCalendarPlus, faTools, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Faqs.css';

const faqData = [
    {
        id: 'general',
        category: 'General Questions',
        icon: faQuestionCircle,
        questions: [
            {
                id: 'general-1',
                question: 'What is CTK Events?',
                answer: 'CTK Events is a comprehensive online platform designed to simplify event creation, management, and attendance. We provide tools for organizers to host seamless events and for attendees to discover and register for exciting experiences.'
            },
            {
                id: 'general-2',
                question: 'Who can use CTK Events?',
                answer: 'Anyone looking to host or attend events can use CTK Events. This includes event organizers, businesses, community groups, and individual participants.'
            },
            {
                id: 'general-3',
                question: 'Is CTK Events free to use?',
                answer: 'Our platform offers various plans, including a free tier with basic features for organizers and a free experience for attendees. Premium features for organizers may involve subscription fees or a percentage of ticket sales.'
            },
            {
                id: 'general-4',
                question: 'What kind of events can I find/create on this platform?',
                answer: 'You can find and create a wide range of events, including conferences, workshops, webinars, concerts, sports events, community gatherings, and more, both virtual and in-person.'
            }
        ]
    },
    {
        id: 'attendees',
        category: 'For Attendees / Participants',
        icon: faUserFriends,
        questions: [
            {
                id: 'attendees-1',
                question: 'How do I register for an event?',
                answer: 'Simply navigate to the event page you wish to attend, click on the "Register" or "Get Tickets" button, fill in the required details, and complete the payment process if applicable. You will receive a confirmation email upon successful registration.'
            },
            {
                id: 'attendees-2',
                question: 'I didn\'t receive a confirmation email, what should I do?',
                answer: 'First, please check your spam or junk folder. If it\'s not there, you can log into your CTK Events account, go to "My Registrations," and check the status. If you still can\'t find it, please contact the event organizer directly or our support team.'
            },
            {
                id: 'attendees-3',
                question: 'Can I modify my registration details after signing up?',
                answer: 'This depends on the event organizer\'s settings. Some events allow attendees to modify details through their account dashboard. If not, please contact the event organizer for assistance.'
            },
            {
                id: 'attendees-4',
                question: 'How do refunds work if an event is canceled or postponed?',
                answer: 'Refund policies are set by individual event organizers. If an event is canceled, you will typically be notified by the organizer regarding refund procedures. For postponed events, your ticket usually remains valid for the new date, or refund options may be provided.'
            }
        ]
    },
    {
        id: 'organizers',
        category: 'For Event Organizers',
        icon: faCalendarPlus,
        questions: [
            {
                id: 'organizers-1',
                question: 'How do I create an organizer account?',
                answer: 'Click on the "Sign Up" button on the homepage, select the "Organizer" option, and follow the prompts to set up your account. You\'ll need to provide some basic information about your organization or yourself.'
            },
            {
                id: 'organizers-2',
                question: 'What are the steps to set up a new event?',
                answer: 'Once logged in as an organizer, navigate to your "Organizer Dashboard." Click "Create New Event" and follow the guided steps to add details, schedule, ticket types, and publishing options. Our intuitive interface makes it easy!'
            },
            {
                id: 'organizers-3',
                question: 'How do I manage attendee registrations?',
                answer: 'From your Organizer Dashboard, you can view, manage, and export your attendee list. You can also send messages to registered attendees and issue refunds if necessary.'
            },
            {
                id: 'organizers-4',
                question: 'What reporting and analytics are available for my event?',
                answer: 'Our platform provides comprehensive dashboards with real-time data on ticket sales, attendance, page views, and more to help you track your event\'s performance.'
            }
        ]
    },
    {
        id: 'technical',
        category: 'Technical Support & Troubleshooting',
        icon: faTools,
        questions: [
            {
                id: 'technical-1',
                question: 'My page isn\'t loading, what should I do?',
                answer: 'Try refreshing the page, clearing your browser cache and cookies, or trying a different browser. If the issue persists, please contact our support team.'
            },
            {
                id: 'technical-2',
                question: 'I can\'t log in.',
                answer: 'Double-check your email and password. If you\'ve forgotten your password, use the "Forgot Password" link to reset it. Ensure your Caps Lock is off. If problems continue, contact support.'
            }
        ]
    }
];





const FAQs = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const panelRefs = useRef({});

    const handleToggle = (id) => {
        setActiveIndex(activeIndex === id ? null : id);
    };

    const filteredFaqData = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="background">
        <div className="faq-page-container">
            <div className="faq-header">
                <h1>Frequently Asked Questions</h1>
                <p>Find quick answers to your questions about using our event management system.</p>
            </div>

            {filteredFaqData.length > 0 ? (
                filteredFaqData.map(category => (
                    <section id={category.id} className="faq-category" key={category.id}>
                        <h2>
                            <FontAwesomeIcon icon={category.icon} /> {category.category}
                        </h2>
                        <div className="accordion-group">
                            {category.questions.map(item => (
                                <React.Fragment key={item.id}>
                                    <button
                                        className={`accordion ${activeIndex === item.id ? 'active' : ''}`}
                                        onClick={() => handleToggle(item.id)}
                                    >
                                        {item.question}
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="accordion-icon"
                                        />
                                    </button>
                                    <div
                                        ref={(el) => (panelRefs.current[item.id] = el)}
                                        className="panel"
                                        style={{ maxHeight: activeIndex === item.id ? panelRefs.current[item.id]?.scrollHeight + 'px' : '0px' }}
                                    >
                                        <p>{item.answer}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <p className="no-results">No FAQs found matching your search. Please try a different term.</p>
            )}

            <div className="faq-contact-section">
                <h3>Still Have Questions?</h3>
                <p>If you couldn't find the answer you were looking for, our support team is ready to help!</p>
                <a  className="btn-contact" onClick={()=>navigate("/contact")}>Contact Support</a>
            </div>
        </div>
        </div>
    );
};

export default FAQs;