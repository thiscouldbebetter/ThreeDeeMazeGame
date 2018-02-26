
function Activity(defn, parameters)
{
	this.defn = defn;
	this.parameters = parameters;
}

{
	Activity.prototype.perform = function(universe, world, zone, entity)
	{
		this.defn.perform(universe, world, zone, entity, this);
	}
}
