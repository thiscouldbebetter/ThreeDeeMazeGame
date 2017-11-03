
// extensions

function ArrayExtensions()
{}
{
	Array.prototype.addLookups = function(propertyNameForKey)
	{
		for (var i = 0; i < this.length; i++)
		{
			var arrayItem = this[i];
			var key = arrayItem[propertyNameForKey];
			this[key] = arrayItem;
		}
	}

	Array.prototype.appendElementsFrom = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			this.push(other[i]);
		}
	}

	Array.prototype.clone = function()
	{
		var returnValue = [];

		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			var itemClone = item.clone();
			returnValue.push(itemClone);
		}	

		return returnValue;
	}

	Array.prototype.prepend = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			this.splice(0, 0, element);
		}
		return this;
	}
}
