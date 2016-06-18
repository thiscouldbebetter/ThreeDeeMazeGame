
function TreeHelper()
{}
{
	TreeHelper.addNodeAndAllDescendantsToList = function(node, listToAddTo)
	{
		listToAddTo.push(node);

		for (var i = 0; i < node.children.length; i++)
		{
			var nodeChild = node.children[i];
			TreeHelper.addNodeAndAllDescendantsToList
			(
				nodeChild, 
				listToAddTo
			);
		}

		return listToAddTo;
	}
}
