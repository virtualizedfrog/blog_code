var mouseX = 0, mouseY = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera, scene, renderer, solutions = [],
	
	particlecount = 20,
	xlowerbound = -2,
	xupperbound = 2,
	zlowerbound = -1,
	zupperbound = 3,
	xstep = 10,
	zstep = 10;

init();
animate();

function rosenbrock(x, y) {
	var a = 1 - x
	var b = y - x * x
	return (a * a + 100.0 * b * b) / 1000.0;
}

	var PI2 = Math.PI * 2;

	var solutionmaterial = new THREE.SpriteCanvasMaterial( {
		color: 0xff0000,
		program: function ( context ) {
			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();
		}
	} );
	
	var bestsolutionmaterial = new THREE.SpriteCanvasMaterial( {
		color: 0x00ff00,
		program: function ( context ) {
			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();
		}
	} );

function init() {
	var particle;
	
	renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth - 15, window.innerHeight - 15 );
    document.getElementById('container').appendChild(renderer.domElement);

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 5;
	scene.add( camera );

	// particles

	var material = new THREE.SpriteCanvasMaterial( {
		color: 0xffffff,
		program: function ( context ) {
			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();
		}
	} );

	var geometry = new THREE.Geometry();

	for ( var i = xlowerbound * xstep; i <= xupperbound * xstep; i++ ) {
		x = i / xstep;
		for ( var j = zlowerbound * zstep; j <= zupperbound * zstep; j++ ) {
			z = j / zstep;
			particle = new THREE.Sprite( material );
			particle.position.x = x;
			particle.position.z = z;
			particle.position.y = rosenbrock(x, z);
			particle.scale.x = particle.scale.y = 0.01;
			
			scene.add( particle );
		}
	}
	
	for ( var i = 0; i < particlecount; i++ ) {
		x = Math.random() * 4 - 2;
		z = Math.random() * 4 - 1;
		particle = new THREE.Sprite( solutionmaterial );
		particle.position.x = x;
		particle.position.z = z;
		particle.position.y = rosenbrock(x, z);
		particle.scale.x = particle.scale.y = 0.05;
		
		scene.add( particle );
		
		var solution = {particle:particle, score:particle.position.z, xspeed:0.001, zspeed:0.001};
		solutions.push( solution );
	}
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function animate() {
	render();
	requestAnimationFrame( animate );
	
	//find best index
	var bestindex = -1;
	for (var i = 0; i < particlecount; i++)
	{
		if (bestindex == -1 || solutions[i].particle.position.y < solutions[bestindex].particle.position.y) {
			bestindex = i;
		}
	}
	
	for (var i = 0; i < particlecount; i++)
	{
		if (i != bestindex)
		{
			xdist = solutions[bestindex].particle.position.x - solutions[i].particle.position.x;
			zdist = solutions[bestindex].particle.position.z - solutions[i].particle.position.z;
			solutions[i].xspeed = solutions[i].xspeed + Math.random() * xdist / 1000;
			solutions[i].zspeed = solutions[i].zspeed + Math.random() * zdist / 1000;
			solutions[i].particle.material = solutionmaterial;
		}
		else
		{
			solutions[i].particle.material = bestsolutionmaterial;
		}
		solutions[i].particle.position.x += solutions[i].xspeed;
		solutions[i].particle.position.z += solutions[i].zspeed;
		solutions[i].particle.position.y = rosenbrock(solutions[i].particle.position.x, solutions[i].particle.position.z);
		
		if (solutions[i].particle.position.x < xlowerbound)
			solutions[i].particle.position.x = xlowerbound;
		if (solutions[i].particle.position.x > xupperbound)
			solutions[i].particle.position.x = xupperbound;
		if (solutions[i].particle.position.z < zlowerbound)
			solutions[i].particle.position.z = zlowerbound;
		if (solutions[i].particle.position.z > zupperbound)
			solutions[i].particle.position.z = zupperbound;
	}
}

function render() {
	camera.position.x = mouseX / 100;
	camera.position.z = 4;
	camera.position.y = 4;
	camera.lookAt( scene.position );

	renderer.render( scene, camera );
}