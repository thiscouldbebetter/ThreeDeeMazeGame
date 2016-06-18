
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

	Array.prototype.getPropertyValueForEachItem = function(propertyName)
	{
		var returnValues = [];

		for (var i = 0; i < this.length; i++)
		{
			returnValues.push(this[i][propertyName]);
		}

		return returnValues;
	}

	Array.prototype.prependElementsFrom = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			this.splice(0, 0, other[i]);
		}
	}

	Array.prototype.sortArrayIntoOtherUsingCompareFunction = function
	(
		arraySorted, 
		compareFunction
	)
	{
		for (var i = 0; i < this.length; i++)
		{
			var elementToSort = this[i];

			var j = 0;
			for (j = 0; j < arraySorted.length; j++)
			{
				var elementSorted = arraySorted[j];

				if (compareFunction(elementToSort, elementSorted) > 0)
				{
					break;
				}
			}

			arraySorted.splice(j, 0, elementToSort);
		}

		return arraySorted;
	}
}
