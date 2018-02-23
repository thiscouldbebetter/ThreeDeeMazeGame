
function Texture(name, image)
{
	this.name = name;
	this.image = image;
}

{
	// instances

	function Texture_Instances()
	{
		this._TestPattern = new Texture
		(
			"TestPattern",
			ImageHelper.buildImageFromStrings
			(
				"TestPattern",
				[ "rg", "by" ]
			)
		);

		this.Chest = new Texture
		(
			"Chest",
			ImageHelper.buildImageFromStrings
			(
				"Chest",
				[
					"aaaaaaaaaaaaaaaa",
					"aAAAAAAAAAAAAAAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAaaaaaaaaaaaaAa",
					"aAAAAAAAAAAAAAAa",
					"aaaaaaaaaaaaaaaa",
				]
			)
		);

		this.Door = new Texture
		(
			"Door",
			ImageHelper.buildImageFromStrings
			(
				"Door",
				[
					"aaaaaaaaaaaaaaaa",
					"aBBBBBBBBBBBBBBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBaaaaaaaaaaaaBa",
					"aBBBBBBBBBBBBBBa",
					"aaaaaaaaaaaaaaaa",
				]
			)
		);

		this.Goal = new Texture
		(
			"Goal",
			ImageHelper.buildImageFromStrings
			(
				"Goal",
				[
					"@"
				]
			)
		);

		this.Start = new Texture
		(
			"Start",
			ImageHelper.buildImageFromStrings
			(
				"Start",
				[
					"A"
				]
			)
		);

		this.Wall = new Texture
		(
			"Wall",
			ImageHelper.buildImageFromStrings
			(
				"Wall",
				[
					"AAAAAAAAAAAAAAAA",

					"AaaaAaaaAaaaAaaa",
					"AaaaAaaaAaaaAaaa",
					"AaaaAaaaAaaaAaaa",

					"AAAAAAAAAAAAAAAA",

					"aaAaaaAaaaAaaaAa",
					"aaAaaaAaaaAaaaAa",
					"aaAaaaAaaaAaaaAa",

					"AAAAAAAAAAAAAAAA",

					"AaaaAaaaAaaaAaaa",
					"AaaaAaaaAaaaAaaa",
					"AaaaAaaaAaaaAaaa",

					"AAAAAAAAAAAAAAAA",

					"aaAaaaAaaaAaaaAa",
					"aaAaaaAaaaAaaaAa",
					"aaAaaaAaaaAaaaAa",

				]
			)
		);
	}

	Texture.Instances = new Texture_Instances();

	// methods

	Texture.prototype.initializeForWebGLContext = function(webGLContext)
	{
		var gl = webGLContext.gl;

		this.systemTexture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, this.systemTexture);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D
		(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			this.image.systemImage
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
