
function Camera(viewSize, focalLength, entity)
{
	this.viewSize = viewSize;
	this.focalLength = focalLength;
	this.entity = entity;

	this.viewSizeHalf = this.viewSize.clone().divideScalar(2);
	this.viewSizeHalf.z = 0;
}

{
	Camera.prototype.clipPlanes = function()
	{
		if (this._clipPlanes == null)
		{
			this._clipPlanes = 
			[
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
				new Plane(new Coords(0, 0, 0), 0),
			];			
		}
		
		var cameraLoc = this.loc;
		var cameraOrientation = cameraLoc.orientation;

		var cameraPos = cameraLoc.pos.clone();

		var centerOfViewPlane = cameraPos.clone().add
		(	
			cameraOrientation.forward.clone().multiplyScalar
			(
				this.focalLength
			)
		);

		var cornerOffsetRight =	cameraOrientation.right.clone().multiplyScalar
		(
			this.viewSizeHalf.x
		);
		
		var cornerOffsetDown = cameraOrientation.down.clone().multiplyScalar
		(
			this.viewSizeHalf.y
		);

		var cameraViewCorners =
		[
			centerOfViewPlane.clone().add
			(
				cornerOffsetRight
			).add
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().subtract
			(
				cornerOffsetRight
			).add
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().subtract
			(
				cornerOffsetRight
			).subtract
			(
				cornerOffsetDown
			),

			centerOfViewPlane.clone().add
			(
				cornerOffsetRight
			).subtract
			(
				cornerOffsetDown
			),

		];
		
		var numberOfCorners = cameraViewCorners.length;

		for (var i = 0; i < numberOfCorners; i++)
		{
			var iNext = i + 1;
			if (iNext >= numberOfCorners)
			{
				iNext = 0;
			}

			var clipPlane = this._clipPlanes[i];

			var cameraViewCorner = cameraViewCorners[i];
			var cameraViewCornerNext = cameraViewCorners[iNext];

			clipPlane.fromPoints
			(
				cameraPos,
				cameraViewCorner,
				cameraViewCornerNext
			);
		}

		return this._clipPlanes;
	}
}
