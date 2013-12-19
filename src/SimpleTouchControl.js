/**
* A Simple Touch Control Plugin for Phaser (On-screen touch controls).  v0.1
*
* @author       dibu28
* @copyright    2013 dibu28
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Plugin.SimpleTouchControl = function (game, parent) {

	Phaser.Plugin.call(this, game, parent);

	this.pointers =[]; // Array of added pointers to control and render.
	this.game = game;

	/// public variables
	this.hideIfUp = false;
	
	// sprites to draw controls
	this.moveSprite1 = null;
	this.moveSprite2 = null;
	this.actionSprite = null;

	this.defaultPosition = { moveControl:   { x: 80, y: this.game.height - 80 },
				 actionControl: { x: this.game.width -60, y: this.game.height - 60}};

        this.moveMainColor   = 'cyan';
        this.moveSecondColor = 'cyan';
        this.actionColor     = 'red';

	this.showMoveControl   = true;
	this.showActionControl = true;

	// Movment directions and action
	this.deltaX = 0;
	this.deltaY = 0;

	this.action = false;

	this.left  = false;
	this.right = false;
	this.up    = false;
	this.down  = false;

	// in pixels +-. Simple protection from jitter if finger slip on touch
	this.safeRange = 5;

	// to draw controls on canvas using lines not sprites.
	this.simpleCanvasControls = false;


	/// private variables
	this._drawMoveCallback = null;
	this._drawActionCallback = null;

	// based on region touched by pointer we decide to which control it will be assigned (while isDown).
	this._touchMoveID   = -1;
	this._touchActionID = -1;

};

//	Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.SimpleTouchControl.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.SimpleTouchControl.prototype.constructor = Phaser.Plugin.SimpleTouchControl;

/**
* Add a Pointer references to this Plugin.
* @type {Phaser.Pointer}
*/
Phaser.Plugin.SimpleTouchControl.prototype.addPointer = function (pointer) {

	this.pointers.push(pointer);

};

/**
* This is run when the plugins render during the core game loop.
* To render every added pointer.
*/
Phaser.Plugin.SimpleTouchControl.prototype.render = function () { //update

	if (this.pointers.length > 0)
	{
		for (i=0;i < this.pointers.length;i++)
		{
			this._renderPointer(this.pointers[i]);
		}
	}
};

/**
 * Set moveControl draw callback
 * @param callback
 */
Phaser.Plugin.SimpleTouchControl.prototype.setDrawMoveCallback = function (callback) {
    this._drawMoveCallback = callback;
};

/**
 * Set moveControl draw callback
 * @param callback
 */
Phaser.Plugin.SimpleTouchControl.prototype.setDrawActionCallback = function (callback) {
    this._drawActionCallback = callback;
};

/**
* renders pointer one at a time.
* @type {Phaser.Pointer}
*/
Phaser.Plugin.SimpleTouchControl.prototype._renderPointer = function (pointer) {

        if (pointer.isUp === true) //this.hideIfUp === true &&
        {
		if (pointer.id === this._touchMoveID) //only for pointer which initiated move
		{
			this.left      = false;
			this.right     = false;
			this.up        = false;
			this.down      = false;
			this.deltaX = 0;
			this.deltaY = 0;
			this._touchMoveID = -1;
			// last draw to get back to default position
			if (this.showMoveControl) {this._drawMovementControl(pointer);}
		}
		if (pointer.id === this._touchActionID) //only for pointer which initiated move
		{
			this.action = false;
			this._touchActionID = -1;
			// last draw to get back to default position
			if (this.showActionControl) {this._drawActionControl(pointer);}
		}
            return;
        }

	// based on region touched by pointer we decide to which control it will be assigned (while isDown).
	// Now it's just right or left side of screen.
	// TODO: cnahge to ranges of screen controls and support more then 2 controls.
	if (pointer.positionDown.x < this.game.width/2)
	{
		if ((this._touchMoveID === -1)||(this._touchMoveID === pointer.id))
		{
		//calculating movement
		// left and right
		if (pointer.positionDown.x - pointer.position.x > this.safeRange)
		{
			this.left  = true;
			this.right = false; // to stop moving opposit side
			this.deltaX = pointer.position.x - pointer.positionDown.x;
			this._touchMoveID = pointer.id;
		}
		else
		{
			if (pointer.positionDown.x - pointer.position.x < -this.safeRange)
			{
				this.left  = false;
				this.right = true; // to stop moving opposit side
				this.deltaX = pointer.position.x - pointer.positionDown.x;
				this._touchMoveID = pointer.id;
			}
			else
			{
				// stopping movement. touch is within safe range
				this.left  = false;
				this.right = false;
				this.deltaX = 0;
				this._touchMoveID = pointer.id;
			}
		}
		// up and down
		if (pointer.positionDown.y - pointer.position.y > this.safeRange)
		{
			this.up   = true;
			this.down = false; // to stop moving opposit side
			this.deltaY = pointer.position.y - pointer.positionDown.y;
			this._touchMoveID = pointer.id;
		}
		else
		{
			if (pointer.positionDown.y - pointer.position.y < -this.safeRange)
			{
				this.up   = false;
				this.down = true; // to stop moving opposit side
				this.deltaY = pointer.position.y - pointer.positionDown.y;
				this._touchMoveID = pointer.id;
			}
			else
			{
				// stopping movement. touch is within safe range
				this.up   = false;
				this.down = false;
				this.deltaY = 0;
				this._touchMoveID = pointer.id;
			}
		}

		if (this.showMoveControl) {this._drawMovementControl(pointer);}
		}
	}
	else
	{
		if ((this._touchActionID === -1)||(this._touchActionID === pointer.id))
		{
			this.action = true;
			this._touchActionID = pointer.id;
			if (this.showActionControl) {this._drawActionControl(pointer);}
		}
	}

};

/**
* Drawing MoveControl
* @type {Phaser.Pointer}
*/
Phaser.Plugin.SimpleTouchControl.prototype._drawMovementControl = function (pointer) {

    if (this._drawMoveCallback !== null && typeof this._drawMoveCallback === "function") {
	this._drawMoveCallback(pointer);
    }
    else
    {
	if (!this.simpleCanvasControls)
	{
		if (pointer.isUp === true)
		{
			if (!this.hideIfUp)
			{
				this.moveSprite1.x = this.defaultPosition.moveControl.x;
				this.moveSprite1.y = this.defaultPosition.moveControl.y;

				this.moveSprite2.x = this.defaultPosition.moveControl.x;
				this.moveSprite2.y = this.defaultPosition.moveControl.y;
			}
			else
			{
				this.moveSprite1.visible = false;
				this.moveSprite2.visible = false;
			}
		}
		else
		{
			this.moveSprite1.visible = true;
			this.moveSprite2.visible = true;

			this.moveSprite1.x = pointer.position.x;
			this.moveSprite1.y = pointer.position.y;

			this.moveSprite2.x = pointer.positionDown.x;
			this.moveSprite2.y = pointer.positionDown.y;
		}
	}
	else
	{
		// do not draw if not in canvas mode 
	        if (this.game.context == null || pointer == null)
	        {
	            return;
	        }

		var c = this.game.context;
	        c.save();
	        c.setTransform(1, 0, 0, 1, 0, 0);
	        this.currentAlpha = c.globalAlpha;
	        c.globalAlpha = 1;
			c.beginPath(); 
			c.strokeStyle = this.moveMainColor; 
			c.lineWidth = 6; 
			c.arc(pointer.positionDown.x, pointer.positionDown.y, 40,0,Math.PI*2,true); 
			c.stroke();
			c.beginPath(); 
			c.strokeStyle = this.moveMainColor; 
			c.lineWidth = 2; 
			c.arc(pointer.positionDown.x, pointer.positionDown.y, 60,0,Math.PI*2,true); 
			c.stroke();
			c.beginPath(); 
			c.strokeStyle = this.moveSecondColor; 
			c.arc(pointer.position.x, pointer.position.y, 40, 0,Math.PI*2, true); 
			c.stroke(); 
		c.restore();
	        c.globalAlpha = this.currentAlpha;
	}
    }
};

/**
* Drawing ActionControl
* @type {Phaser.Pointer}
*/
Phaser.Plugin.SimpleTouchControl.prototype._drawActionControl = function (pointer) {

    if (this._drawActionCallback !== null && typeof this._drawActionCallback === "function") {
	this._drawActionCallback(pointer);
    }
    else
    {
	if (!this.simpleCanvasControls)
	{
		if (pointer.isUp === true)
		{
			if (!this.hideIfUp)
			{
				this.actionSprite.x = this.defaultPosition.actionControl.x;
				this.actionSprite.y = this.defaultPosition.actionControl.y;
			}
			else
			{
				this.actionSprite.visible = false;
			}
		}
		else
		{
			this.actionSprite.visible = true;
			this.actionSprite.x = pointer.position.x;
			this.actionSprite.y = pointer.position.y;
		}
	}
	else
	{
		// do not draw if not in canvas mode 
	        if (this.game.context == null || pointer == null)
	        {
	            return;
	        }

		var c = this.game.context;
	        c.save();
	        c.setTransform(1, 0, 0, 1, 0, 0);
	        this.currentAlpha = c.globalAlpha;
	        c.globalAlpha = 1;
			c.beginPath(); 
			c.arc(pointer.position.x, pointer.position.y, 40, 0, Math.PI*2, true); 
			c.lineWidth = "6";
			c.strokeStyle = this.actionColor;
			c.stroke();
		c.restore();
	        c.globalAlpha = this.currentAlpha;
	}
   }
};
