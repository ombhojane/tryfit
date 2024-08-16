import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import GameShop from './GameShop';

function Playground() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const gameInstance = useRef(null);
  const [speed, setSpeed] = useState(200);
  const [showShop, setShowShop] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameInstance.current = game;

    let player;
    let cursors;
    let buildings;
    let enterButton;

    const WORLD_WIDTH = 3840;
    const WORLD_HEIGHT = 2560;

    function preload() {
      this.load.image('avatar', location.state.avatarImage);
      this.load.image('background', '/assets/bgplayground.jpg');
      this.load.image('enterButton', '/assets/tree.png');
    }

    function create() {
      // Add background
      const background = this.add.image(0, 0, 'background');
      background.setOrigin(0, 0);
      background.setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

      // Create player
      player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'avatar');
      player.setCollideWorldBounds(true);
      player.setScale(0.3);

      cursors = this.input.keyboard.createCursorKeys();

      this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.cameras.main.startFollow(player, true, 0.1, 0.1);
      this.cameras.main.setZoom(0.5);

      // Define building locations and data
      const buildingData = [
        { 
          x: 500, 
          y: 500, 
          name: 'Fashion Store', 
          categories: {
            "Trending": [
              { name: 'T-Shirt', description: 'Comfortable cotton t-shirt', price: '$19.99', buyLink: 'https://example.com/tshirt', upvotes: 87, image: 'https://tse4.mm.bing.net/th?id=OIP.omIRA7NIb8Gj-OTVvW6XggHaH8&pid=Apihttps://i.pinimg.com/originals/b9/59/cc/b959cce534c8661e181c646c10013922.jpg' },
              { name: 'Jeans', description: 'Classic blue jeans', price: '$49.99', buyLink: 'https://image.harrods.com/16/62/57/71/16625771_32834699_2048.jpg' }
            ],
            "New Arrivals": [
              { name: 'Jacket', description: 'Warm winter jacket', price: '$89.99', buyLink: 'https://image.harrods.com/16/62/57/71/16625771_32834699_2048.jpg' }
            ]
          }
        },
        { 
          x: 1500, 
          y: 1500, 
          name: 'Shoe Shop', 
          categories: {
            "Trending": [
              { name: 'Sneakers', description: 'Sporty sneakers', price: '$79.99', buyLink: 'https://example.com/sneakers', upvotes: 93 },
              { name: 'Boots', description: 'Leather boots', price: '$99.99', buyLink: 'https://example.com/boots', upvotes: 78 }
            ]
          }
        },
        { 
          x: 2500, 
          y: 800, 
          name: 'Accessories', 
          categories: {
            "Trending": [
              { name: 'Sunglasses', description: 'UV protection sunglasses', price: '$29.99', buyLink: 'https://example.com/sunglasses', upvotes: 56 },
              { name: 'Watch', description: 'Elegant wristwatch', price: '$149.99', buyLink: 'https://example.com/watch', upvotes: 71 }
            ],
            "Top Picks": [
              { name: 'Wallet', description: 'Leather wallet', price: '$19.99', buyLink: 'https://example.com/wallet', upvotes: 49 }
            ]
          }
        }
      ];

      // Create buildings
      buildings = this.physics.add.staticGroup();
      buildingData.forEach((building) => {
        const buildingSprite = this.add.rectangle(building.x, building.y, 100, 100, 0x0000ff, 0.5).setInteractive();
        buildingSprite.setData('buildingInfo', building);

        // Add building name text
        this.add
          .text(building.x, building.y - 70, building.name, {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 },
          })
          .setOrigin(0.5);

        buildings.add(buildingSprite);
      });

      // Create the styled enter button (initially hidden)
    enterButton = this.add.text(0, 0, 'Enter to this shop', {
      fontSize: '24px', // Increased font size for better visibility
      fontFamily: '"Arial", sans-serif',
      color: '#ffffff',
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
    .setStyle({
      backgroundColor: '#ffffff',
      color: '#333333',
      borderRadius: '20px',
      padding: '15px 30px',
      border: '2px solid #333333', // Border for more definition
    })
    .on('pointerdown', showShopPopup);

    enterButton.on('pointerover', () => {
      enterButton.setStyle({
        backgroundColor: '#f0f0f0',
        color: '#333333',
      });
    });
    
    enterButton.on('pointerout', () => {
      enterButton.setStyle({
        backgroundColor: '#ffffff',
        color: '#333333',
      });
    });
    


// Resize event listener
      this.scale.on('resize', (gameSize) => {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
      });
    }

    function update() {
      player.setVelocity(0);

      if (cursors.left.isDown) {
        player.setVelocityX(-speed);
      } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-speed);
      } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
      }

      const closestBuilding = getNearestBuilding();
      if (closestBuilding && Phaser.Math.Distance.Between(player.x, player.y, closestBuilding.x, closestBuilding.y) < 150) {
        enterButton.setPosition(game.scale.width / 2, game.scale.height - 50);
        enterButton.setVisible(true);
        
      } else {
        enterButton.setVisible(false);
      }
    }

    function getNearestBuilding() {
      return buildings.getChildren().reduce((closest, building) => {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, building.x, building.y);
        return !closest || distance < closest.distance ? { distance, building } : closest;
      }, null)?.building;
    }

    function showShopPopup() {
      const closestBuilding = getNearestBuilding();
      if (closestBuilding) {
        const buildingInfo = closestBuilding.getData('buildingInfo');
        setCurrentShop(buildingInfo);
        setShowShop(true);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [location, speed]);

  const increaseSpeed = () => setSpeed((prevSpeed) => prevSpeed + 100);
  const decreaseSpeed = () => setSpeed((prevSpeed) => Math.max(prevSpeed - 100, 0));
  const resetSpeed = () => setSpeed(200);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Speed Controls:</div>
          <button onClick={increaseSpeed} style={buttonStyle}>+100</button>
          <button onClick={decreaseSpeed} style={buttonStyle}>-100</button>
          <button onClick={resetSpeed} style={buttonStyle}>Reset</button>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => navigate('/dashboard')} style={buttonStyle}>DASHBOARD</button>
          <button onClick={() => navigate('/create-avatar')} style={buttonStyle}>Change Avatar</button>
        </div>
      </div>
      
      {showShop && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <GameShop shopData={currentShop} />
          <button
            onClick={() => setShowShop(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#ffffff',
              color: '#333333',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}


const buttonStyle = {
  background: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s',
};

export default Playground;