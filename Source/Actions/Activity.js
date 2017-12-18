
function Activity(defn, parameters)
{
	this.defn = defn;
	this.parameters = parameters;
}

{
	Activity.prototype.perform = function(universe, world, entity)
	{
		this.defn.perform(universe, world, entity, this);
	}
}
