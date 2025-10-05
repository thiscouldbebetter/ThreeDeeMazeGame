
class DisplayHelper
{
	static drawFaceForCamera
	(
		display: Display2D, faceToDraw: FaceTextured, cameraEntity: Entity
	): void
	{
		var drawPos = display._drawPos;

		var camera = Camera.of(cameraEntity);
		var cameraClipPlanes = camera.clipPlanes();

		faceToDraw = new MeshBuilder().clipFaceAgainstPlanes
		(
			faceToDraw, cameraClipPlanes
		);

		if (faceToDraw == null)
		{
			return;
		}

		var vertices = faceToDraw.geometry.vertices;

		var displacementFromCameraToVertex0 = vertices[0].clone().subtract
		(
			Locatable.of(cameraEntity).loc.pos
		);

		var faceNormal = faceToDraw.geometry.plane().normal;
		var faceNormalDotDisplacementFromCameraToVertex0 = faceNormal.dotProduct
		(
			displacementFromCameraToVertex0
		)

		if (faceNormalDotDisplacementFromCameraToVertex0 >= 0)
		{
			return;
		}

		var transformCamera = new Transform_Camera(camera);

		var material = faceToDraw.material;
		display.graphics.fillStyle = material.colorFill.systemColor();

		display.graphics.beginPath();

		for (var i = 0; i < vertices.length; i++)
		{
			transformCamera.transformCoords
			(
				drawPos.overwriteWith
				(
					vertices[i]
				)
			);

			if (i == 0)
			{
				display.graphics.moveTo
				(
					drawPos.x, drawPos.y
				);
			}
			else
			{
				display.graphics.lineTo
				(
					drawPos.x, drawPos.y
				);
			}
		}

		display.graphics.closePath();
		display.graphics.stroke();

		display.graphics.fill();
	}

	static drawFacesForCamera
	(
		display: Display2D, facesToDraw: FaceTextured[], cameraEntity: Entity
	): void
	{
		for (var i = 0; i < facesToDraw.length; i++)
		{
			DisplayHelper.drawFaceForCamera(display, facesToDraw[i], cameraEntity);
		}
	}
}
