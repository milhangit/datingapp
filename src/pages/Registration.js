import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Registration.css';

function Registration() {
    const navigate = useNavigate();
    const { saveCurrentUser } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        id: Date.now(),
        name: '',
        email: '',
        password: '',
        gender: '',
        age: '',
        dateOfBirth: '',
        religion: '',
        caste: '',
        height: '',
        bodyType: '',
        complexion: '',
        education: '',
        occupation: '',
        income: '',
        city: '',
        state: '',
        country: 'Sri Lanka',
        motherTongue: '',
        diet: '',
        smoking: 'No',
        drinking: 'No',
        familyType: '',
        familyValues: '',
        interests: [],
        bio: '',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInterestsChange = (interest) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
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
                return formData.name && formData.email && formData.password && formData.gender;
            case 2:
                return formData.age && formData.religion && formData.height;
            case 3:
                return formData.education && formData.occupation && formData.city;
            case 4:
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveCurrentUser(formData);
        navigate('/');
    };

    const interestsList = [
        'Reading', 'Travel', 'Cooking', 'Music', 'Movies', 'Sports',
        'Photography', 'Dancing', 'Yoga', 'Fitness', 'Art', 'Gaming'
    ];

    return (
        <div className="registration">
            <div className="registration__container">
                <div className="registration__header">
                    <h1>Create Your Profile</h1>
                    <div className="registration__progress">
                        <div
                            className="registration__progress-bar"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                    <p className="registration__step">Step {step} of 5</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="registration__step-content">
                            <h2>Basic Information</h2>

                            <div className="form__group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Gender *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="registration__step-content">
                            <h2>Personal Details</h2>

                            <div className="form__group">
                                <label>Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Your age"
                                    min="18"
                                    max="100"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>Religion *</label>
                                <select name="religion" value={formData.religion} onChange={handleChange} required>
                                    <option value="">Select Religion</option>
                                    <option value="Buddhist">Buddhist</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Christian">Christian</option>
                                    <option value="Muslim">Muslim</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Caste</label>
                                <input
                                    type="text"
                                    name="caste"
                                    value={formData.caste}
                                    onChange={handleChange}
                                    placeholder="Your caste (optional)"
                                />
                            </div>

                            <div className="form__group">
                                <label>Height *</label>
                                <select name="height" value={formData.height} onChange={handleChange} required>
                                    <option value="">Select Height</option>
                                    <option value="Below 5'0">Below 5'0"</option>
                                    <option value="5'0 - 5'3">5'0" - 5'3"</option>
                                    <option value="5'4 - 5'7">5'4" - 5'7"</option>
                                    <option value="5'8 - 5'11">5'8" - 5'11"</option>
                                    <option value="6'0 - 6'3">6'0" - 6'3"</option>
                                    <option value="Above 6'3">Above 6'3"</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Body Type</label>
                                <select name="bodyType" value={formData.bodyType} onChange={handleChange}>
                                    <option value="">Select Body Type</option>
                                    <option value="Slim">Slim</option>
                                    <option value="Average">Average</option>
                                    <option value="Athletic">Athletic</option>
                                    <option value="Heavy">Heavy</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Complexion</label>
                                <select name="complexion" value={formData.complexion} onChange={handleChange}>
                                    <option value="">Select Complexion</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Wheatish">Wheatish</option>
                                    <option value="Dark">Dark</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="registration__step-content">
                            <h2>Professional Information</h2>

                            <div className="form__group">
                                <label>Education *</label>
                                <select name="education" value={formData.education} onChange={handleChange} required>
                                    <option value="">Select Education</option>
                                    <option value="High School">High School</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Bachelor's">Bachelor's Degree</option>
                                    <option value="Master's">Master's Degree</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Occupation *</label>
                                <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                                    <option value="">Select Occupation</option>
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Business">Business Owner</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Engineer">Engineer</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Lawyer">Lawyer</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Annual Income</label>
                                <select name="income" value={formData.income} onChange={handleChange}>
                                    <option value="">Select Income Range</option>
                                    <option value="Below 5 Lakhs">Below 5 Lakhs</option>
                                    <option value="5-10 Lakhs">5-10 Lakhs</option>
                                    <option value="10-20 Lakhs">10-20 Lakhs</option>
                                    <option value="20-50 Lakhs">20-50 Lakhs</option>
                                    <option value="Above 50 Lakhs">Above 50 Lakhs</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Your city"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label>State/Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Your state"
                                />
                            </div>

                            <div className="form__group">
                                <label>Mother Tongue</label>
                                <select name="motherTongue" value={formData.motherTongue} onChange={handleChange}>
                                    <option value="">Select Language</option>
                                    <option value="Sinhala">Sinhala</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="registration__step-content">
                            <h2>Lifestyle & Family</h2>

                            <div className="form__group">
                                <label>Diet Preference</label>
                                <select name="diet" value={formData.diet} onChange={handleChange}>
                                    <option value="">Select Diet</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Eggetarian">Eggetarian</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Smoking Habits</label>
                                <select name="smoking" value={formData.smoking} onChange={handleChange}>
                                    <option value="No">No</option>
                                    <option value="Occasionally">Occasionally</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Drinking Habits</label>
                                <select name="drinking" value={formData.drinking} onChange={handleChange}>
                                    <option value="No">No</option>
                                    <option value="Socially">Socially</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Family Type</label>
                                <select name="familyType" value={formData.familyType} onChange={handleChange}>
                                    <option value="">Select Family Type</option>
                                    <option value="Nuclear">Nuclear Family</option>
                                    <option value="Joint">Joint Family</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label>Family Values</label>
                                <select name="familyValues" value={formData.familyValues} onChange={handleChange}>
                                    <option value="">Select Values</option>
                                    <option value="Traditional">Traditional</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Liberal">Liberal</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="registration__step-content">
                            <h2>Interests & Bio</h2>

                            <div className="form__group">
                                <label>Select Your Interests</label>
                                <div className="interests__grid">
                                    {interestsList.map(interest => (
                                        <div
                                            key={interest}
                                            className={`interest__chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                                            onClick={() => handleInterestsChange(interest)}
                                        >
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form__group">
                                <label>About Yourself</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself, your hobbies, what you're looking for..."
                                    rows="5"
                                />
                            </div>

                            <div className="form__group">
                                <label>Profile Photo URL</label>
                                <input
                                    type="url"
                                    name="photo"
                                    value={formData.photo}
                                    onChange={handleChange}
                                    placeholder="Enter photo URL"
                                />
                            </div>
                        </div>
                    )}

                    <div className="registration__buttons">
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="btn btn__secondary">
                                Previous
                            </button>
                        )}
                        {step < 5 ? (
                            <button type="button" onClick={nextStep} className="btn btn__primary">
                                Next
                            </button>
                        ) : (
                            <button type="submit" className="btn btn__primary">
                                Complete Registration
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
