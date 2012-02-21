public var radiusBend : float = -15;
private var meshes : Mesh;
private var vertices : Vector3[];
public var maxX : float = 4;
private var normals : Vector3[];
var center : Vector3;


function Start () {
        meshes = GetComponent(MeshFilter).mesh;
      
        vertices = meshes.vertices;
        //var maxX : float = Mathf.Abs(vertices[vertices.Length-1].x);	
//        Debug.Log("X = " + vertices[vertices.Length/2-1].x + " Y = " + vertices[vertices.Length/2-1].y + " Z = " + vertices[vertices.Length/2-1].z);
//        Debug.Log("max X = " + vertices[vertices.Length-1].x + " max Y = " + vertices[vertices.Length-1].y);
//        Debug.Log("min X = " + vertices[0].x + " min Y = " + vertices[0].y);
        for(var i = 0; i < vertices.Length; i++)
        {
        	vertices[i].y = radiusBend*(Mathf.Sin(Mathf.PI/2+Mathf.PI/2*Mathf.Abs(maxX - vertices[i].x/maxX)));
        }
        meshes.vertices = vertices;
//        AssetDatabase.CreateAsset(meshes, "/Users/federicozannier/Documents/ITPSpring2012/Pixels to Poligons/Week4/MovingOBJSwithFaceOSC/Assets/Resources/meshes/wallBent.asset");
//		AssetDatabase.SaveAssets();
}

function Update ()
{
//	meshes = GetComponent(MeshFilter).mesh;
//	vertices = meshes.vertices;
//	normals = meshes.normals;
//	center = transform.position;
//	for(var i = 0; i < vertices.Length; i++)
//	{
//	 	vertices[i] += normals[i];
//	}
//	meshes.vertices = vertices;
}
