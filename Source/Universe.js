
function Universe(name, actions, inputToActionMappings, materials, entityDefns, worlds)
{
	this.name = name;
	this.actions = actions.addLookups("name");
	this.inputToActionMappings = inputToActionMappings.addLookups("inputName");
	this.materials = materials;
	this.entityDefns = entityDefns;
	this.worlds = worlds;

	this.worlds.addLookups("name");

	this.worldCurrent = this.worlds[0];
}

{
	// static methods

	Universe.buildRandom = function(mazeSizeInCells, mazeCellSizeInPixels, actions, inputToActionMappings)
	{
		var textures = Texture.Instances;

		var materials = 
		[
			new Material
			(
				"MaterialMover", 
				Color.Instances.Black, 
				Color.Instances.Gray,
				textures.TestPattern
			),
			new Material
			(
				"MaterialGoal", 
				Color.Instances.Blue, 
				Color.Instances.GrayLight,
				textures.Goal
			),
			new Material
			(
				"MaterialStart", 
				Color.Instances.Blue, 
				Color.Instances.GrayDark,
				textures.Start
			),
			new Material
			(
				"MaterialWall", 
				Color.Instances.Blue, 
				Color.Instances.Gray,
				textures.Wall
			),
		];

		materials.addLookups("name");

		var meshMover = MeshHelper.buildBiped
		(
			materials["MaterialMover"],
			6 // height
		);

		var entityDefnMover = new EntityDefn
		(
			"EntityDefnMover",
			true, // isDrawable
			true, // isMovable
			meshMover
		);

		var entityDefns = 
		[ 
			entityDefnMover,
		];

		entityDefns.addLookups("name");

		var world = World.buildRandom
		(
			materials, 
			entityDefns, 
			mazeSizeInCells,
			mazeCellSizeInPixels
		);

		var returnValue = new Universe
		(
			"Random Universe",
			actions,
			inputToActionMappings,
			materials,
			entityDefns,
			// worlds
			[
				world,
			]
		);

		return returnValue;
	}

	// instance methods

	Universe.prototype.initialize = function()
	{
		this.worldNext = this.worlds[0];
	}

	Universe.prototype.update = function()
	{
		if (this.worldNext != null)
		{
			if (this.worldCurrent != null)
			{
				this.worldCurrent.finalize();
			}

			this.worldCurrent = this.worldNext;
			this.worldCurrent.initialize(this);

			this.worldNext = null;
		}

		this.worldCurrent.update(this);
	}
}
