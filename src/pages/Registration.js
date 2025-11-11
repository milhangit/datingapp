import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import './Registration.css';

function Registration() {
    const navigate = useNavigate();
    const { saveCurrentUser } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        id: Date.now(),
        username: '',
        phone: '',
        password: '',
        name: '',
        gender: '',
        age: 25,
        religion: '',
        city: '',
        occupation: '',
        education: '',
        photo: 'https://via.placeholder.com/600',
        bio: '',
        interests: [],
        email: '', // Auto-generated from phone
        dateOfBirth: '',
        caste: '',
        height: '',
        bodyType: '',
        complexion: '',
        income: '',
        state: '',
        country: 'Sri Lanka',
        motherTongue: '',
        diet: '',
        smoking: 'No',
        drinking: 'No',
        familyType: '',
        familyValues: ''
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleButtonSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                if (!formData.phone || !formData.username || !formData.password) {
                    setError('Please fill in all fields');
                    return false;
                }
                if (formData.phone.length < 10) {
                    setError('Please enter a valid phone number');
                    return false;
                }
                return true;
            case 2:
                if (!formData.name || !formData.gender || !formData.age) {
                    setError('Please complete your basic info');
                    return false;
                }
                return true;
            case 3:
                if (!formData.religion || !formData.city) {
                    setError('Please select your religion and city');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Auto-generate email from phone if not provided
        const finalData = {
            ...formData,
            email: formData.email || `${formData.phone}@app.com`
        };

        try {
            // Register user via API
            const result = await api.register(finalData);
            saveCurrentUser(result.user || finalData);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Trincomalee', 'Anuradhapura', 'Kurunegala'];
    const religions = ['Buddhist', 'Hindu', 'Christian', 'Muslim', 'Other'];
    const occupations = ['Engineer', 'Doctor', 'Teacher', 'Business', 'IT Professional', 'Accountant', 'Nurse', 'Lawyer', 'Student', 'Other'];
    const educationLevels = ['High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'];

    return (
        <div className="registration">
            <div className="registration__container">
                <div className="registration__header">
                    <h1>Quick Sign Up</h1>
                    <div className="registration__progress">
                        <div
                            className="registration__progress-bar"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                    <p className="registration__step">Step {step} of 4</p>
                </div>

                {error && <div className="registration__error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="registration__step-content">
                            <h2>Login Details</h2>

                            <div className="form__group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="07XXXXXXXX"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="registration__step-content">
                            <h2>Basic Info</h2>

                            <div className="form__group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Gender *</label>
                                <div className="button__grid">
                                    <button
                                        type="button"
                                        className={`selection__button ${formData.gender === 'Male' ? 'selected' : ''}`}
                                        onClick={() => handleButtonSelect('gender', 'Male')}
                                    >
                                        Male
                                    </button>
                                    <button
                                        type="button"
                                        className={`selection__button ${formData.gender === 'Female' ? 'selected' : ''}`}
                                        onClick={() => handleButtonSelect('gender', 'Female')}
                                    >
                                        Female
                                    </button>
                                </div>
                            </div>

                            <div className="form__group">
                                <label>Age: {formData.age} years *</label>
                                <input
                                    type="range"
                                    name="age"
                                    min="18"
                                    max="60"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="age__slider"
                                />
                                <div className="age__range">
                                    <span>18</span>
                                    <span>60</span>
                                </div>
                            </div>

                            <div className="form__group">
                                <label>Profile Photo URL (optional)</label>
                                <input
                                    type="url"
                                    name="photo"
                                    value={formData.photo}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/photo.jpg"
                                />
                                <small>Leave blank for default avatar</small>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="registration__step-content">
                            <h2>About You</h2>

                            <div className="form__group">
                                <label>Religion *</label>
                                <div className="button__grid">
                                    {religions.map(religion => (
                                        <button
                                            key={religion}
                                            type="button"
                                            className={`selection__button ${formData.religion === religion ? 'selected' : ''}`}
                                            onClick={() => handleButtonSelect('religion', religion)}
                                        >
                                            {religion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form__group">
                                <label>City *</label>
                                <div className="button__grid">
                                    {cities.map(city => (
                                        <button
                                            key={city}
                                            type="button"
                                            className={`selection__button ${formData.city === city ? 'selected' : ''}`}
                                            onClick={() => handleButtonSelect('city', city)}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="registration__step-content">
                            <h2>Work & Education</h2>

                            <div className="form__group">
                                <label>Occupation</label>
                                <div className="button__grid">
                                    {occupations.map(occupation => (
                                        <button
                                            key={occupation}
                                            type="button"
                                            className={`selection__button ${formData.occupation === occupation ? 'selected' : ''}`}
                                            onClick={() => handleButtonSelect('occupation', occupation)}
                                        >
                                            {occupation}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form__group">
                                <label>Education</label>
                                <div className="button__grid">
                                    {educationLevels.map(education => (
                                        <button
                                            key={education}
                                            type="button"
                                            className={`selection__button ${formData.education === education ? 'selected' : ''}`}
                                            onClick={() => handleButtonSelect('education', education)}
                                        >
                                            {education}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form__group">
                                <label>About Yourself (optional)</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us a bit about yourself..."
                                    rows="4"
                                />
                            </div>
                        </div>
                    )}

                    <div className="registration__buttons">
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="btn btn__secondary">
                                Back
                            </button>
                        )}
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="btn btn__primary">
                                Continue
                            </button>
                        ) : (
                            <button type="submit" className="btn btn__primary">
                                Create Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
