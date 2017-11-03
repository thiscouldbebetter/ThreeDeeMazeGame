
function InputHelper()
{
	this.mousePos = new Coords(0, 0, 0);
	this.keyCodeToBindingLookup = [];
	this.actionsForInputsPressed = [];
}

{
	// instance methods

	InputHelper.prototype.initialize = function(bindings)
	{
		this.bindings = bindings;
		this.actionsForInputsPressed.length = 0;

		this.keyCodeToBindingLookup.length = 0;
		for (var i = 0; i < this.bindings.length; i++)
		{
			var binding = this.bindings[i];
			this.keyCodeToBindingLookup[binding.input.keyCode] = binding;
		}

		document.body.onkeydown = this.handleKeyDownEvent.bind(this);
		document.body.onkeyup = this.handleKeyUpEvent.bind(this);
		document.body.onmousedown = this.handleMouseDownEvent.bind(this);
		document.body.onmouseup = this.handleMouseUpEvent.bind(this);
		document.body.onmousemove = this.handleMouseMoveEvent.bind(this);
	}

	InputHelper.prototype.updateForTimerTick = function()
	{
		for (var i = 0; i < this.actionsForInputsPressed.length; i++)
		{
			var action = this.actionsForInputsPressed[i];
			action.ticksSoFar++;
		}
	}

	// events

	InputHelper.prototype.handleKeyDownEvent = function(event)
	{
		var keyCodePressed = event.keyCode;
		var binding = this.keyCodeToBindingLookup[keyCodePressed];
		if (binding != null)
		{
			var action = binding.action; 
			var actionName = action.name;

			if (this.actionsForInputsPressed[actionName] == null)
			{
				action.ticksSoFar = 0;
				this.actionsForInputsPressed.push(action);
				this.actionsForInputsPressed[actionName] = action;
			}
		}
	}

	InputHelper.prototype.handleKeyUpEvent = function(event)
	{
		var keyCodeReleased = event.keyCode;
		var binding = this.keyCodeToBindingLookup[keyCodeReleased];
		if (binding != null)
		{
			var action = binding.action; 
			var actionName = action.name;

			if (this.actionsForInputsPressed[actionName] != null)
			{
				this.actionsForInputsPressed.splice
				(
					this.actionsForInputsPressed.indexOf(action),
					1
				);	
				delete this.actionsForInputsPressed[actionName];
			}
		}
	}

	InputHelper.prototype.handleMouseDownEvent = function(event)
	{
		var boundingClientRectangle = event.target.getBoundingClientRect();

		this.mousePos.overwriteWithDimensions
		(
			event.x - boundingClientRectangle.left, 
			event.y - boundingClientRectangle.top, 
			0
		);		

		var keyCodePressed = Input.Instances.MouseButton.keyCode;
		var binding = this.keyCodeToBindingLookup[keyCodePressed];
		if (binding != null)
		{
			var action = binding.action; 
			var actionName = action.name;

			if (this.actionsForInputsPressed[actionName] == null)
			{
				action.ticksSoFar = 0;
				this.actionsForInputsPressed.push(action);
				this.actionsForInputsPressed[actionName] = action;
			}
		}
	}

	InputHelper.prototype.handleMouseUpEvent = function(event)
	{
		var boundingClientRectangle = event.target.getBoundingClientRect();

		this.mousePos.overwriteWithDimensions
		(
			event.x - boundingClientRectangle.left, 
			event.y - boundingClientRectangle.top, 
			0
		);		

		var keyCodeReleased = Input.Instances.MouseButton.keyCode;
		var binding = this.keyCodeToBindingLookup[keyCodeReleased];
		if (binding != null)
		{
			var action = binding.action; 
			var actionName = action.name;

			if (this.actionsForInputsPressed[actionName] != null)
			{
				this.actionsForInputsPressed.splice
				(
					this.actionsForInputsPressed.indexOf(action),
					1
				);	
				delete this.actionsForInputsPressed[actionName];
			}
		}
	}

	InputHelper.prototype.handleMouseMoveEvent = function(event)
	{
		var boundingClientRectangle = event.target.getBoundingClientRect();

		this.mousePos.overwriteWithDimensions
		(
			event.x - boundingClientRectangle.left, 
			event.y - boundingClientRectangle.top, 
			0
		);
	}
}
