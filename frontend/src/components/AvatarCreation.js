// AvatarCreation.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';
import './AvatarCreation.css';

function AvatarCreation() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [avatarFeatures, setAvatarFeatures] = useState({
    gender: 'male',
    skinTone: '#FFE0BD',
    hairColor: '#B55239',
    eyeColor: '#3D59AB',
    height: 170,
    shirtColor: '#FF0000',
    pantsColor: '#0000FF'
  });
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Gender', 'Skin', 'Hair', 'Eyes', 'Height', 'Clothes'];

  const colorOptions = {
    skin: ['#FFE0BD', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'],
    hair: ['#000000', '#4A2F01', '#B55239', '#D7BF8C', '#7E4E60'],
    eyes: ['#000000', '#3D59AB', '#228B22', '#8B4513', '#36454F'],
    shirt: ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#FFA500'],
    pants: ['#0000FF', '#000000', '#808080', '#A52A2A', '#006400']
  };

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
  
  
  ctx.fillStyle = avatarFeatures.skinTone;
  for (let y = 0; y < 10; y++) {
    for (let x = 5; x < 11; x++) {
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }


    ctx.fillStyle = avatarFeatures.hairColor;
    if (avatarFeatures.gender === 'male') {
      for (let y = 0; y < 4; y++) {
        for (let x = 4; x < 12; x++) {
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    } 
    
    else {
      for (let y = 0; y < 3; y++) {
        for (let x = 4; x < 12; x++) {
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
      // Side hair
      for (let y = 3; y < 7; y++) {
        ctx.fillRect(4 * pixelSize, y * pixelSize, pixelSize, pixelSize);
        ctx.fillRect(11 * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
      // Back hair
      for (let y = 3; y < 5; y++) {
        for (let x = 4; x < 12; x++) {
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }

    }

    ctx.fillStyle = avatarFeatures.eyeColor;
    ctx.fillRect(6 * pixelSize, 5 * pixelSize, pixelSize, pixelSize);
    ctx.fillRect(9 * pixelSize, 5 * pixelSize, pixelSize, pixelSize);
  
    return canvas.toDataURL();
  };

  useEffect(() => {
    const avatarPreview = document.getElementById('avatar-preview');
    if (avatarPreview) {
      avatarPreview.src = renderPixelatedAvatar();
    }
  }, [avatarFeatures], 7);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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
            <h3>Select Your Gender</h3>
            <div className="gender-options">
              <button className={avatarFeatures.gender === 'male' ? 'selected' : ''} onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}>Male</button>
              <button className={avatarFeatures.gender === 'female' ? 'selected' : ''} onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}>Female</button>
            </div>
          </div>
        );
      case 'Skin':
        return (
          <div className="step-container">
            <h3>Pick Your Skin Tone</h3>
            <div className="color-options">
              {colorOptions.skin.map((color, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  className={avatarFeatures.skinTone === color ? 'selected' : ''}
                  onClick={() => handleChange({ target: { name: 'skinTone', value: color } })}
                />
              ))}
            </div>
            <input type="color" name="skinTone" onChange={handleChange} value={avatarFeatures.skinTone} />
          </div>
        );
      case 'Hair':
        return (
          <div className="step-container">
            <h3>Choose Hair Color</h3>
            <div className="color-options">
              {colorOptions.hair.map((color, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  className={avatarFeatures.hairColor === color ? 'selected' : ''}
                  onClick={() => handleChange({ target: { name: 'hairColor', value: color } })}
                />
              ))}
            </div>
            <input type="color" name="hairColor" onChange={handleChange} value={avatarFeatures.hairColor} />
          </div>
        );
      case 'Eyes':
        return (
          <div className="step-container">
            <h3>Pick Your Eye Color</h3>
            <div className="color-options">
              {colorOptions.eyes.map((color, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  className={avatarFeatures.eyeColor === color ? 'selected' : ''}
                  onClick={() => handleChange({ target: { name: 'eyeColor', value: color } })}
                />
              ))}
            </div>
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
                <h4>Shirt Color</h4>
                <div className="color-options">
                  {colorOptions.shirt.map((color, index) => (
                    <button
                      key={index}
                      style={{ backgroundColor: color }}
                      className={avatarFeatures.shirtColor === color ? 'selected' : ''}
                      onClick={() => handleChange({ target: { name: 'shirtColor', value: color } })}
                    />
                  ))}
                </div>
                <input type="color" name="shirtColor" onChange={handleChange} value={avatarFeatures.shirtColor} />
              </div>
              <div>
                <h4>Pants Color</h4>
                <div className="color-options">
                  {colorOptions.pants.map((color, index) => (
                    <button
                      key={index}
                      style={{ backgroundColor: color }}
                      className={avatarFeatures.pantsColor === color ? 'selected' : ''}
                      onClick={() => handleChange({ target: { name: 'pantsColor', value: color } })}
                    />
                  ))}
                </div>
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
      <div className="avatar-creation-content">
        <div className="avatar-preview-container">
          <img id="avatar-preview" src={renderPixelatedAvatar()} alt="Avatar Preview" />
        </div>
        <div className="creation-steps">
          {renderStep()}
        </div>
        <div className="navigation-buttons">
          {currentStep > 0 && <button className="prev-button" onClick={prevStep}>Previous</button>}
          {currentStep < steps.length - 1 && <button className="next-button" onClick={nextStep}>Next</button>}
          {currentStep === steps.length - 1 && <button className="submit-button" onClick={handleSubmit}>Enter Playground</button>}
        </div>
        <div className="footer-buttons">
          <button className="footer-button" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button className="footer-button" onClick={() => navigate('/')}>Back to Home</button>
          <button className="footer-button" onClick={handleLogout}>Logout</button>
        </div>
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvatarCreation;