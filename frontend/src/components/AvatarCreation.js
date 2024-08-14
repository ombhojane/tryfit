import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AvatarCreation.css';

function AvatarCreation() {
  const navigate = useNavigate();
  const [avatarFeatures, setAvatarFeatures] = useState({
    gender: 'male',
    skinTone: '#FFE0BD',
    hairColor: '#000000',
    eyeColor: '#000000',
    height: 170,
    shirtColor: '#FF0000',
    pantsColor: '#0000FF'
  });
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Gender', 'Skin', 'Hair', 'Eyes', 'Height', 'Clothes'];

  const handleChange = (e) => {
    setAvatarFeatures({ ...avatarFeatures, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/avatar', {
        userId: 'user123',
        features: avatarFeatures
      });
      console.log('Avatar created:', response.data);
      const avatarImage = renderPixelatedAvatar();
      navigate('/playground', { state: { avatarFeatures: avatarFeatures, avatarImage: avatarImage } });
    } catch (error) {
      console.error('Failed to create avatar:', error);
      alert('Failed to create avatar. Please try again.');
    }
  };

  const renderPixelatedAvatar = () => {
    const pixelSize = 10;
    const width = 16;
    const height = 32;

    const canvas = document.createElement('canvas');
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;
    const ctx = canvas.getContext('2d');

    // Body
    ctx.fillStyle = avatarFeatures.skinTone;
    for (let y = 10; y < height; y++) {
      for (let x = 3; x < 13; x++) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Shirt
    ctx.fillStyle = avatarFeatures.shirtColor;
    for (let y = 12; y < 20; y++) {
      for (let x = 3; x < 13; x++) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Pants
    ctx.fillStyle = avatarFeatures.pantsColor;
    for (let y = 20; y < 32; y++) {
      for (let x = 3; x < 13; x++) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Head
    ctx.fillStyle = avatarFeatures.skinTone;
    for (let y = 0; y < 10; y++) {
      for (let x = 5; x < 11; x++) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Hair
    ctx.fillStyle = avatarFeatures.hairColor;
    for (let y = 0; y < 4; y++) {
      for (let x = 4; x < 12; x++) {
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Eyes
    ctx.fillStyle = avatarFeatures.eyeColor;
    ctx.fillRect(7 * pixelSize, 4 * pixelSize, pixelSize, pixelSize);
    ctx.fillRect(9 * pixelSize, 4 * pixelSize, pixelSize, pixelSize);

    return canvas.toDataURL();
  };


  useEffect(() => {
    const avatarPreview = document.getElementById('avatar-preview');
    if (avatarPreview) {
      avatarPreview.src = renderPixelatedAvatar();
    }
  }, [avatarFeatures]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'Gender':
        return (
          <div className="step-container">
            <h3>Choose Your Gender</h3>
            <div className="gender-options">
              <button className={avatarFeatures.gender === 'male' ? 'selected' : ''} onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}>Male</button>
              <button className={avatarFeatures.gender === 'female' ? 'selected' : ''} onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}>Female</button>
            </div>
          </div>
        );
      case 'Skin':
        return (
          <div className="step-container">
            <h3>Choose Your Skin Tone</h3>
            <input type="color" name="skinTone" onChange={handleChange} value={avatarFeatures.skinTone} />
          </div>
        );
      case 'Hair':
        return (
          <div className="step-container">
            <h3>Choose Your Hair Color</h3>
            <input type="color" name="hairColor" onChange={handleChange} value={avatarFeatures.hairColor} />
          </div>
        );
      case 'Eyes':
        return (
          <div className="step-container">
            <h3>Choose Your Eye Color</h3>
            <input type="color" name="eyeColor" onChange={handleChange} value={avatarFeatures.eyeColor} />
          </div>
        );
      case 'Height':
        return (
          <div className="step-container">
            <h3>Set Your Height</h3>
            <input
              type="range"
              name="height"
              min="150"
              max="200"
              onChange={handleChange}
              value={avatarFeatures.height}
            />
            <span>{avatarFeatures.height} cm</span>
          </div>
        );
      case 'Clothes':
        return (
          <div className="step-container">
            <h3>Choose Your Outfit</h3>
            <div className="clothes-options">
              <div>
                <label>Shirt Color</label>
                <input type="color" name="shirtColor" onChange={handleChange} value={avatarFeatures.shirtColor} />
              </div>
              <div>
                <label>Pants Color</label>
                <input type="color" name="pantsColor" onChange={handleChange} value={avatarFeatures.pantsColor} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="avatar-creation">
      <h2>Create Your Avatar</h2>
      <div className="avatar-preview-container">
        <img id="avatar-preview" alt="Avatar Preview" />
      </div>
      <div className="creation-steps">
        {renderStep()}
        <div className="navigation-buttons">
          {currentStep > 0 && <button onClick={prevStep}>Previous</button>}
          {currentStep < steps.length - 1 ? (
            <button onClick={nextStep}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Create Avatar and Play</button>
          )}
        </div>
      </div>
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div key={step} className={`progress-step ${index <= currentStep ? 'active' : ''}`}></div>
        ))}
      </div>
    </div>
  );
}

export default AvatarCreation;