
function DisplayExtensions2D()
{
	// Extension class.
}
{
	Display.prototype.drawFaceForCamera = function(faceToDraw, camera)
	{
		var cameraClipPlanes = camera.clipPlanes();

		faceToDraw = new MeshBuilder().clipFaceAgainstPlanes(faceToDraw, cameraClipPlanes);

		if (faceToDraw == null)
		{
			return;
		}

		var vertices = faceToDraw.vertices;

		var displacementFromCameraToVertex0 = vertices[0].clone().subtract
		(
			camera.loc.pos
		);

		var faceNormalDotDisplacementFromCameraToVertex0 = faceToDraw.plane.normal.dotProduct
		(
			displacementFromCameraToVertex0
		)

		if (faceNormalDotDisplacementFromCameraToVertex0 >= 0)
		{
			return;
		}

		var transformCamera = new Transform_Camera(camera);

		var material = faceToDraw.material;
		this.graphics.fillStyle = material.colorFill.systemColor;

		this.graphics.beginPath();

		for (var i = 0; i < vertices.length; i++)
		{			
			transformCamera.applyToCoords
			(
				this.drawPos.overwriteWith
				(
					vertices[i]
				)
			);

			if (i == 0)
			{
				this.graphics.moveTo
				(
					this.drawPos.x, this.drawPos.y
				);
			}
			else
			{
				this.graphics.lineTo
				(
					this.drawPos.x, this.drawPos.y
				);
			}
		}

		this.graphics.closePath();
		this.graphics.stroke();

		this.graphics.fill();
	}

	Display.prototype.drawFacesForCamera = function(facesToDraw, camera)
	{
		for (var i = 0; i < facesToDraw.length; i++)
		{
			this.drawFaceForCamera(facesToDraw[i], camera);
		}
	}
}
