
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
				new Coords(heightOver8, 0, 0 - heightOver2 - heightOver3)
			),

			this.box
			(
				//"Forearm.L",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(heightOver8, 0, 0 - heightOver2 - heightOver4 + heightOver8)
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
				new Coords(0 - heightOver8, 0, 0 - heightOver2 - heightOver3)
			),

			this.box
			(
				//"Forearm.R",
				material,
				new Coords(heightOver36, heightOver36, heightOver12),
				new Coords(0 - heightOver8, 0, 0 - heightOver2 - heightOver4 + heightOver8)
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
		).transform
		(
			new Transform_Translate(pos)
		);

		return returnMesh;
	}

	MeshBuilder.prototype.room = function
	(
		roomSize, doorSize, neighborOffsets, connectedToNeighbors, materialWall, materialFloor
	)
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

			var meshForWall;

			if (connectedToNeighbors[i] == true)
			{
				meshForWall = this.room_WallWithDoorway(roomSize, doorSize, wallNormal, materialWall);
			}
			else
			{
				meshForWall = this.room_Wall(roomSize, doorSize, wallNormal, materialWall);
			}

			meshesForRoom.push
			(
				meshForWall
			);
		}

		var meshForFloor = this.room_Floor(roomSize, doorSize, materialFloor);
		meshesForRoom.push(meshForFloor);

		var returnMesh = this.mergeMeshes
		(
			meshesForRoom
		);

		return returnMesh;
	}

	MeshBuilder.prototype.room_Floor = function(roomSize, doorSize, material)
	{
		var roomSizeMinusWallThickness = roomSize.clone().subtract
		(
			doorSize.clone().clearZ()
		);

		var returnMesh = this.unitSquare
		(
			material
		).transform
		(
			new Transform_Scale(roomSizeMinusWallThickness)
		).transformFaceTextures
		(
			new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(5))
		)
		return returnMesh;
	}

	MeshBuilder.prototype.room_Wall = function(roomSize, doorSize, normal, material)
	{
		var down = new Coords(0, 0, 1);
		var tangent = normal.clone().crossProduct(down);
		var up = down.clone().invert().multiplyScalar(2);

		var returnMesh = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// wall
				tangent.clone().multiplyScalar(-1),
				tangent.clone().multiplyScalar(1),
				tangent.clone().multiplyScalar(1).add(up),
				tangent.clone().multiplyScalar(-1).add(up),
			],
			// vertexIndicesForFaces
			[
				new Mesh_FaceBuilder([3, 2, 1, 0]),
			]
		);

		returnMesh = new MeshTextured
		(
			returnMesh,
			[ material ],
			[
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(0, 1),
					]
				),
			]
		);

		var roomSizeMinusWallThickness = roomSize.clone().subtract
		(
			doorSize.clone().clearZ()
		);

		returnMesh.transform
		(
			new Transform_Translate(normal.clone())
		).transform
		(
			new Transform_Scale(roomSizeMinusWallThickness)
		).transformFaceTextures
		(
			new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(2))
		);

		return returnMesh;
	}

	MeshBuilder.prototype.room_WallWithDoorway = function(roomSize, doorSize, normal, material)
	{
		var down = new Coords(0, 0, 1);
		var tangent = normal.clone().crossProduct(down);
		var up = down.clone().invert().multiplyScalar(2);
		var upTwoThirds = up.clone().multiplyScalar(2/3);

		var wallWidth = 2;
		var wallWidthHalf = wallWidth / 2;
		var doorWidth = 2/3;
		var doorWidthHalf = doorWidth / 2;
		var wallMinusDoorWidthHalf = wallWidthHalf - doorWidthHalf;
		var wallMinusDoorWidthHalfReversed = 1 - wallMinusDoorWidthHalf;

		var meshGeometryForWall = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// left
				tangent.clone().multiplyScalar(-wallWidthHalf),
				tangent.clone().multiplyScalar(-doorWidthHalf),
				tangent.clone().multiplyScalar(-doorWidthHalf).add(up),
				tangent.clone().multiplyScalar(-wallWidthHalf).add(up),

				// right
				tangent.clone().multiplyScalar(doorWidthHalf),
				tangent.clone().multiplyScalar(wallWidthHalf),
				tangent.clone().multiplyScalar(wallWidthHalf).add(up),
				tangent.clone().multiplyScalar(doorWidthHalf).add(up),

				// top
				tangent.clone().multiplyScalar(-doorWidthHalf).add(upTwoThirds),
				tangent.clone().multiplyScalar(doorWidthHalf).add(upTwoThirds),
				tangent.clone().multiplyScalar(doorWidthHalf).add(up),
				tangent.clone().multiplyScalar(-doorWidthHalf).add(up),
			],
			// faceBuilders
			[
				new Mesh_FaceBuilder([3, 2, 1, 0]),
				new Mesh_FaceBuilder([7, 6, 5, 4]),
				new Mesh_FaceBuilder([11, 10, 9, 8]),
			]
		);

		var meshTexturedForWall = new MeshTextured
		(
			meshGeometryForWall,
			[ material ],
			[
				// left
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(wallMinusDoorWidthHalf, 0),
						new Coords(wallMinusDoorWidthHalf, 1),
						new Coords(0, 1),
					]
				),

				// right
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(wallMinusDoorWidthHalfReversed, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(wallMinusDoorWidthHalfReversed, 1),
					]
				),

				// top
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(wallMinusDoorWidthHalf, 0),
						new Coords(wallMinusDoorWidthHalfReversed, 0),
						new Coords(wallMinusDoorWidthHalfReversed, 1/3),
						new Coords(wallMinusDoorWidthHalf, 1/3),
					]
				),
			]
		);

		var roomSizeMinusWallThickness = roomSize.clone().subtract
		(
			doorSize.clone().clearZ()
		);

		meshTexturedForWall.transform
		(
			new Transform_Translate(normal.clone())
		).transform
		(
			new Transform_Scale(roomSizeMinusWallThickness)
		).transformFaceTextures
		(
			new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(2))
		);

		/*
		var threshold = normal.clone().multiply(doorSize).divide(roomSize);

		var meshGeometryForDoorframe = new Mesh
		(
			new Coords(0, 0, 0), // center
			// vertices
			[
				// bottom
				tangent.clone().multiplyScalar(-1/3),
				tangent.clone().multiplyScalar(1/3),
				tangent.clone().multiplyScalar(1/3).add(threshold),
				tangent.clone().multiplyScalar(-1/3).add(threshold),

				// left
				tangent.clone().multiplyScalar(-1/3),
				tangent.clone().multiplyScalar(-1/3).add(threshold),
				tangent.clone().multiplyScalar(-1/3).add(threshold).add(upTwoThirds),
				tangent.clone().multiplyScalar(-1/3).add(upTwoThirds),

				// right
				tangent.clone().multiplyScalar(1/3),
				tangent.clone().multiplyScalar(1/3).add(threshold),
				tangent.clone().multiplyScalar(1/3).add(threshold).add(upTwoThirds),
				tangent.clone().multiplyScalar(1/3).add(upTwoThirds),
			],
			// faces
			[
				new Mesh_FaceBuilder([3, 2, 1, 0]), // bottom
				new Mesh_FaceBuilder([7, 6, 5, 4]), // left
				new Mesh_FaceBuilder([11, 10, 9, 8]), // right

			]
		);

		var meshTexturedForDoorframe = new MeshTextured
		(
			meshGeometryForDoorframe,
			[ material ],
			[
				// bottom
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(0, 1),
					]
				),

				// left
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(0, 1),
					]
				),

				// right
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(0, 1),
					]
				),
			]
		);

		var returnMesh = this.mergeMeshes
		(
			[meshTexturedForWall, meshTexturedForDoorframe]
		);
		*/

		returnMesh = meshTexturedForWall;

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

		returnMesh = new MeshTextured(returnMesh, [ material ]);

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

		returnMesh = new MeshTextured(returnMesh, [ material ]);

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
			[ material ],
			[
				new MeshTexturedFaceTexture
				(
					material.name,
					[
						new Coords(0, 0),
						new Coords(1, 0),
						new Coords(1, 1),
						new Coords(0, 1),
					]
				)
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
		var faceTexturesMerged = [];
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

			var faceTextures = meshToMerge.faceTextures;
			if (faceTextures != null)
			{
				for (var f = 0; f < faceTextures.length; f++)
				{
					var faceTexture = faceTextures[f];
					var faceTextureCloned = faceTexture.clone();
					faceTexturesMerged.push(faceTextureCloned);
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

		var materialsMerged = [];
		for (var i = 0; i < meshesToMerge.length; i++)
		{
			var meshToMergeMaterials = meshesToMerge[i].materials;
			for (var m = 0; m < meshToMergeMaterials.length; m++)
			{
				var material = meshToMergeMaterials[m];
				var materialName = material.name;
				if (materialsMerged[materialName] == null)
				{
					materialsMerged.push(material);
					materialsMerged[materialName] = material;
				}
			}
		}

		returnMesh = new MeshTextured
		(
			returnMesh,
			materialsMerged,
			faceTexturesMerged,
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

			var distanceOfVertexAbovePlane = planeToDivideOn.distanceToPointAlongNormal
			(
				vertex
			);

			if (distanceOfVertexAbovePlane != 0)
			{
				break;
			}
		}

		var facesDividedIndex = (distanceOfVertexAbovePlane > 0 ? 0 : 1);

		var verticesInFaceDivided = verticesInFacesDivided[facesDividedIndex];

		var doAnyEdgesCollideWithPlaneSoFar = false;

		var collisionHelper = new CollisionHelper();

		var edges = faceToDivide.geometry.edges();
		for (var e = 0; e < edges.length; e++)
		{
			var edge = edges[e];
			var vertex0 = edge.vertices[0];

			verticesInFaceDivided.push
			(
				vertex0
			);

			var distanceOfVertex0AbovePlane = planeToDivideOn.distanceToPointAlongNormal
			(
				vertex0
			);

			var distanceOfVertex1AbovePlane = planeToDivideOn.distanceToPointAlongNormal
			(
				edge.vertices[1]
			);

			if (distanceOfVertex0AbovePlane * distanceOfVertex1AbovePlane < 0)
			{
				var collision = collisionHelper.collisionOfEdgeAndPlane
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
