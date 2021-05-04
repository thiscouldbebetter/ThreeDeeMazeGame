"use strict";
class SpacePartitioningTreeNode {
    constructor(faces) {
        var faceToDivideOn = faces[0];
        this.faces = [faceToDivideOn];
        var planeToDivideOn = faceToDivideOn.geometry.plane();
        if (faces.length == 1) {
            this.children = null;
        }
        else {
            var faceSetsFrontAndBack = [
                new Array(),
                new Array()
            ];
            for (var f = 1; f < faces.length; f++) {
                var faceOther = faces[f];
                var faceOtherGeometry = faceOther.geometry;
                var planeOther = faceOtherGeometry.plane();
                if (planeOther.equals(planeToDivideOn) == true) {
                    this.faces.push(faceOther);
                }
                else {
                    var meshBuilder = new MeshBuilder();
                    var facesDividedFrontAndBack = meshBuilder.splitFaceByPlaneFrontAndBack(faceOther, planeToDivideOn);
                    for (var i = 0; i < facesDividedFrontAndBack.length; i++) {
                        var facePart = facesDividedFrontAndBack[i];
                        if (facePart != null) {
                            var facesForChildNode = faceSetsFrontAndBack[i];
                            facesForChildNode.push(facePart);
                        }
                    }
                }
            }
            this.children = [];
            for (var i = 0; i < faceSetsFrontAndBack.length; i++) {
                var faceSet = faceSetsFrontAndBack[i];
                var childNode = null;
                if (faceSet.length > 0) {
                    childNode = new SpacePartitioningTreeNode(faceSet);
                }
                this.children[i] = childNode;
            }
        }
    }
    addFacesBackToFrontForCameraPosToList(cameraPos, facesToAddTo) {
        if (this.children == null) {
            for (var i = 0; i < this.faces.length; i++) {
                facesToAddTo.push(this.faces[i]);
            }
        }
        else {
            var distanceOfCameraAbovePlane = this.faces[0].geometry.plane().distanceToPointAlongNormal(cameraPos);
            var childIndexFirst = (distanceOfCameraAbovePlane > 0 ? 1 : 0);
            var nodeChild = this.children[childIndexFirst];
            if (nodeChild != null) {
                nodeChild.addFacesBackToFrontForCameraPosToList(cameraPos, facesToAddTo);
            }
            for (var f = 0; f < this.faces.length; f++) {
                facesToAddTo.push(this.faces[f]);
            }
            var nodeChild = this.children[1 - childIndexFirst];
            if (nodeChild != null) {
                nodeChild.addFacesBackToFrontForCameraPosToList(cameraPos, facesToAddTo);
            }
        }
    }
}
