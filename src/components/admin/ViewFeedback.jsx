import React, { useState, useEffect } from 'react';
import './ViewFeedback.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'; 
import { useParams } from 'react-router-dom';

const ViewFeedback = () => {
    const { id } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const getChartHeight = () => {
        if (window.innerWidth <= 426) {
          return 150; 
        } else if (window.innerWidth <= 768) {
          return 130 ; 
        } else {
          return 200;
        }
      };
    const [chartHeight, setChartHeight] = useState(getChartHeight());

    useEffect(() => {
        const handleResize = () => {
            setChartHeight(getChartHeight());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch(`http://13.48.125.242:8000/api/viewfeedback/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                setFeedbacks(responseData.feedbacks);

            } catch (err) {
                console.error('Error fetching feedbacks:', err);
                setError(`Failed to load feedbacks: ${err.message}. Please check console for details.`);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [id]);

    const calculateFeedbackStats = () => {
        if (feedbacks.length === 0) {
            return {
                pieChartData: [],
                averageRating: 0,
                totalReviews: 0,
            };
        }

        const ratingCounts = {};
        let totalRatingSum = 0;

        feedbacks.forEach(feedback => {
            const rating = feedback.rating;
            if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
                ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
                totalRatingSum += rating;
            } else {
                console.warn(`Invalid rating found: ${rating}. Skipping this feedback.`);
            }
        });

        const pieChartData = Object.keys(ratingCounts).map(rating => ({
            name: `${rating} Stars`,
            value: ratingCounts[rating],
        })).sort((a, b) => parseInt(b.name) - parseInt(a.name));

        const averageRating = totalRatingSum > 0 ? (totalRatingSum / feedbacks.length).toFixed(1) : '0.0';

        return {
            pieChartData,
            averageRating,
            totalReviews: feedbacks.length,
        };
    };

    const { pieChartData, averageRating, totalReviews } = calculateFeedbackStats();

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'].reverse();

    if (loading) {
        return (
            <div className="view-feedbacks-container">
                <p>Loading feedbacks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-feedbacks-container error-message">
                <p>{error}</p>
                <p>Please ensure your backend is running and accessible at `http://13.48.125.242:8000/api/feedbacks` and returns an array of feedback objects.</p>
            </div>
        );
    }

    return (
        <div className="view-feedbacks-wrapper">
            <div className="view-feedbacks-container">
                <h1>Event Feedbacks</h1>

                {totalReviews === 0 ? (
                    <p>No feedbacks available yet for this event.</p>
                ) : (
                    <>
                        {/* --- Feedback Summary Section --- */}
                        <div className="feedback-summary">
                            <div className="average-rating-card">
                                <div className="avg-rating-header">
                                    <h2>Average Rating</h2>
                                </div>
                                <p className="avg-rating-value">{averageRating} / 5</p>
                                <p className="total-reviews-count">({totalReviews} reviews) on CTK Website</p>
                            </div>

                            <div className="pie-chart-card">
                                <div className="pie-chart-header">
                                    <h2>Rating Distribution</h2>
                                </div>
                                <ResponsiveContainer width="100%" height={chartHeight}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={window.innerWidth <= 480 ? 50 : 70}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name.replace(' Stars', '')}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <hr className="divider" />

                        <div className="all-reviews-section">
                            <h2>All Reviews</h2>
                            <div className="all-reviews-list">
                                {feedbacks.map((feedback, index) => (
                                    <div key={feedback._id || index} className="review-card">
                                        {/* ✅ Username */}
                                        <p className="review-username">
                                            <strong>User:</strong> {feedback.userId.userName}
                                        </p>

                                        {/* ✅ Rating in the middle */}
                                        <div className="review-rating">
                                            <strong>Rating:</strong> {feedback.rating} / 5{" "}
                                            {Array.from({ length: feedback.rating }, (_, i) => (
                                                <span key={`filled-star-${index}-${i}`} className="star filled-star">&#9733;</span>
                                            ))}
                                            {Array.from({ length: 5 - feedback.rating }, (_, i) => (
                                                <span key={`empty-star-${index}-${i}`} className="star empty-star">&#9734;</span>
                                            ))}
                                        </div>

                                        {/* ✅ Comment */}
                                        <p className="review-comment">
                                            <strong>Comment:</strong> {feedback.comments || "No comment provided."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewFeedback;
