
function MeshHelper()
{
	// do nothing
}

{
	MeshHelper.buildBiped = function(material, heightInPixels)
	{
		var heightOver2 = heightInPixels / 2;
		var heightOver3 = heightInPixels / 3;
		var heightOver4 = heightInPixels / 4;
		var heightOver6 = heightInPixels / 6;
		var heightOver8 = heightInPixels / 8;
		var heightOver9 = heightInPixels / 9;
		var heightOver12 = heightInPixels / 12;
		var heightOver18 = heightInPixels / 18;
		var heightOver24 = heightInPixels / 24;
		var heightOver36 = heightInPixels / 36;

		var meshesForEntityParts = 
		[
			MeshHelper.buildBox
			(
				"Pelvis",
				material, 
				new Coords(heightOver12, heightOver24, heightOver24), 
				new Coords(0, 0, -heightOver2)
			),

			MeshHelper.buildBox
			(
				"Spine.1", 
				material,
				new Coords(heightOver12, heightOver24, heightOver6),
				new Coords(0, 0, 0 - heightOver2 - heightOver4)
			),

			MeshHelper.buildBox
			(
				"Head", 
				material,
				new Coords(heightOver18, heightOver18, heightOver18),
				new Coords(0, heightOver36, 0 - heightInPixels)
			),

			MeshHelper.buildBox
			(
				"Thigh.L", 
				material,
				new Coords(heightOver36, heightOver36, heightOver8), 
				new Coords(heightOver18, 0, 0 - heightOver2 + heightOver12)
			),

			MeshHelper.buildBox
			(
				"Shin.L", 
				material,
				new Coords(heightOver36, heightOver36, heightOver8), 
				new Coords(heightOver18, 0, 0 - heightOver6)
			),

			MeshHelper.buildBox
			(
				"Foot.L", 
				material,
				new Coords(heightOver36, heightOver12, heightOver36), 
				new Coords(heightOver18, heightOver12, 0 - heightOver36)
			),

			MeshHelper.buildBox
			(
				"Bicep.L", 
				material,
				new Coords(heightOver36, heightOver36, heightOver12), 
				new Coords(heightOver6, 0, 0 - heightOver2 - heightOver3)
			),

			MeshHelper.buildBox
			(
				"Forearm.L", 
				material,
				new Coords(heightOver36, heightOver36, heightOver12), 
				new Coords(heightOver6, 0, 0 - heightOver2 - heightOver4 + heightOver8)
			),

			MeshHelper.buildBox
			(
				"Thigh.R", 
				material,
				new Coords(heightOver36, heightOver36, heightOver8), 
				new Coords(0 - heightOver18, 0, 0 - heightOver2 + heightOver12)
			),

			MeshHelper.buildBox
			(
				"Shin.R", 
				material,
				new Coords(heightOver36, heightOver36, heightOver8), 
				new Coords(0 - heightOver18, 0, 0 - heightOver6)
			),

			MeshHelper.buildBox
			(
				"Foot.R", 
				material,
				new Coords(heightOver36, heightOver12, heightOver36), 
				new Coords(0 - heightOver18, heightOver12, 0 - heightOver36)
			),

			MeshHelper.buildBox
			(
				"Bicep.R",
				material, 
				new Coords(heightOver36, heightOver36, heightOver12), 
				new Coords(0 - heightOver6, 0, 0 - heightOver2 - heightOver3)
			),

			MeshHelper.buildBox
			(
				"Forearm.R", 
				material,
				new Coords(heightOver36, heightOver36, heightOver12), 
				new Coords(0 - heightOver6, 0, 0 - heightOver2 - heightOver4 + heightOver8)
			),		
		];

		var returnValue = MeshHelper.mergeMeshes
		(
			"MeshBiped",
			meshesForEntityParts
		);

		/*
		returnValue.transform(new Transform_DimensionsSwap([0, 1]))
		returnValue.transform(new Transform_Scale(new Coords(-1, -1, 1)));
		*/

		returnValue.transform
		(
			new Transform_Orient
			(
				new Orientation
				(
					new Coords(0, 1, 0),
					new Coords(0, 0, 1)
				)
			)
		);

		// fix
		//MeshHelper.meshVerticesMergeIfWithinDistance(returnValue, 3);

		return returnValue;
	}

	MeshHelper.buildBox = function(name, material, size, pos)
	{
		var returnMesh = MeshHelper.buildUnitCube(name, material);

		returnMesh.transform
		(
			new Transform_Scale(size)
		);

		returnMesh.transform
		(
			new Transform_Translate
			(
				new Coords(0, 0, 0)//size.z / 2)
			)
		);

		returnMesh.transform
		(
			new Transform_Translate(pos)
		);		

		return returnMesh;
	}

	MeshHelper.buildRoom = function(name, material, x, y, z, neighborOffsets, connectedToNeighbors)
	{
		var wallNormals = neighborOffsets;

		if (connectedToNeighbors == null)
		{
			connectedToNeighbors = [ false, false, false, false ];
		}

		var meshesForRoom = [];

		var down = new Coords(0, 0, 1);

		for (var i = 0; i < wallNormals.length; i++)
		{
			var wallNormal = wallNormals[i];

			var scaleFactors = new Coords(x, y, z);

			var meshName = "[wall]";
	
			var meshForWall;
			
			if (connectedToNeighbors[i] == true)
			{	
				meshForWall = MeshHelper.buildRoom_WallWithDoorway
				(
					meshName, 
					material
				);
			}
			else
			{
				meshForWall = MeshHelper.buildRoom_Wall
				(
					meshName, 
					material
				);
			}

			wallOrientation = new Orientation
			(
				wallNormal,
				down
			);

			meshForWall.transform
			(
				new Transform_Orient
				(
					wallOrientation
				)
			).transform
			(
				new Transform_Translate
				(
					wallNormal
				)	
			);

			// hack
			if (wallNormal.y != 0)
			{
				meshForWall.transform
				(
					new Transform_Scale
					(
						new Coords(-1, 1, 1)
					)
				);
			}
	
			meshesForRoom.push
			(
				meshForWall
			);
		}

		var meshForFloor = MeshHelper.buildRoom_Floor(material);
		meshesForRoom.push(meshForFloor);

		//var meshForCeiling = MeshHelper.buildRoom_Ceiling(material);
		//meshesForRoom.push(meshForCeiling);

		for (var i = 0; i < meshesForRoom.length; i++)
		{
			var mesh = meshesForRoom[i];

			var face = mesh.faces[0];
			var faceNormal = face.plane.normal;
			
			var faceOrientation;

			if (faceNormal.z == 0)
			{
				faceOrientation = new Orientation
				(
					faceNormal,
					down
				);
			}
			else
			{
				faceOrientation = new Orientation
				(
					faceNormal,
					new Coords(1, 0, 0)
				);
			}

			var faceTangent = faceOrientation.right;
			var faceDown = faceOrientation.down;			

			mesh.transformTextureUVs
			(
				new Transform_Scale
				(
					new Coords
					(
						faceTangent.dotProduct(scaleFactors), 
						faceDown.dotProduct(scaleFactors)
					).absolute()
				)
			)			
		}

		var returnMesh = MeshHelper.mergeMeshes
		(
			name,
			meshesForRoom
		);

		returnMesh.transform
		(
			new Transform_Scale(scaleFactors)
		).transform
		(
			new Transform_Translate(new Coords(0, 0, -z))
		).recalculateDerivedValues();


		return returnMesh;
	}

	MeshHelper.buildUnitRing = function(name, material, numberOfVertices)
	{
		var vertices = [];
		var vertexIndicesForFace = [];

		for (var i = 0; i < numberOfVertices; i++)
		{
			var vertexAngle = 
				Constants.RadiansPerCircle 
				* i 
				/ numberOfVertices;

			var vertexPolar = new Polar(vertexAngle, 0, 1);
			var vertexPos = vertexPolar.toCoords();
			var vertex = new Vertex(vertexPos);

			vertices.push(vertex);

			vertexIndicesForFace.splice(0, 0, i);
		}

		var returnMesh = new Mesh
		(
			name,
			material, 
			vertices,
			[ vertexIndicesForFace ]
		);

		return returnMesh;
	}

	MeshHelper.buildRoom_Ceiling = function(material)
	{
		var returnMesh = new MeshHelper.buildUnitSquare
		(
			"Ceiling",
			material
		).transform
		(
			new Transform_Scale
			(
				new Coords(1, 1, -1)
			)
		).transform
		(
			new Transform_Translate
			(
				new Coords(0, 0, -1)
			)
		).transformTextureUVs
		(
			new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(.2))
		);

		return returnMesh;
	}


	MeshHelper.buildRoom_Floor = function(material)
	{
		var returnMesh = new MeshHelper.buildUnitSquare
		(
			"Floor",
			material
		).transform
		(
			new Transform_Translate
			(
				new Coords(0, 0, 1)
			)
		).transformTextureUVs
		(
			new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(.2))
		);

		return returnMesh;
	}

	MeshHelper.buildRoom_Wall = function(name, material)
	{
		var returnMesh = new Mesh
		(
			name, 
			material,
			// vertices
			Vertex.buildManyFromPositions
			([
				// wall
				new Coords(0, 1, -1),
				new Coords(0, -1, -1), 
				new Coords(0, -1, 1),
				new Coords(0, 1, 1),

			]),
			// vertexIndicesForFaces
			[
				//[ 3, 2, 1, 0 ],
				[0, 1, 2, 3], 
			],
			// textureUVs
			[
				[ 
					new Coords(.2, 0), 
					new Coords(0, 0), 
					new Coords(0, .2),
					new Coords(.2, .2), 
				],
			]
		);

		return returnMesh;
	}

	MeshHelper.buildRoom_WallWithDoorway = function(name, material)
	{
		var returnMesh = new Mesh
		(
			name, 
			material,
			// vertices
			Vertex.buildManyFromPositions
			([
				// top
				new Coords(0, -.25, -1), 
				new Coords(0, .25, -1),
				new Coords(0, .25, -.5),
				new Coords(0, -.25, -.5),

				// left
				new Coords(0, -1, -1), 
				new Coords(0, -.25, -1),
				new Coords(0, -.25, 1),
				new Coords(0, -1, 1),

				// right
				new Coords(0, 1, -1), 
				new Coords(0, 1, 1),
				new Coords(0, .25, 1),
				new Coords(0, .25, -1),
			]),
			// vertexIndicesForFaces
			[
				// top, left, right
				[ 3, 2, 1, 0 ], 
				[ 7, 6, 5, 4 ],
				[ 11, 10, 9, 8 ],
			],
			// textureUVs
			[
				// top
				[ 
					new Coords(0, .05),
					new Coords(.05, .05),
					new Coords(.05, 0),
					new Coords(0, 0),
				],
				// left
				[ 
					new Coords(0, .2),
					new Coords(.05, .2),
					new Coords(.05, 0),
					new Coords(0, 0), 
				],
				// right
				[ 
					new Coords(0, 0), 
					new Coords(0, .2),
					new Coords(.05, .2),
					new Coords(.05, 0), 
				],
			]
		);

		return returnMesh;
	}

	MeshHelper.buildUnitCube = function(name, material)
	{
		var returnMesh = new Mesh
		(
			name, 
			material,
			// vertices
			Vertex.buildManyFromPositions
			([
				// top
				new Coords(-1, -1, -1), 
				new Coords(1, -1, -1),
				new Coords(1, 1, -1),
				new Coords(-1, 1, -1),

				// bottom
				new Coords(-1, -1, 1), 
				new Coords(1, -1, 1),
				new Coords(1, 1, 1),
				new Coords(-1, 1, 1),
			]),
			// vertexIndicesForFaces
			[
				[7, 4, 0, 3], // west
				[5, 6, 2, 1], // east

				[4, 5, 1, 0], // north
				[6, 7, 3, 2], // south

				[0, 1, 2, 3], // top
				[5, 4, 7, 6], // bottom
			]
		);

		return returnMesh;
	}

	MeshHelper.buildUnitSquare = function(name, material)
	{
		var returnMesh = new Mesh
		(
			name, 
			material,
			// vertices
			Vertex.buildManyFromPositions
			([
				// back 
				new Coords(1, -1, 0), 
				new Coords(1, 1, 0),
				new Coords(-1, 1, 0),
				new Coords(-1, -1, 0),
			]),
			// vertexIndicesForFaces
			[
				[3, 2, 1, 0]
				//[0, 1, 2, 3]
			],
			// textureUVs
			[
				[
					new Coords(0, 0),
					new Coords(1, 0),
					new Coords(1, 1),
					new Coords(0, 1),
				]
			]
		);

		return returnMesh;
	}

	MeshHelper.clipFaceAgainstPlanes = function(faceToClip, planesToClipAgainst)
	{
		var returnValue = faceToClip;

		for (var p = 0; p < planesToClipAgainst.length; p++)
		{
			faceToClip = MeshHelper.splitFaceByPlaneFrontAndBack
			(
				faceToClip,
				planesToClipAgainst[p]
			)[0];

			if (faceToClip == null)
			{
				break;
			}
		}

		return faceToClip;
	}

	MeshHelper.mergeMeshes = function(name, meshesToMerge)
	{
		var verticesMerged = [];
		var vertexIndicesForFacesMerged = [];
		var textureUVsForFacesMerged = [];
		var vertexGroups = [];

		var numberOfVerticesSoFar = 0;

		for (var m = 0; m < meshesToMerge.length; m++)
		{
			var meshToMerge = meshesToMerge[m];

			verticesMerged = verticesMerged.concat
			(
				meshToMerge.vertices
				//Cloneable.cloneMany(meshToMerge.vertices)
			);			
			
			for (var f = 0; f < meshToMerge.vertexIndicesForFaces.length; f++)
			{
				var vertexIndicesForFace = meshToMerge.vertexIndicesForFaces[f];
				var vertexIndicesForFaceShifted = [];
				for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
				{
					var vertexIndex = vertexIndicesForFace[vi];
					var vertexIndexShifted = vertexIndex + numberOfVerticesSoFar;

					vertexIndicesForFaceShifted.push
					(
						vertexIndexShifted
					);	
				}

				vertexIndicesForFacesMerged.push(vertexIndicesForFaceShifted);
			}

			var textureUVsForFaces = meshToMerge.textureUVsForFaceVertices;
			if (textureUVsForFaces != null)
			{
				for (var f = 0; f < textureUVsForFaces.length; f++)
				{
					var textureUVsForFace = textureUVsForFaces[f];
					var textureUVsForFaceCloned = textureUVsForFace.clone();
					textureUVsForFacesMerged.push(textureUVsForFaceCloned);
				}
			}

			var vertexIndicesInVertexGroup = [];
			for (var v = 0; v < meshToMerge.vertices.length; v++)
			{
				vertexIndicesInVertexGroup.push(numberOfVerticesSoFar + v);	
			}

			var vertexGroup = new VertexGroup
			(
				meshToMerge.name,
				vertexIndicesInVertexGroup
			);

			vertexGroups.push(vertexGroup);

			numberOfVerticesSoFar += meshToMerge.vertices.length;
		}

		var returnMesh = new Mesh
		(
			name,
			meshesToMerge[0].material, 
			verticesMerged,
			vertexIndicesForFacesMerged,
			textureUVsForFacesMerged,
			vertexGroups
		);

		return returnMesh;
	}

	MeshHelper.meshVerticesMergeIfWithinDistance = function(mesh, distanceToMergeWithin)
	{
		var vertices = mesh.vertices;

		var verticesDuplicated = [];
		var vertexIndexDuplicateToOriginalLookup = [];

		var displacementBetweenVertices = new Coords(0, 0, 0);

		for (var i = 0; i < vertices.length; i++)
		{
			var vertexToConsider = vertices[i];
		
			for (j = 0; j < i; j++)
			{
				var vertexAlreadyConsidered = vertices[j];

				displacementBetweenVertices.overwriteWith
				(
					vertexToConsider
				).subtract
				(
					vertexAlreadyConsidered
				);

				var distanceBetweenVertices = displacementBetweenVertices.magnitude();

				if (distanceBetweenVertices <= distanceToMergeWithin)
				{
					// if the original is not itself a duplicate
					if (vertexIndexDuplicateToOriginalLookup[j] == null)
					{
						verticesDuplicated.push(vertexToConsider);
						vertexIndexDuplicateToOriginalLookup[i] = j;
						break;
					}
				}
			}
		}

		var verticesMinusDuplicates = vertices.slice();

		for (var i = 0; i < verticesDuplicated.length; i++)
		{
			var vertexDuplicated = verticesDuplicated[i];

			verticesMinusDuplicates.splice
			(
				verticesMinusDuplicates.indexOf(vertexDuplicated),
				1
			);
		}
	
		for (var f = 0; f < mesh.vertexIndicesForFaces.length; f++)
		{
			var vertexIndices = mesh.vertexIndicesForFaces[f];

			for (var vi = 0; vi < vertexIndices.length; vi++)
			{
				var vertexIndexToUpdate = vertexIndices[vi];
				var vertexToUpdate = vertices[vertexIndexToUpdate];
				var isVertexDuplicated = (verticesDuplicated.indexOf(vertexToUpdate) >= 0);
				if (isVertexDuplicated == true)
				{
					var vertexIndexOriginal = vertexIndexDuplicateToOriginalLookup[vertexIndexToUpdate];
					vertexToUpdate = vertices[vertexIndexOriginal];

				}	
				var vertexIndexUpdated = verticesMinusDuplicates.indexOf
				(
					vertexToUpdate
				);

				vertexIndices[vi] = vertexIndexUpdated;	
			}
		}

		for (var g = 0; g < mesh.vertexGroups.length; g++)
		{
			var vertexGroup = mesh.vertexGroups[g];
			var vertexIndices = vertexGroup.vertexIndices;

			for (var vi = 0; vi < vertexIndices.length; vi++)
			{
				var vertexIndexToUpdate = vertexIndices[vi];
				var vertexToUpdate = vertices[vertexIndexToUpdate];
				var isVertexDuplicated = (verticesDuplicated.indexOf(vertexToUpdate) >= 0);
				if (isVertexDuplicated == true)
				{
					var vertexIndexOriginal = vertexIndexDuplicateToOriginalLookup[vertexIndexToUpdate];
					vertexToUpdate = vertices[vertexIndexOriginal];

				}	
				var vertexIndexUpdated = verticesMinusDuplicates.indexOf
				(
					vertexToUpdate
				);
				vertexIndices[vi] = vertexIndexUpdated;
			}
		}

		mesh.vertices = verticesMinusDuplicates;
	}

	MeshHelper.removeFacesWithIndicesFromMesh = function(indicesOfFacesToRemove, meshToRemoveFrom)
	{	
		var indicesOfFacesToRemoveSorted = indicesOfFacesToRemove.sortIntoOtherUsingCompareFunction
		(	
			[], // arraySorted, 
			function(index0, index1)
			{
				return index0 - index1;
			}
		)

		for (var i = 0; i < indicesOfFacesToRemoveSorted.length; i++)
		{
			var indexOfFaceToRemove = indicesOfFacesToRemoveSorted[i];

			meshToRemoveFrom.vertexIndicesForFaces.splice(indexOfFaceToRemove, 1);
			meshToRemoveFrom.faces.splice(indexOfFaceToRemove, 1);
		}

		meshToRemoveFrom.recalculateDerivedValues();

		return meshToRemoveFrom;
	}

	MeshHelper.splitFaceByPlaneFrontAndBack = function(faceToDivide, planeToDivideOn)
	{
		var returnValues = [];

		var verticesInFacesDivided = 
		[
			[], // front
			[], // back
		];

		var distanceOfVertexAbovePlane = 0;

		for (var v = 0; v < faceToDivide.vertices.length; v++)
		{
			var vertexPosition = faceToDivide.vertices[v].pos;

			var distanceOfVertexAbovePlane = Collision.findDistanceOfPositionAbovePlane
			(
				vertexPosition,
				planeToDivideOn
			);

			if (distanceOfVertexAbovePlane != 0)
			{
				break;
			}
		}

		var facesDividedIndex = (distanceOfVertexAbovePlane > 0 ? 0 : 1);

		var verticesInFaceDivided = verticesInFacesDivided[facesDividedIndex];

		var doAnyEdgesCollideWithPlaneSoFar = false;

		for (var e = 0; e < faceToDivide.edges.length; e++)
		{
			var edge = faceToDivide.edges[e];
			var vertexPosition0 = edge.vertices[0];

			verticesInFaceDivided.push
			(
				new Vertex(vertexPosition0)
			);

			var distanceOfVertex0AbovePlane = Collision.findDistanceOfPositionAbovePlane
			(
				vertexPosition0,
				planeToDivideOn
			);

			var distanceOfVertex1AbovePlane = Collision.findDistanceOfPositionAbovePlane
			(
				edge.vertices[1],
				planeToDivideOn				
			);

			if (distanceOfVertex0AbovePlane * distanceOfVertex1AbovePlane < 0)
			{
				var collision = Collision.findCollisionOfEdgeAndPlane
				(
					edge, 
					planeToDivideOn
				);

				if (collision != null)
				{					
					doAnyEdgesCollideWithPlaneSoFar = true;

					verticesInFaceDivided.push
					(
						new Vertex(collision.pos)
					);
	
					facesDividedIndex = 1 - facesDividedIndex;
					verticesInFaceDivided = verticesInFacesDivided[facesDividedIndex];
					
					verticesInFaceDivided.push
					(
						new Vertex(collision.pos)
					);
				}
			}
		}

		if (doAnyEdgesCollideWithPlaneSoFar == true)
		{
			for (var i = 0; i < verticesInFacesDivided.length; i++)
			{
				var verticesInFace = verticesInFacesDivided[i];

				if (verticesInFace.length > 2)
				{
					var faceDivided = new Face
					(
						verticesInFace, 
						faceToDivide.material
					)

					returnValues.push 
					(
						faceDivided
					);
				}
			}
		}
		else
		{
			returnValues[facesDividedIndex] = faceToDivide;
		}

		return returnValues;
	}
}
