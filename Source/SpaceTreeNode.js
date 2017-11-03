
function SpaceTreeNode(parent)
{
	this.parent = parent;
	this.children = null;
	this.items = [];
}

{
	// instance methods

	SpaceTreeNode.prototype.addItemWithBounds = function
	(
		tree,
		depth,
		pos,
		itemToAdd, 
		bounds,
		nodesItemAddedToSoFar
	)
	{
		this.items.push(itemToAdd);

		nodesItemAddedToSoFar.push(this);

		var depthNext = depth + 1;

		if (depthNext >= tree.depthMax)
		{
			return;
		}

		if (this.children == null)
		{
			this.createChildren
			(
				tree,
				depth	
			);
		}

		var childIndicesStartAndEnd = this.startAndEndIndicesForChildrenInBounds
		(
			tree,
			depth,
			pos, 
			bounds
		);

		var childIndicesStart = childIndicesStartAndEnd[0];
		var childIndicesEnd = childIndicesStartAndEnd[1];

		var childIndices = new Coords(0, 0, 0);
 
		for (var y = childIndicesStart.y; y <= childIndicesEnd.y; y++)	
		{
			childIndices.y = y;

			for (var x = childIndicesStart.x; x <= childIndicesEnd.x; x++)
			{
				childIndices.x = x;
	
				var child = this.childAtIndices(tree, childIndices);

				var posOfChild = pos.clone().add
				(
					childIndices.clone().multiply
					(
						tree.sizesAtDepths[depthNext]
					)
				);
	
				child.addItemWithBounds
				(
					tree,
					depthNext,
					posOfChild,
					itemToAdd, 
					bounds, 
					nodesItemAddedToSoFar
				);
			}
		}
	}

	SpaceTreeNode.prototype.addItemsInBoundsToList = function
	(
		tree,
		depth,
		pos, 
		bounds,
		listToAddTo
	)
	{	
		var leafNodes = [];

		this.addLeafNodesInBoundsToList(tree, depth, pos, bounds, leafNodes);

		for (var i = 0; i < leafNodes.length; i++)
		{
			var leafNodeItems = leafNodes[i].items;

			for (var j = 0; j < leafNodeItems.length; j++)
			{
				var leafNodeItem = leafNodeItems[j];
				var itemBounds = leafNodeItem.collidableData.bounds;

				if (Bounds.doBoundsOverlap(bounds, itemBounds) == true)
				{
					listToAddTo.push(leafNodeItem);
				}
			}
		}
	}

	SpaceTreeNode.prototype.addLeafNodesInBoundsToList = function
	(
		tree,
		depth,
		pos,
		bounds,
		listToAddTo
	)
	{
		if (this.children == null)
		{
			listToAddTo.push(this);
		}
		else
		{
			var depthNext = depth + 1;

			var childIndicesStartAndEnd = this.startAndEndIndicesForChildrenInBounds
			(
				tree,
				depth,
				pos, 
				bounds
			);

			var childIndicesStart = childIndicesStartAndEnd[0];
			var childIndicesEnd = childIndicesStartAndEnd[1];

			var childIndices = new Coords(0, 0, 0);
 
			for (var y = childIndicesStart.y; y <= childIndicesEnd.y; y++)	
			{
				childIndices.y = y;

				for (var x = childIndicesStart.x; x <= childIndicesEnd.x; x++)
				{
					childIndices.x = x;
		
					var child = this.childAtIndices(tree, childIndices);
		
					child.addLeafNodesInBoundsToList
					(
						tree,
						depthNext,
						pos.clone().add
						(
							childIndices.clone().multiply
							(
								tree.sizesAtDepths[depthNext]
							)
						),
						bounds,
						listToAddTo
					)
				}
			}			
		}
	}

	SpaceTreeNode.prototype.addLeafDescendantsToList = function(listToAddTo)
	{
		if (this.children == null)
		{
			listToAddTo.add(this);
		}
		else
		{
			for (var c = 0; c < this.children.length; c++)
			{
				this.children[c].addLeafDescendantsToList(listToAddTo);
			}
		}
	}

	SpaceTreeNode.prototype.childAtIndices = function(tree, childIndices)
	{
		return this.children[this.childIndicesFlatten(tree, childIndices)];
	}

	SpaceTreeNode.prototype.childAtIndices_Set = function
	(
		tree, 
		childIndices, 
		valueToSet
	)
	{
		this.children[this.childIndicesFlatten(tree, childIndices)] = valueToSet;
	}

	SpaceTreeNode.prototype.childIndicesFlatten = function(tree, childIndices)
	{
		return childIndices.y * tree.nodeSizeInChildren.x + childIndices.x;
	}

	SpaceTreeNode.prototype.createChildren = function(tree, depth)
	{
		if (depth < tree.depthMax)
		{
			this.children = [];

			var childIndices = new Coords(0, 0, 0);

			var nodeSizeInChildren = tree.nodeSizeInChildren;

			for (var y = 0; y < nodeSizeInChildren.y; y++)
			{
				childIndices.y = y;

				for (var x = 0; x < nodeSizeInChildren.x; x++)
				{				
					childIndices.x = x;

					var childNew = tree.nodeAllocate
					(
						this
					);

					this.childAtIndices_Set
					(
						tree,
						childIndices,
						childNew
					);
				}
			}
		}
	}

	SpaceTreeNode.prototype.neighborAtOffsetIndices = function(neighborOffsetIndices)
	{
		var returnValue;

		if (this.parent == null)
		{
			returnValue = this;
		}
		else
		{
			var neighborIndices = this.indicesWithinParent.add(neighborOffsetIndices);
			var neighborIndicesWrapped = neighborIndices.clone().wrapToRangeInPlace
			(
				this.parent.sizeInChildren
			);

			if (neighborIndicesWrapped.equals(neighborIndices) == true)
			{
				returnValue = this.parent.getChildAtIndices(neighborIndices);
			}
			else
			{
				var parentNeighbor = this.parent.getNeighborAtOffsetIndices
				(
					neighborOffsetIndices
				);

				if (parentNeighbor.children == null)
				{
					parentNeighbor.createChildren();
				}

				returnValue = parentNeighbor.getChildAtIndices
				(
					neighborIndicesWrapped
				);
			}
		}

		return returnValue;
	}

	SpaceTreeNode.prototype.startAndEndIndicesForChildrenInBounds = function
	(
		tree, 
		depth, 
		pos, 
		bounds
	)
	{
		var sizeInChildrenMinusOnes = tree.nodeSizeInChildrenMinusOnes;
		var sizeOfChildren = tree.sizesAtDepths[depth + 1];

		var returnValues = [];
		var boundsMinAndMax = bounds.minAndMax();

		for (var i = 0; i < boundsMinAndMax.length; i++)
		{
			var boundsExtreme = boundsMinAndMax[i];

			var value = boundsExtreme.clone().subtract
			(
				pos
			).divide
			(
				sizeOfChildren
			).floor().trimToRange
			(
				sizeInChildrenMinusOnes
			);

			returnValues.push(value);
		}

		return returnValues;
	}
}
