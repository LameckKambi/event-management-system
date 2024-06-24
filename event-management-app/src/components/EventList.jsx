import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, FormControl, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/index.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: '',
        city: '',
        country: '',
        image: ''
    });

    useEffect(() => {
        const fetchEventsData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                const shuffledEvents = shuffleArray(data.data);
                const initialEvents = shuffledEvents.slice(0, 12);
                setDisplayedEvents(initialEvents);
                setEvents(data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching events: ' + err.message);
                setLoading(false);
            }
        };

        fetchEventsData();
    }, []);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredEvents = displayedEvents.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add event');
            }

            const newEvent = await response.json();
            setEvents([...events, newEvent.data]);
            setDisplayedEvents([...displayedEvents, newEvent.data]);

            // Clear form data and hide the form
            setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                location: '',
                price: '',
                city: '',
                country: '',
                image: ''
            });
            setShowForm(false);
        } catch (err) {
            setError('Error adding event: ' + err.message);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <h1>Events List Available</h1>
                <div className="landImage">
                    <div className="input-group-container">
                        <div className="input-group .custom-search-input-group">
                            <FormControl
                                type="text"
                                placeholder="Search for events..."
                                className="form-control"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <div className="input-group-append">
                                <Button variant="secondary" type="button">
                                    <i className="fa fa-search"></i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Button className="mt-4" onClick={toggleForm}>
                    {showForm ? 'Hide Add Event Form' : 'Show Add Event Form'}
                </Button>

                {showForm && (
                    <Form onSubmit={handleSubmit} className="signup-form mt-4">
                        <h3>Add Event</h3>
                        <Form.Group controlId="eventName">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventTime">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="eventImage">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                placeholder="Enter image URL"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="secondary" type="submit" style={{ backgroundColor: '#4299f7' }}>
                            Add Event
                        </Button>
                    </Form>
                )}

                <Row className="mt-4">
                    {filteredEvents.map((event) => (
                        <Col key={event.id} md={4} className="mb-4">
                            <Link to={`/event-details/${event.id}`} className="card-link">
                                <Card className="h-100 shadow-sm card-event">
                                    <div className="card-img-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={event.image}
                                            className="card-img"
                                        />
                                    </div>
                                    <Card.Body className="card-body">
                                        <Card.Title className="card-title">{event.name}</Card.Title>
                                        <Card.Text className="card-text">{event.description}</Card.Text>
                                        <div className="card-details">
                                            <div>
                                                <i className="fas fa-calendar-alt"></i>{' '}
                                                <strong>Date:</strong>{' '}
                                                {new Date(event.date).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <i className="fas fa-clock"></i>{' '}
                                                <strong>Time:</strong> {event.time}
                                            </div>
                                            <div>
                                                <i className="fas fa-map-marker-alt"></i>{' '}
                                                <strong>Location:</strong> {event.city}, {event.country}
                                            </div>
                                            <div>
                                                <i className="fas fa-dollar-sign"></i>{' '}
                                                <strong>Price:</strong> ${event.price}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    return (
        <div className="find-events-bg">
            <Container>
                {renderContent()}
            </Container>
        </div>
    );
};

export default EventList;

