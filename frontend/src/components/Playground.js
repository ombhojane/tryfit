import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Phaser from 'phaser';

function Playground() {
  const location = useLocation();
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);

    let player;
    let cursors;
    let buildings;
    let trees;
    let roadsLayer;
    let parksLayer;
    let groundLayer;
    let minimap;

    const WORLD_WIDTH = 3200;
    const WORLD_HEIGHT = 3200;

    function preload() {
      this.load.image('avatar', location.state.avatarImage);
      this.load.image('tileset', 'assets/city_tileset.png');
      this.load.tilemapTiledJSON('map', 'assets/city_map.json');
      this.load.image('building1', 'assets/building1.png');
      this.load.image('building2', 'assets/building2.png');
      this.load.image('building3', 'assets/building3.png');
      this.load.image('tree', 'assets/tree.png');
      // Commenting out car loading
      // this.load.image('car', 'assets/car.png');
    }

    function create() {
      // Create the tilemap
      const map = this.make.tilemap({ key: 'map' });
      const tileset = map.addTilesetImage('city_tileset', 'tileset');
      
      if (!tileset) {
        console.error("Tileset not found!");
        return;
      }

      // Create layers
      groundLayer = map.createLayer('Ground', tileset, 0, 0);
      roadsLayer = map.createLayer('Roads', tileset, 0, 0);
      parksLayer = map.createLayer('Parks', tileset, 0, 0);

      // Set collision for layers
      if (groundLayer) {
        groundLayer.setCollisionByProperty({ collides: true });
      } else {
        console.error("groundLayer is null or not found in the tilemap");
      }

      if (roadsLayer) {
        roadsLayer.setCollisionByProperty({ collides: true });
      } else {
        console.error("roadsLayer is null or not found in the tilemap");
      }

      if (parksLayer) {
        parksLayer.setCollisionByProperty({ collides: true });
      } else {
        console.error("parksLayer is null or not found in the tilemap");
      }

      // Create buildings in a grid pattern
      buildings = this.physics.add.staticGroup();
      const buildingSpacingX = 300; // Adjust spacing for proper layout
      const buildingSpacingY = 300;
      const buildingScale = 0.3; // Smaller scale for buildings
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const x = 200 + i * buildingSpacingX;
          const y = 200 + j * buildingSpacingY;
          const buildingType = Phaser.Math.Between(1, 3);
          buildings.create(x, y, `building${buildingType}`).setScale(buildingScale).refreshBody();
        }
      }

      // Create trees scattered around the city
      trees = this.physics.add.staticGroup();
      const treeScale = 0.10; // Smaller scale for trees
      for (let i = 0; i < 20; i++) {
        const x = Phaser.Math.Between(50, WORLD_WIDTH - 50);
        const y = Phaser.Math.Between(50, WORLD_HEIGHT - 50);
        trees.create(x, y, 'tree').setScale(treeScale).refreshBody();
      }

      // Create player
      player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'avatar');
      player.setCollideWorldBounds(true);
      player.setScale(0.3); // Smaller scale for player

      // Set up collisions
      this.physics.add.collider(player, buildings);
      this.physics.add.collider(player, trees);
      this.physics.add.collider(player, groundLayer);
      this.physics.add.collider(player, roadsLayer);
      this.physics.add.collider(player, parksLayer);

      cursors = this.input.keyboard.createCursorKeys();

      // Set world bounds
      this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Set up camera
      this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      this.cameras.main.startFollow(player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1);

      // Create minimap
      minimap = this.cameras.add(10, 10, 200, 200).setZoom(0.05).setName('mini');
      minimap.setBackgroundColor(0x002244);
      minimap.scrollX = WORLD_WIDTH / 2;
      minimap.scrollY = WORLD_HEIGHT / 2;

      // Commented out car logic
      /*
      for (let i = 0; i < 20; i++) {
        const x = Phaser.Math.Between(100, WORLD_WIDTH - 100);
        const y = Phaser.Math.Between(100, WORLD_HEIGHT - 100);
        const car = this.physics.add.image(x, y, 'car').setScale(0.2);
        car.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
        car.setBounce(1, 1);
        car.setCollideWorldBounds(true);
        this.physics.add.collider(car, buildings);
        this.physics.add.collider(car, trees);
      }
      */
    }

    function update() {
      const speed = 200;

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

      // Update minimap position
      minimap.scrollX = player.x;
      minimap.scrollY = player.y;
    }

    return () => {
      game.destroy(true);
    };
  }, [location]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Playground;
