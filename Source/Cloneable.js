
function Cloneable()
{}
{
	Cloneable.cloneMany = function(cloneablesToClone)
	{
		var returnValues = null;

		if (cloneablesToClone != null)
		{
			returnValues = [];

			for (var c = 0; c < cloneablesToClone.length; c++)
			{
				var clone = cloneablesToClone[c].clone();
				returnValues.push(clone);
			}
		}

		return returnValues;
	}

	Cloneable.overwriteManyWithOthers = function(cloneablesToBeOverwritten, cloneablesToOverwriteWith)
	{
		for (var i = 0; i < cloneablesToBeOverwritten.length; i++)
		{
			var cloneableToBeOverwritten = cloneablesToBeOverwritten[i];
			var cloneableToOverwriteWith = cloneablesToOverwriteWith[i];

			cloneableToBeOverwritten.overwriteWith
			(
				cloneableToOverwriteWith
			);
		}
	}
}
