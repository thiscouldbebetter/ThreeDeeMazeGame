
function SpacePartitioningTree(nodeRoot)
{
	this.nodeRoot = nodeRoot;
}

{
	SpacePartitioningTree.fromFaces = function(faces)
	{
		var nodeRoot = new SpacePartitioningTreeNode(faces);
		var returnValue = new SpacePartitioningTree(nodeRoot);
		return returnValue;
	}
}
