
function Texture(name, image)
{
	this.name = name;
	this.image = image;
}

{
	// instances

	function Texture_Instances()
	{
		this.TestPattern = new Texture
		(
			"TextureTestPattern", 
			ImageHelper.buildImageFromStrings
			(
				"ImageTestPattern",
				[ "rg", "by" ]
			)
		);

		this.Goal = new Texture
		(
			"TextureGoal",
			ImageHelper.buildImageFromStrings
			(
				"ImageGoal",
				[
					"@"
				]
			)
		);

		this.Start = new Texture
		(
			"TextureStart",
			ImageHelper.buildImageFromStrings
			(
				"ImageStart",
				[
					"A"
				]
			)
		);

		this.Wall = new Texture
		(
			"TextureWall",
			ImageHelper.buildImageFromStrings
			(
				"ImageWall",
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
