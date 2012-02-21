public var radius = 3.0;
public var pull = 10.0;
private var unappliedMesh : MeshFilter;

public enum FallOff { Gauss, Linear, Needle }
var fallOff = FallOff.Gauss;

static function LinearFalloff (distance : float , inRadius : float) {
	return Mathf.Clamp01(1.0 - distance / inRadius);
}

static function GaussFalloff (distance : float , inRadius : float) {
	return Mathf.Clamp01 (Mathf.Pow (360.0, -Mathf.Pow (distance / inRadius, 2.5) - 0.01));
}

function NeedleFalloff (dist : float, inRadius : float)
{
	return -(dist*dist) / (inRadius * inRadius) + 1.0;
}

function DeformMesh (mesh : Mesh, position : Vector3, power : float, inRadius : float)
{
	var vertices = mesh.vertices;
	var normals = mesh.normals;
	var sqrRadius = inRadius * inRadius;
	// Calculate averaged normal of all surrounding vertices	
	var averageNormal = Vector3.zero;
	for (var i=0;i<vertices.length;i++)
	{
		var sqrMagnitude = (vertices[i] - position).sqrMagnitude;//sqrMagnitude is faster than sqrroot
		// Early out if too far away
		if (sqrMagnitude > sqrRadius)
			continue;//only points within the area defined by the radius

		var distance = Mathf.Sqrt(sqrMagnitude); 
		var falloff = LinearFalloff(distance, inRadius); //weight the normal according the position in the area defined by the radius (closer to the edges -> less weight)
		//the final goal is to calculate the average of all normals of the points affected in the area defined by the radius
		averageNormal += falloff * normals[i];
	}
	averageNormal = averageNormal.normalized;
	
	// Deform vertices along averaged normal
	for (i=0;i<vertices.length;i++)
	{
		sqrMagnitude = (vertices[i] - position).sqrMagnitude;
		// Early out if too far away
		if (sqrMagnitude > sqrRadius)
			continue;//again only if the point is within the area of interest

		distance = Mathf.Sqrt(sqrMagnitude);
		switch (fallOff) //falloff -> different shape of the extruded object when clicking with the mouse
		{
			case FallOff.Gauss:
				falloff = GaussFalloff(distance, inRadius);
				break;
			case FallOff.Needle:
				falloff = NeedleFalloff(distance, inRadius);
				break;
			default:
				falloff = LinearFalloff(distance, inRadius);
				break;
		}
		
		vertices[i] += averageNormal * falloff * power; //the final vertix position in the area of interest is changed according to the average normal, the weighted falloff
														//power is a constant (it describes the power of distortion)
	}
	
	mesh.vertices = vertices;
	mesh.RecalculateNormals();
	mesh.RecalculateBounds();
}

function Update () {

	// When no button is pressed we update the mesh collider
	if (!Input.GetMouseButton (0))
	{
		// Apply collision mesh when we let go of button
		ApplyMeshCollider();
		//Debug.Log("I'm here");
		return;
	}
	// Did we hit the surface?
	var hit : RaycastHit;
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast (ray, hit))
	{
		var filter : MeshFilter = hit.collider.GetComponent(MeshFilter);
		if (filter)
		{
			// Don't update mesh collider every frame since physX
			// does some heavy processing to optimize the collision mesh.
			// So this is not fast enough for real time updating every frame
			if (filter != unappliedMesh)
			{
				ApplyMeshCollider();
				unappliedMesh = filter;
			}
			
			// Deform mesh
			var relativePoint = filter.transform.InverseTransformPoint(hit.point);
			DeformMesh(filter.mesh, relativePoint, pull * Time.deltaTime, radius);
		}
	}
}

function ApplyMeshCollider () {
	if (unappliedMesh && unappliedMesh.GetComponent(MeshCollider)) {
		unappliedMesh.GetComponent(MeshCollider).mesh = unappliedMesh.mesh;
	}
	unappliedMesh = null;
}