
class SpacePartitioningTree
{
	constructor(nodeRoot)
	{
		this.nodeRoot = nodeRoot;
	}

	static fromFaces(faces)
	{
		var nodeRoot = new SpacePartitioningTreeNode(faces);
		var returnValue = new SpacePartitioningTree(nodeRoot);
		return returnValue;
	}
}
