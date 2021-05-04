
class SpacePartitioningTree
{
	nodeRoot: SpacePartitioningTreeNode;

	constructor(nodeRoot: SpacePartitioningTreeNode)
	{
		this.nodeRoot = nodeRoot;
	}

	static fromFaces(faces: FaceTextured[]): SpacePartitioningTree
	{
		var nodeRoot = new SpacePartitioningTreeNode(faces);
		var returnValue = new SpacePartitioningTree(nodeRoot);
		return returnValue;
	}
}
