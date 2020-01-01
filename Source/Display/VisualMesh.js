function VisualMesh()
{
	// todo
}
{
	VisualMesh.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var entityCollidable = entity.Collidable;
		if (entityCollidable != null)
		{
			var entityMesh = entity.Collidable.collider;
			display.drawMeshWithOrientation(entityMesh, entity.Locatable.loc.orientation);
		}
	};
}
