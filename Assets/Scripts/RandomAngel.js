public var target : Vector3;
public var translation : Vector3 = Vector3(1,1,1);
public var direction : Vector3 = Vector3(1,1,1);
public var rangeX : float = 25;
public var rangeY : float = 25;
public var rangeZ : float = 25;
public var speed : float = 0.2;
public var startPosition : Vector3 = Vector3(-9.6,28,-0.3);

function Start () 
{
	target.x = startPosition.x + Random.Range(-rangeX,rangeX);
	target.y = startPosition.y + Random.Range(-rangeY,rangeY);
	target.z = startPosition.z + Random.Range(-rangeZ,rangeZ);
	Debug.Log("x = " + translation.x + " - y = " + translation.y + " - z =  " + translation.z);
}

function Update () 
{
	transform.position = Vector3.MoveTowards(transform.position,target,speed);
	var distanceCurrent = (transform.position - target).magnitude;
	if(distanceCurrent < 5)
	{
		target.x = startPosition.x + Random.Range(-rangeX,rangeX);
		target.y = startPosition.y + Random.Range(-rangeY,rangeY);
		target.z = startPosition.z + Random.Range(-rangeZ,rangeZ);
	}
}