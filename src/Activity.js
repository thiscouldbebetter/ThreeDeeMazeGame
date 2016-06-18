
function Activity(defn, parameters)
{
	this.defn = defn;
	this.parameters = parameters;
}

{
	Activity.prototype.perform = function(world, entity)
	{
		this.defn.perform(world, entity, this);
	}
}
