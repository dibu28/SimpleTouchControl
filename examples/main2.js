/// Controls Hidden if not touched

Main = function () {

        var game = new Phaser.Game(1024, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update }); //AUTO //CANVAS

        function preload () {

	    // Loading Assets.
            game.load.image('logo', 'assets/atari1200xl.png');
            game.load.image('move_bgr', 'assets/Move_bgr1.png');
            game.load.image('move_btn', 'assets/Move_btn.png');
        }
	
        function create () {

	    ///Scaling view
            game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            game.stage.scale.minWidth = 320;
            game.stage.scale.minHeight = 480;
            game.stage.scale.pageAlignHorizontally = true;
            game.stage.scale.setScreenSize(true);

	    // Creating sprites.
            this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            this.sprite.anchor.setTo(0.5, 0.5);

	    // setting up SimpleTouchControl Phaser Plugin
	    this.TouchControl = game.plugins.add(Phaser.Plugin.SimpleTouchControl);
	    // adding pointers
	    this.TouchControl.addPointer(this.game.input.mousePointer);
	    this.TouchControl.addPointer(this.game.input.pointer1);
	    this.TouchControl.addPointer(this.game.input.pointer2);
	    // hide controls while not touched
	    this.TouchControl.hideIfUp = true;
	    // adding sprites
	    this.touchsprite1 = game.add.sprite(this.TouchControl.defaultPosition.moveControl.x, this.TouchControl.defaultPosition.moveControl.y, 'move_bgr');
            this.touchsprite1.anchor.setTo(0.5, 0.5);
	    this.touchsprite1.visible = false;
	    this.touchsprite2 = game.add.sprite(this.TouchControl.defaultPosition.moveControl.x, this.TouchControl.defaultPosition.moveControl.y, 'move_btn');
            this.touchsprite2.anchor.setTo(0.5, 0.5);
	    this.touchsprite2.visible = false;
	    this.touchsprite3 = game.add.sprite(this.TouchControl.defaultPosition.actionControl.x, this.TouchControl.defaultPosition.actionControl.y, 'move_btn');
            this.touchsprite3.anchor.setTo(0.5, 0.5);
	    this.touchsprite3.visible = false;
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