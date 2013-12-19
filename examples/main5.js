/// controls using canvas lines not sprites.

Main = function () {

        var game = new Phaser.Game(1024, 700, Phaser.CANVAS, '', { preload: preload, create: create, update: update }); //AUTO //CANVAS

        function preload () {

	    // Loading Assets.
            game.load.image('logo', 'assets/atari1200xl.png');
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
	    // adding sprites
	    this.TouchControl.simpleCanvasControls = true;

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