
function SpacePartitioningTreeNode(faces)
{
	var faceToDivideOn = faces[0];
	this.faces = [ faceToDivideOn ];
	var planeToDivideOn = faceToDivideOn.plane;

	if (faces.length == 1)
	{
		this.children = null;
	}
	else
	{
		var faceSetsFrontAndBack = 
		[
			[],
			[]
		];

		for (var f = 1; f < faces.length; f++)
		{
			var faceOther = faces[f];
			if (faceOther.plane.equals(faceToDivideOn.plane) == true)
			{
				this.faces.push(faceOther);
			}
			else
			{
				var facesDividedFrontAndBack = MeshHelper.splitFaceByPlaneFrontAndBack
				(
					faceOther,
					planeToDivideOn
				);
	
				for (var i = 0; i < facesDividedFrontAndBack.length; i++)
				{
					var facePart = facesDividedFrontAndBack[i];
					if (facePart != null)
					{
						var facesForChildNode = faceSetsFrontAndBack[i];
						facesForChildNode.push(facePart);
					}
				}
			}
		}
	
		this.children = [];

		for (var i = 0; i < faceSetsFrontAndBack.length; i++)
		{ 
			var faceSet = faceSetsFrontAndBack[i];
			var childNode = null;
			if (faceSet.length > 0)
			{
				childNode = new SpacePartitioningTreeNode(faceSet);
			}
			this.children[i] = childNode;
		}
	}
}

{
	SpacePartitioningTreeNode.prototype.addFacesBackToFrontForCameraPosToList = function
	( 
		cameraPos,
		facesToAddTo
	)
	{
		if (this.children == null)
		{
			for (var i = 0; i < this.faces.length; i++)
			{
				facesToAddTo.push(this.faces[i]);
			}
		}			
		else
		{
			var distanceOfCameraAbovePlane = Collision.findDistanceOfPositionAbovePlane
			(		
				cameraPos,	
				this.faces[0].plane
			)

			var childIndexFirst = (distanceOfCameraAbovePlane > 0 ? 1 : 0);

			var nodeChild = this.children[childIndexFirst];
			if (nodeChild != null)
			{
				nodeChild.addFacesBackToFrontForCameraPosToList
				( 
					cameraPos,
					facesToAddTo
				);
			}

			for (var f = 0; f < this.faces.length; f++)
			{
				facesToAddTo.push(this.faces[f]);
			}

			var nodeChild = this.children[1 - childIndexFirst];
			if (nodeChild != null)
			{
				nodeChild.addFacesBackToFrontForCameraPosToList
				(
					cameraPos,
					facesToAddTo
				);
			}
		}
	}
}
