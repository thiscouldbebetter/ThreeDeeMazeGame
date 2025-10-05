
class Transform_Orient2 implements Transform<Transform_Orient2>
{
	// hack
	// This class exists because for some reason the player
	// was walking backwards when using Transform_Orient.

	orientation: Orientation;

	_components: Coords[];

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;

		this._components =
		[
			Coords.create(), Coords.create(), Coords.create()
		];
	}

	clone(): Transform_Orient2
	{
		return this;
	}

	overwriteWith(other: Transform_Orient2): Transform_Orient2
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		var components = this._components;
		var ori = this.orientation;

		coordsToTransform.overwriteWith
		(
			components[0].overwriteWith(ori.forward).multiplyScalar(0 - coordsToTransform.x).add
			(
				components[1].overwriteWith(ori.right).multiplyScalar(0 - coordsToTransform.y).add
				(
					components[2].overwriteWith(ori.down).multiplyScalar(coordsToTransform.z)
				)
			)
		);

		return coordsToTransform;
	}
}
