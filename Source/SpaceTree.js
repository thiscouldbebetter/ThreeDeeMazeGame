
function SpaceTree
(
	name,
	size,
	nodeSizeInChildren,
	depthMax
)
{
	this.name = name;
	this.size = size;
	this.nodeSizeInChildren = nodeSizeInChildren;
	this.depthMax = depthMax;

	this.nodeSizeInChildrenMinusOnes = this.nodeSizeInChildren.clone().subtract
	(
		Coords.Instances.Ones
	);

	this.sizesAtDepths = [];
	var sizeOfDescendantsAtDepth = this.size.clone();

	for (var i = 0; i < this.depthMax; i++)
	{
		this.sizesAtDepths.push
		(
			sizeOfDescendantsAtDepth.clone()
		);
		sizeOfDescendantsAtDepth.divide
		(
			this.nodeSizeInChildren
		);
	}

	this.nodeRoot = new SpaceTreeNode(null);

	this.nodesFree = [];
	this.maxNodesToSaveForReuse = 1024;
}

{
	SpaceTree.prototype.addItemWithBounds = function
	(
		item, 
		bounds,
		nodesItemAddedToSoFar
	)
	{
		var pos = new Coords(0, 0, 0);

		this.nodeRoot.addItemWithBounds
		(
			this, // tree
			0, // depth
			pos, // pos
			item, 
			bounds, 
			nodesItemAddedToSoFar
		);
	}

	SpaceTree.prototype.addItemsInBoundsToList = function
	(
		bounds,
		listToAddTo
	)
	{	
		this.nodeRoot.addItemsInBoundsToList
		(
			this, // tree
			0, // depth
			new Coords(0, 0, 0), // pos
			bounds, 
			listToAddTo
		);
	}

	SpaceTree.prototype.nodeAllocate = function(parent)
	{
		if (this.nodesFree.length == 0)
		{
			this.nodesFree.push(new SpaceTreeNode(parent));
		}	
		
		var nodeToAllocate = this.nodesFree[0];

		nodeToAllocate.parent = parent;
		nodeToAllocate.children = null;
		nodeToAllocate.items.length = 0;

		this.nodesFree.splice(0, 1);

		return nodeToAllocate;
	}

	SpaceTree.prototype.nodeDeallocateIfEmpty = function(nodeToDeallocate)
	{
		var nodeCurrent = nodeToDeallocate;
		while (nodeCurrent != null)
		{
			var nodeNext = nodeCurrent.parent;

			if (nodeCurrent.items.length == 0)
			{
				if (this.nodesFree.length < this.maxNodesToSaveForReuse)
				{
					// Save it for later reuse.
					this.nodesFree.push(nodeCurrent);
				}
				else
				{
					// Plenty are already available, 
					// so just discard this one.
	
					nodeCurrent.parent = null;
					nodeCurrent.children = null;
					nodeCurrent.items = null;
				}
			}
			else
			{
				break;
			}

			nodeCurrent = nodeNext;
		}
	}


	SpaceTree.prototype.removeItemFromNodes = function
	(
		itemToRemove, 
		listOfNodesToRemoveFrom
	)
	{
		for (var i = 0; i < listOfNodesToRemoveFrom.length; i++)
		{
			var node = listOfNodesToRemoveFrom[i];
			var nodeItems = node.items;
			nodeItems.splice(nodeItems.indexOf(itemToRemove), 1);
			this.nodeDeallocateIfEmpty(node);
		}

		listOfNodesToRemoveFrom.length = 0;
	}

}
