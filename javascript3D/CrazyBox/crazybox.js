var controls, renderer, scene, camera;
var objects = [];
var g = 9.8;
var count = 500;

init();
animate();

function setup(i){
	o = objects[i];

	o.speed = 20 + Math.random() * 70;
	o.anglea = Math.random() * 90 * Math.PI / 180.0;
	o.angleb = Math.random() * 360 * Math.PI / 180.0;
	o.ticks = 0;
	o.sphere.position.x = 0;
	o.sphere.position.y = 0;
	o.sphere.position.z = 0;
	
	o.sx = o.speed * Math.cos(o.angleb);
	o.sy = o.speed * Math.sin(o.anglea);
	o.sz = o.speed * Math.sin(o.angleb);
}

function init(){
    renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth - 15, window.innerHeight - 15 );
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 0, 1500);
    scene.add(camera);
	
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener( 'change', render );
	
	box = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), new THREE.MeshNormalMaterial());
	box.position.x = 0;
	box.position.y = 0;
	box.position.z = 0;
	box.overdraw = true;
	scene.add(box);
	
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
	
	for (var i = 0; i < count; i++)
	{
		sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 10, 10), new THREE.MeshNormalMaterial());
		sphere.overdraw = true;
		
		var object = {sphere:sphere, anglea:0, angleb:0, ticks:0, speed:0, sx:0, sy:0, sz:0};
		
		objects.push(object);
		
		setup(i);
		
		scene.add(sphere);
	}
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}

function animate(){
	render();
	
	requestAnimationFrame( animate );
	
	for (var i = 0; i < count; i++)
	{
		o = objects[i]
	
		o.ticks++;
		t = o.ticks / 10.0;
		
		o.sphere.position.x = o.sx * t;
		o.sphere.position.y = -0.5 * g * t * t + o.sy * t;
		o.sphere.position.z = o.sz * t;
		
		if (o.sphere.position.y < -1000)
		{
			setup(i);
		}
	}
	
	box.rotation.x += 0.02 * 10;
	box.rotation.y += 0.0225 * 10;
	box.rotation.z += 0.0175 * 10;
	
	controls.update();
}

function render() {
	renderer.render(scene, camera);
}