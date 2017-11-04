
function DisplayHelper2D(sizeInPixels)
{
	this.sizeInPixels = sizeInPixels;

	this.drawPositions = [];
	this.isSketchModeOn = false;
}

{
	DisplayHelper2D.prototype.clear = function()
	{
		this.graphics.strokeStyle = "LightGray";

		if (this.isSketchModeOn == true)
		{
			this.graphics.fillStyle = Color.Instances.White.systemColor;
		}
		else
		{
			this.graphics.fillStyle = Color.Instances.Black.systemColor;
		}

		this.graphics.fillRect
		(
			0, 0, 
			this.sizeInPixels.x, 
			this.sizeInPixels.y
		);

		this.graphics.strokeRect
		(
			0, 0, 
			this.sizeInPixels.x, 
			this.sizeInPixels.y
		);
	}

	DisplayHelper2D.prototype.drawFaceForCamera = function(faceToDraw, camera)
	{
		var cameraClipPlanes = camera.clipPlanes();

		faceToDraw = MeshHelper.clipFaceAgainstPlanes(faceToDraw, cameraClipPlanes);

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

		if (this.isSketchModeOn == true)
		{
			this.graphics.fillStyle = "White";
			this.graphics.strokeStyle = "LightGray";
		}
		else
		{
			this.graphics.fill();
		}


		//this.graphics.stroke();
	}

	DisplayHelper2D.prototype.drawFacesForCamera = function(facesToDraw, camera)
	{
		for (var i = 0; i < facesToDraw.length; i++)
		{
			this.drawFaceForCamera(facesToDraw[i], camera);
		}
	}

	DisplayHelper2D.prototype.drawLine = function(startPos, endPos, color)
	{
		this.graphics.strokeStyle = color.systemColor;
		this.graphics.beginPath();
		this.graphics.moveTo(startPos.x, startPos.y);
		this.graphics.lineTo(endPos.x, endPos.y);
		this.graphics.stroke();
	}

	DisplayHelper2D.prototype.drawText = function(textToDraw, pos)
	{
		this.graphics.fillStyle = Color.Instances.White.systemColor;

		this.graphics.fillText
		(
			textToDraw,
			pos.x, pos.y
		);
	}

	DisplayHelper2D.prototype.drawWorld = function(world)
	{
		var facesToDraw = [];

		var cameraPos = world.camera.loc.pos;

		var spacePartitioningTreeRoot = 
			world.spacePartitioningTreeForZonesActive.nodeRoot;

		spacePartitioningTreeRoot.addFacesBackToFrontForCameraPosToList
		(
			cameraPos,
			facesToDraw
		);

		var bodies = world.bodies;
		for (var b = 0; b < bodies.length; b++)
		{
			var entity = bodies[b];
			var entityDefn = entity.defn;

			if (entityDefn.isDrawable == true)
			{
				if (entityDefn.isMovable == true)
				{
					// hack
					// Find the floor the mover is standing on,
					// and draw the mover immediately after that floor.

					var edgeForFootprint = new Edge
					(
						[
							entity.loc.pos,
							entity.loc.pos.clone().add(new Coords(0, 0, 100))
						]
					);

					for (var g = facesToDraw.length - 1; g >= 0; g--)
					{
						var face = facesToDraw[g];
						var collisionForFootprint = Collision.findCollisionOfEdgeAndFace
						(
							edgeForFootprint,
							face
						);

						var isEntityStandingOnFace = (collisionForFootprint != null);

						if (isEntityStandingOnFace == true)
						{
							var moverFaces = entity.meshTransformed.faces;
							for (var f = 0; f < moverFaces.length; f++)
							{
								var moverFace = moverFaces[f];
								facesToDraw.splice
								(
									g + 1, 0, moverFace
								)
							}
							break;
						}

					}
				}
			}
		}
		
		this.clear();
		this.drawFacesForCamera(facesToDraw, world.camera);
		this.drawText(world.name, new Coords(0, 10));
		this.drawText(world.secondsElapsed(), new Coords(0, 20));
		this.drawText
 		(
			world.bodies[0].loc.pos.clone().floor().toString(), 
			new Coords(0, 30)
		);
	}

	DisplayHelper2D.prototype.initialize = function()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;
		this.graphics = this.canvas.getContext("2d");

		document.body.appendChild(this.canvas);

		this.drawPos = new Coords(0, 0, 0);
		this.drawPosFrom = new Coords(0, 0, 0);
		this.drawPosTo = new Coords(0, 0, 0);
		this.faces = [];
		this.meshesToDrawSorted = [];
	}
}
