/// Basic Example (Mobile view scale)

Main = function () {

        var game = new Phaser.Game(512,280, Phaser.AUTO, '', { preload: preload, create: create, update: update }); //AUTO //CANVAS

        function preload () {

	    // Loading Assets.
            this.game.load.image('logo', 'assets/atari1200xl.png');
            this.game.load.image('move_bgr', 'assets/Move_bgr2_sml.png');
            this.game.load.image('move_btn', 'assets/Move_btn_sml.png');
	    this.game.load.image('orientation', 'assets/device_o1.png');
        }
	
        function create () {
	
	    ///Scaling view
	    this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
	    this.game.stage.scale.minWidth = 480;
	    this.game.stage.scale.minHeight = 260;
	    this.game.stage.scale.maxWidth = 1024;
	    this.game.stage.scale.maxHeight = 768;

	    this.game.stage.scale.forceOrientation(true, false, 'orientation');

	    this.game.stage.scale.pageAlignHorizontally = true;
	    this.game.stage.scale.pageAlignVertically = true;
	    this.game.stage.scale.refresh();
	    this.game.stage.scale.maxIterations = 1;
	    if (this.game.device.android && this.game.device.chrome == false)
	    {
		this.game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
	    }

	    // Creating sprites.
            this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.sprite.anchor.setTo(0.5, 0.5);

	    // setting up SimpleTouchControl Phaser Plugin
	    this.TouchControl = this.game.plugins.add(Phaser.Plugin.SimpleTouchControl);
	    // adding pointers
	    this.TouchControl.addPointer(this.game.input.mousePointer);
	    this.TouchControl.addPointer(this.game.input.pointer1);
	    this.TouchControl.addPointer(this.game.input.pointer2);
	    // adding sprites
	    this.touchsprite1 = this.game.add.sprite(this.TouchControl.defaultPosition.moveControl.x, this.TouchControl.defaultPosition.moveControl.y, 'move_bgr');
            this.touchsprite1.anchor.setTo(0.5, 0.5);
	    this.touchsprite2 = this.game.add.sprite(this.TouchControl.defaultPosition.moveControl.x, this.TouchControl.defaultPosition.moveControl.y, 'move_btn');
            this.touchsprite2.anchor.setTo(0.5, 0.5);
	    this.touchsprite3 = this.game.add.sprite(this.TouchControl.defaultPosition.actionControl.x, this.TouchControl.defaultPosition.actionControl.y, 'move_btn');
            this.touchsprite3.anchor.setTo(0.5, 0.5);
	    this.TouchControl.moveSprite2 = this.touchsprite1;
	    this.TouchControl.moveSprite1 = this.touchsprite2;
	    this.TouchControl.actionSprite = this.touchsprite3;
        }

        function update () {
		// updating sprite using SimpleTouchControl Phaser Plugin data
		// moving sprite
		this.sprite.body.velocity.x = this.TouchControl.deltaX;
		this.sprite.body.velocity.y = this.TouchControl.deltaY;
		// rotating sprite if action button pressed
		if (this.TouchControl.action)
			{
				this.sprite.angle += 1;
			}
	}

};