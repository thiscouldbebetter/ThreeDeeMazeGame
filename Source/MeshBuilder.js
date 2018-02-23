
function MeshBuilder()
{
	// do nothing
}

{
	MeshBuilder.prototype.biped = function(material, heightInPixels)
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
			this.box
			(
				//"Pelvis",
				material,
				new Coords(heightOver12, heightOver24, heightOver24),
				new Coords(0, 0, -heightOver2)
			),

			this.box
			(
				//"Spine.1",
				material,
				new Coords(heightOver12, heightOver24, heightOver6),
				new Coords(0, 0, 0 - heightOver2 - heightOver4)
			),

			this.box
			(
				//"Head",
				material,
				new Coords(heightOver18, heightOver18, heightOver18),
				new Coords(0, heightOver36, 0 - heightInPixels)
			),

			this.box
			(
				//"Thigh.L",
				material,
				new Coords(heightOver36, heightOver36, heightOver8),
				new Coords(heightOver18, 0, 0 - heightOver2 + heightOver12)
			),

			this.box
			(
				//"Shin.L",
				material,
				new Coords(heightOver36, heightOver36, heightOver8),
				new Coords(heightOver18, 0, 0 - heightOver6)
			),

			this.box
			(
				//"Foot.L",
				material,
				new Coords(heightOver36, heightOver12, heightOver36),
				new Coords(heightOver18, heightOver12, 0 - heightOver36)
			),

			this.box
			(
				//"Bicep.L",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(heightOver6, 0, 0 - heightOver2 - heightOver3)
			),

			this.box
			(
				//"Forearm.L",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(heightOver6, 0, 0 - heightOver2 - heightOver4 + heightOver8)
			),

			this.box
			(
				//"Thigh.R",
				material,
				new Coords(heightOver36, heightOver36, heightOver8),
				new Coords(0 - heightOver18, 0, 0 - heightOver2 + heightOver12)
			),

			this.box
			(
				//"Shin.R",
				material,
				new Coords(heightOver36, heightOver36, heightOver8),
				new Coords(0 - heightOver18, 0, 0 - heightOver6)
			),

			this.box
			(
				//"Foot.R",
				material,
				new Coords(heightOver36, heightOver12, heightOver36),
				new Coords(0 - heightOver18, heightOver12, 0 - heightOver36)
			),

			this.box
			(
				//"Bicep.R",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(0 - heightOver6, 0, 0 - heightOver2 - heightOver3)
			),

			this.box
			(
				//"Forearm.R",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(0 - heightOver6, 0, 0 - heightOver2 - heightOver4 + heightOver8)
			),
		];

		var vertexGroupNames =
		[
			"Pelvis",
			"Spine.1",
			"Head",
			"Thigh.L",
			"Shin.L",
			"Foot.L",
			"Bicep.L",
			"Forearm.L",
			"Thigh.R",
			"Shin.R",
			"Foot.R",
			"Bicep.R",
			"Forearm.R",
		];

		var returnValue = this.mergeMeshes
		(
			meshesForEntityParts,
			vertexGroupNames
		);

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
		//this.meshVerticesMergeIfWithinDistance(returnValue, 3);

		return returnValue;
	}

	MeshBuilder.prototype.box = function(material, size, pos)
	{
		var returnMesh = this.unitCube(material);

		returnMesh.transform
		(
			new Transform_Scale(size)
		);

		//returnMesh = MeshBuilder.meshNormalsFlip(returnMesh);

		/*
		returnMesh.transform
		(
			new Transform_Translate
			(
				new Coords(0, 0, 0)//size.z / 2)
			)
		);
		*/

		returnMesh.transform
		(
			new Transform_Translate(pos)
		);

		return returnMesh;
	}

	MeshBuilder.prototype.room = function(materialWall, x, y, z, neighborOffsets, connectedToNeighbors)
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

			var meshForWall;

			if (connectedToNeighbors[i] == true)
			{
				meshForWall = this.room_WallWithDoorway(materialWall);
			}
			else
			{
				meshForWall = this.room_Wall(materialWall);
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

		var meshForFloor = this.room_Floor(materialWall);
		meshesForRoom.push(meshForFloor);

		//var meshForCeiling = this.room_Ceiling(material);
		//meshesForRoom.push(meshForCeiling);

		for (var i = 0; i < meshesForRoom.length; i++)
		{
			var mesh = meshesForRoom[i];

			var face = mesh.geometry.faces()[0];
			var faceNormal = face.plane().normal;

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

		var returnMesh = this.mergeMeshes
		(
			meshesForRoom
		);

		returnMesh.transform
		(
			new Transform_Scale(scaleFactors)
		).transform
		(
			new Transform_Translate(new Coords(0, 0, -z))
		);


		return returnMesh;
	}

	MeshBuilder.prototype.room_Ceiling = function(material)
	{
		var returnMesh = this.unitSquare
		(
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

	MeshBuilder.prototype.room_Floor = function(material)
	{
		var returnMesh = this.unitSquare
		(
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

	MeshBuilder.prototype.room_Wall = function(material)
	{
		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// wall
				new Coords(0, 1, -1),
				new Coords(0, -1, -1),
				new Coords(0, -1, 1),
				new Coords(0, 1, 1),

			],
			// vertexIndicesForFaces
			[
				//[ 3, 2, 1, 0 ],
				new Mesh_FaceBuilder([0, 1, 2, 3]),
			]
		);

		returnMesh = new MeshTextured
		(
			returnMesh,
			material,
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

	MeshBuilder.prototype.room_WallWithDoorway = function(material)
	{
		var doorwayHeightOverWallHeight = 0.5;
		var doorwayWidthOverWallHeight = doorwayHeightOverWallHeight / 2;

		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// top
				new Coords(0, -doorwayWidthOverWallHeight, -1),
				new Coords(0, doorwayWidthOverWallHeight, -1),
				new Coords(0, doorwayWidthOverWallHeight, -doorwayHeightOverWallHeight),
				new Coords(0, -doorwayWidthOverWallHeight, -doorwayHeightOverWallHeight),

				// left
				new Coords(0, -1, -1),
				new Coords(0, -doorwayWidthOverWallHeight, -1),
				new Coords(0, -doorwayWidthOverWallHeight, 1),
				new Coords(0, -1, 1),

				// right
				new Coords(0, 1, -1),
				new Coords(0, 1, 1),
				new Coords(0, doorwayWidthOverWallHeight, 1),
				new Coords(0, doorwayWidthOverWallHeight, -1),
			],
			// vertexIndicesForFaces
			[
				// top, left, right
				new Mesh_FaceBuilder([ 3, 2, 1, 0 ]),
				new Mesh_FaceBuilder([ 7, 6, 5, 4 ]),
				new Mesh_FaceBuilder([ 11, 10, 9, 8 ]),
			]
		);

		var textureUVs =
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
		];

		returnMesh = new MeshTextured
		(
			returnMesh,
			material,
			textureUVs
		);

		return returnMesh;
	}

	MeshBuilder.prototype.unitCube = function(material)
	{
		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
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
			],
			// vertexIndicesForFaces
			[
				new Mesh_FaceBuilder([7, 3, 0, 4]), // west
				new Mesh_FaceBuilder([5, 1, 2, 6]), // east

				new Mesh_FaceBuilder([4, 0, 1, 5]), // north
				new Mesh_FaceBuilder([6, 2, 3, 7]), // south

				new Mesh_FaceBuilder([0, 3, 2, 1]), // top
				new Mesh_FaceBuilder([5, 6, 7, 4]), // bottom
			]
		);

		returnMesh = new MeshTextured(returnMesh, material);

		return returnMesh;
	}

	MeshBuilder.prototype.unitRing = function(material, numberOfVertices)
	{
		var vertices = [];
		var vertexIndicesForFace = [];

		for (var i = 0; i < numberOfVertices; i++)
		{
			var vertexAngleInTurns = i / numberOfVertices;

			var vertexPolar = new Polar(vertexAngleInTurns, 1);
			var vertex = vertexPolar.toCoords();

			vertices.push(vertex);

			vertexIndicesForFace.splice(0, 0, i);
		}

		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			vertices,
			[ new Mesh_FaceBuilder(vertexIndicesForFace) ]
		);

		returnMesh = new MeshTextured(returnMesh, material);

		return returnMesh;
	}

	MeshBuilder.prototype.unitSquare = function(material)
	{
		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// back
				new Coords(1, -1, 0),
				new Coords(1, 1, 0),
				new Coords(-1, 1, 0),
				new Coords(-1, -1, 0),
			],
			// vertexIndicesForFaces
			[
				new Mesh_FaceBuilder([3, 2, 1, 0])
				//[0, 1, 2, 3]
			]
		);

		returnMesh = new MeshTextured
		(
			returnMesh,
			material,
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

	MeshBuilder.prototype.clipFaceAgainstPlanes = function(faceToClip, planesToClipAgainst)
	{
		var returnValue = faceToClip;

		for (var p = 0; p < planesToClipAgainst.length; p++)
		{
			faceToClip = MeshBuilder.splitFaceByPlaneFrontAndBack
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

	MeshBuilder.prototype.mergeMeshes = function(meshesToMerge, vertexGroupNames)
	{
		var verticesMerged = [];
		var faceBuildersMerged = [];
		var textureUVsForFacesMerged = [];
		var vertexGroups = [];

		var numberOfVerticesSoFar = 0;

		for (var m = 0; m < meshesToMerge.length; m++)
		{
			var meshToMerge = meshesToMerge[m];
			var meshToMergeGeometry = meshToMerge.geometry;
			var verticesToMerge = meshToMergeGeometry.vertices();

			verticesMerged = verticesMerged.concat
			(
				verticesToMerge
			);

			var faceBuildersToMerge = meshToMergeGeometry.faceBuilders;
			for (var f = 0; f < faceBuildersToMerge.length; f++)
			{
				var faceBuilder = faceBuildersToMerge[f];
				faceBuilder.vertexIndicesShift(numberOfVerticesSoFar);
				faceBuildersMerged.push(faceBuilder);
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

			if (vertexGroupNames != null)
			{
				var vertexIndicesInVertexGroup = [];
				for (var v = 0; v < verticesToMerge.length; v++)
				{
					vertexIndicesInVertexGroup.push(numberOfVerticesSoFar + v);
				}

				var vertexGroup = new VertexGroup
				(
					vertexGroupNames[m],
					vertexIndicesInVertexGroup
				);

				vertexGroups.push(vertexGroup);
			}

			numberOfVerticesSoFar += verticesToMerge.length;
		}

		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			verticesMerged,
			faceBuildersMerged
		);

		returnMesh = new MeshTextured
		(
			returnMesh,
			meshesToMerge[0].material,
			textureUVsForFacesMerged,
			vertexGroups
		);

		return returnMesh;
	}

	MeshBuilder.prototype.splitFaceByPlaneFrontAndBack = function(faceToDivide, planeToDivideOn)
	{
		var returnValues = [];

		var verticesInFacesDivided =
		[
			[], // front
			[], // back
		];

		var distanceOfVertexAbovePlane = 0;

		var faceToDivideVertices = faceToDivide.geometry.vertices;
		for (var v = 0; v < faceToDivideVertices.length; v++)
		{
			var vertex = faceToDivideVertices[v];

			var distanceOfVertexAbovePlane = Collision.findDistanceOfPositionAbovePlane
			(
				vertex,
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

		var edges = faceToDivide.geometry.edges();
		for (var e = 0; e < edges.length; e++)
		{
			var edge = edges[e];
			var vertex0 = edge.vertices[0];

			verticesInFaceDivided.push
			(
				vertex0
			);

			var distanceOfVertex0AbovePlane = Collision.findDistanceOfPositionAbovePlane
			(
				vertex0,
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
						collision.pos
					);

					facesDividedIndex = 1 - facesDividedIndex;
					verticesInFaceDivided = verticesInFacesDivided[facesDividedIndex];

					verticesInFaceDivided.push
					(
						collision.pos
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
					var faceDivided = new FaceTextured
					(
						new Face(verticesInFace),
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
