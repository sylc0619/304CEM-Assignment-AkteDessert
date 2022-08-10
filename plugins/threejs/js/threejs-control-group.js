var selectItem = getCookie("selectItem");

if (selectItem == "62e4c8c78da8261f0a749d2d") {

    var THREE;

    var scene3d = document.getElementById("productModel");

    var camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
    camera.position.x = 400;
    camera.position.y = 300;
    camera.position.z = 500;
    var renderer = null;
    var controls = null;
    var scene = null;

    var initRender = function (width, height) {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        // renderer.setSize( 400,400 ); 
        renderer.setSize(width, height);

        scene3d.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.minDistance = 400;
        controls.maxDistance = 650;
        controls.minPolarAngle = -5;
        controls.maxPolarAngle = 1.5;

        var light = new THREE.AmbientLight(0xDFDFDF, 1.2); // soft white light
        scene = new THREE.Scene();
        scene.add(light);

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('plugins/threejs/js/3dcake-a/');
        mtlLoader.setPath('plugins/threejs/js/3dcake-a/');
        mtlLoader.load('mesh.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('plugins/threejs/js/3dcake-a/');
            objLoader.load('mesh.obj', function (object) {

                scene.add(object);
                object.position.z = 0;
                object.position.x = 0;
                object.position.y = 0;
                object.scale.x = 2500;
                object.scale.y = 2500;
                object.scale.z = 2500;
                object.rotation.x = 0.15;
                object.rotation.z = 3.1416;
            });

        });

    };

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    console.log(scene3d)

    var aaa = setTimeout(function () {
        console.log($(".owl-item ")[0].offsetHeight)
        initRender($(".owl-item ")[0].offsetWidth - 20, $(".owl-item ")[0].offsetHeight - 20);
        animate();
    }, 3000)

} else if (selectItem == "d63338479d00526437c9c730") {

    var THREE;

    var scene3d = document.getElementById("productModel");

    var camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
    camera.position.x = 400;
    camera.position.y = 300;
    camera.position.z = 500;
    var renderer = null;
    var controls = null;
    var scene = null;
    var initRender = function (width, height) {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        // renderer.setSize( 400,400 ); 
        renderer.setSize(width, height);

        scene3d.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.minDistance = 400;
        controls.maxDistance = 650;
        controls.minPolarAngle = -5;
        controls.maxPolarAngle = 1.5;

        var light = new THREE.AmbientLight(0xDFDFDF, 1.65); // soft white light
        scene = new THREE.Scene();
        scene.add(light);

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('plugins/threejs/js/3dcake-b/');
        mtlLoader.setPath('plugins/threejs/js/3dcake-b/');
        mtlLoader.load('mesh.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('plugins/threejs/js/3dcake-b/');
            objLoader.load('mesh.obj', function (object) {

                scene.add(object);
                object.position.z = 0;
                object.position.x = 0;
                object.position.y = 0;
                object.scale.x = 3500;
                object.scale.y = 3500;
                object.scale.z = 3500;
                object.rotation.x = -0.065;
                object.rotation.z = 3;
            });

        });

    };

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    console.log(scene3d)

    var aaa = setTimeout(function () {
        console.log($(".owl-item ")[0].offsetHeight)
        initRender($(".owl-item ")[0].offsetWidth - 20, $(".owl-item ")[0].offsetHeight - 20);
        animate();
    }, 2000)

} else if (selectItem == "6fd6c47e8232e24e7d8df920") {

    var THREE;

    var scene3d = document.getElementById("productModel");

    var camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
    camera.position.x = 400;
    camera.position.y = 300;
    camera.position.z = 500;
    var renderer = null;
    var controls = null;
    var scene = null;
    var initRender = function (width, height) {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        // renderer.setSize( 400,400 ); 
        renderer.setSize(width, height);

        scene3d.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.minDistance = 400;
        controls.maxDistance = 650;
        controls.minPolarAngle = -5;
        controls.maxPolarAngle = 1.5;

        var light = new THREE.AmbientLight(0xDFDFDF, 1.5); // soft white light
        scene = new THREE.Scene();
        scene.add(light);

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('plugins/threejs/js/3dcake-c/');
        mtlLoader.setPath('plugins/threejs/js/3dcake-c/');
        mtlLoader.load('mesh.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('plugins/threejs/js/3dcake-c/');
            objLoader.load('mesh.obj', function (object) {

                scene.add(object);
                object.position.z = 0;
                object.position.x = 0;
                object.position.y = 0;
                object.scale.x = 3000;
                object.scale.y = 3000;
                object.scale.z = 3000;
                object.rotation.x = -0.03;
                object.rotation.z = 3.1416;
            });

        });

    };

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    console.log(scene3d)

    var aaa = setTimeout(function () {
        console.log($(".owl-item ")[0].offsetHeight)
        initRender($(".owl-item ")[0].offsetWidth - 20, $(".owl-item ")[0].offsetHeight - 20);
        animate();
    }, 2000)
}
