
function ImageExtensions()
{}
{
	// static methods

	Image.buildFromFilePath = function(name, filePath)
	{
		var returnValue = new Image();

		returnValue.name = name;
		returnValue.filePath = filePath;
		returnValue.systemImage = document.createElement("img");
		returnValue.systemImage.src = filePath;

		return returnValue;
	}

	Image.buildFromSystemImage = function(name, systemImage)
	{
		var returnValue = new Image(name, systemImage.src);

		return returnValue;
	}

	// instance methods

	Image.prototype.clone = function()
	{
		var returnValue = new Image();

		returnValue.name = name;
		returnValue.filePath = this.filePath;
		returnValue.sizeInPixels = this.sizeInPixels.clone();
		returnValue.systemImage = this.systemImage;

		return returnValue;
	}

	Image.prototype.cloneAsVisual = function()
	{
		return this.clone();
	}

	Image.prototype.drawToGraphicsAtPos = function(graphics, drawPos)
	{
		graphics.drawImage
		(
			this.systemImage,
			drawPos.x,
			drawPos.y
		);
	}

	Image.prototype.updateForVenue = function()
	{
		// do nothing
	}
}