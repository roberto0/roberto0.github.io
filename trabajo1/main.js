var axis = function(scene) {
    // dibuja los ejes cartesianos
    var axis = new THREE.Geometry();
    axis.vertices.push(new THREE.Vector3(600, 0, 0));
    axis.vertices.push(new THREE.Vector3(0, 0, 0));
    axis.vertices.push(new THREE.Vector3(0, 0, 600));
    axis.vertices.push(axis.vertices[1]);
    axis.vertices.push(new THREE.Vector3(0, 600, 0));
    scene.add(new THREE.Line(axis, new THREE.LineBasicMaterial({color: 0})));
};

var ground = function(scene) {
    // dibuja un cuadrado en el suelo
    var groundMaterial = new THREE.MeshBasicMaterial({color: 0x444444});
    var ground = new THREE.Geometry();
    // cuatro vértices para el suelo
    ground.vertices.push(new THREE.Vector3(600, 0, 600));
    ground.vertices.push(new THREE.Vector3(-600, 0, 600));
    ground.vertices.push(new THREE.Vector3(-600, 0, -600));
    ground.vertices.push(new THREE.Vector3(600, 0, -600));
    // vector normal para ambas caras
    var normal = new THREE.Vector3(0, 1, 0);
    // dos caras triangulares
    ground.faces.push(new THREE.Face3(2, 1, 0, normal));
    ground.faces.push(new THREE.Face3(3, 2, 0, normal));
    var groundMesh = new THREE.Mesh(ground, groundMaterial);
    scene.add(groundMesh);
};

// la función matemática ingresada está disponible en la variable targetFunction
// si targetFunction es null, todavía no se ha ingresado ninguna fórmula válida

var dominio = 10; // +- el dominio de la funcion
var salto=.5;//1;
var amplificar = 600/dominio;//120;
var ajuste = 9.5;


var draw = function(scene) {
    // dirección +Y direction es hacia arriba
    ground(scene);
    axis(scene);

    //pregunta1(targetFunction); y pregunta3 
    var po =targetFunction;
	var teemo=0, min=0, max=0, garen=0;

    //defino el material base e inicio las variables
    var olaMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, side:THREE.DoubleSide});
    var ola = new THREE.Geometry();


    //recorre todo el plano y saca los minimos y maximos locales
    for(var i = -dominio; i < dominio+salto; i=i+salto)
    	for(var j = -dominio; j < dominio+salto; j=j+salto){
    		teemo = po(i,j);
    		if (min > teemo ) min = teemo;
    		if (max < teemo ) max = teemo;
    		ola.vertices.push(new THREE.Vector3(i, teemo, j));
    	}
	ola.vertices.push(new THREE.Vector3(dominio, po(dominio,dominio), dominio)); //agrega el ultimo

    var vs = ola.vertices; //acorta la variable
	var w = 2*(dominio+salto/2)/salto; //define el ultimo de la fila
	var m = ola.vertices.length; //largo del arreglo de vertices original
	var avg = max-min;
    garen = avg/600; //amplifica la funcion
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    var point, color, face,numberOfSides,vertexIndex;

	//recorre todo el arreglo de vertices y los amplifica para que utilicen todo el plano
	for (var i = 0; i <= ola.vertices.length - w+2*dominio/salto; i++){

        point = ola.vertices[i];
        color = new THREE.Color(0x0000ff);
        color.setHSL(0.7 *(max - point.z) / avg,1,0.5);
        ola.colors[i] = color;
       
    

		//si sobrepasa el recorrido maximo de 600 ajusta la funcion al espacio disponible
		//de esta forma se ve mejor en el grafico
		if(max>(600/amplificar))
			vs[i].y=(vs[i].y-min)/garen;
		else
			vs[i].y=vs[i].y*amplificar+amplificar-1; // lo sube un poco para que este sobre el plano 		  		
    	vs[i].z=vs[i].z*amplificar;
    	vs[i].x=vs[i].x*amplificar;

	}



	//recorre el arreglo de vertices y crea los triangulos
    for (var i = 0; i < m - w - 1; i++){
        if (i % w !== 0) {
        	//var color = getColor(vs[i + w-1], vs[i], vs[i + w ],max,min);

        	//average saca el promedio de alturas Y y compara con el centro del triangulo
        	//si la diferencia es mayor que ajuste*amplificador hace triangulos mas pequeños.
        	//
        	//aqui existen algunos problemas cuando quedan junto los triangulos mas pequeños con
        	//los de mayor tamaño, se logra apreciar una pequeña diferencia de alturas dejando
        	//espacios si rellenar en la malla. es posible solucionarlo haciendo completamente 
        	//con triangulos del mismo tamaño o disminuyento todos los tringulos para que no se pueda 
        	//apreciar a simple vista.
        	if(average(vs[i -1], vs[i], vs[i + w - 1 ],vs[i + w])==true){
        		
	            //primera mitad 
	            var p1 = new THREE.Vector3((vs[i-1].x+salto*amplificar/2), po(vs[i-1].x/amplificar+salto/2,vs[i-1].z/amplificar),vs[i-1].z);
	            var p2 = new THREE.Vector3(vs[i-1].x+salto*amplificar/2, po(vs[i-1].x/amplificar+salto/2,vs[i-1].z/amplificar+salto/2),vs[i-1].z+salto*amplificar/2);
	            var p3 = new THREE.Vector3(vs[i-1].x+salto*amplificar,po(vs[i-1].x/amplificar+salto,vs[i-1].z/amplificar+salto/2),vs[i-1].z+salto*amplificar/2);
	            ola.vertices.push(p1);
	            ola.vertices.push(p2);
	            ola.vertices.push(p3);

				//amplifica a los nuevos para que se vean del mismo tamaño que los anteriores
				if(max>(600/amplificar)){
					ola.vertices[ola.vertices.length-1].y=(ola.vertices[ola.vertices.length-1].y-min)/garen;
					ola.vertices[ola.vertices.length-2].y=(ola.vertices[ola.vertices.length-2].y-min)/garen;
					ola.vertices[ola.vertices.length-3].y=(ola.vertices[ola.vertices.length-3].y-min)/garen;
				}
				else{
					ola.vertices[ola.vertices.length-1].y=ola.vertices[ola.vertices.length-1].y*amplificar+amplificar-1;
					ola.vertices[ola.vertices.length-2].y=ola.vertices[ola.vertices.length-2].y*amplificar+amplificar-1;
					ola.vertices[ola.vertices.length-3].y=ola.vertices[ola.vertices.length-3].y*amplificar+amplificar-1; 		  		
				}

	            var normal1 = lib.normal(vs[i-1], vs[ola.vertices.length-3], vs[ola.vertices.length-2]);
	            var normal2 = lib.normal(vs[ola.vertices.length-3], vs[ola.vertices.length-2], vs[ola.vertices.length-1]);
	            var normal3 = lib.normal(vs[ola.vertices.length-3], vs[ola.vertices.length-1], vs[i]);
	            var normal4 = lib.normal(vs[ola.vertices.length-2], vs[i+w], vs[ola.vertices.length-3]);
	            ola.faces.push(new THREE.Face3(i - 1, ola.vertices.length-3, ola.vertices.length-2, normal1));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-3, ola.vertices.length-2, ola.vertices.length-1, normal2,new THREE.Color( 0xffaa00 ),2));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-3, ola.vertices.length-1, i+w-1, normal3));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-1, i+w, ola.vertices.length-2, normal4));//*/

	            //segunda mitad
	            var p4 = new THREE.Vector3(vs[i].x+salto*amplificar/2, po(vs[i].x/amplificar+salto/2,vs[i].z/amplificar),vs[i].z);
	            var p5 = new THREE.Vector3(vs[i].x, po(vs[i].x/amplificar,vs[i].z/amplificar-salto/2),vs[i].z-salto*amplificar/2);
	            ola.vertices.push(p4);
	            ola.vertices.push(p5);

	            //amplifica a los nuevos
				if(max>(600/amplificar)){
					ola.vertices[ola.vertices.length-1].y=(ola.vertices[ola.vertices.length-1].y-min)/garen;
					ola.vertices[ola.vertices.length-2].y=(ola.vertices[ola.vertices.length-2].y-min)/garen;
				}
				else{
					ola.vertices[ola.vertices.length-1].y=ola.vertices[ola.vertices.length-1].y*amplificar+amplificar-1;
					ola.vertices[ola.vertices.length-2].y=ola.vertices[ola.vertices.length-2].y*amplificar+amplificar-1;	  		
				}

	            var normal5 = lib.normal(vs[i-1], vs[ola.vertices.length-2], vs[ola.vertices.length-4]);
	            var normal6 = lib.normal(vs[ola.vertices.length-1], vs[ola.vertices.length-2], vs[ola.vertices.length-4]);
	            var normal7 = lib.normal(vs[ola.vertices.length-2], vs[ola.vertices.length-4], vs[i+w]);
	            var normal5 = lib.normal(vs[ola.vertices.length-1], vs[i-1], vs[ola.vertices.length-4]);
	            ola.faces.push(new THREE.Face3(i, ola.vertices.length-1, ola.vertices.length-2, normal5));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-1, ola.vertices.length-2, ola.vertices.length-4, normal6));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-2 , ola.vertices.length-4, i+w, normal7));
	            ola.faces.push(new THREE.Face3(ola.vertices.length-1, i-1, ola.vertices.length-4, normal7));//*/
	            ola.materialIndex = 1;
        	}
        	//el caso de que la diferencia de alturas sea menor que ajuste*amplicador dibuja los triangulos del tamaño normal
        	else{
	            var normal1 = lib.normal(vs[i + w-1], vs[i - 1], vs[i]);            
	            ola.faces.push(new THREE.Face3(i, i-1, i + w ,normal1));

	            var normal2 = lib.normal(vs[i - 1], vs[i + w -1], vs[i + w]);          
	            ola.faces.push(new THREE.Face3(i - 1, i + w - 1, i+w, normal2));        		
        	}
        }
    }   

    /* DALE COLOR WACHOOOO*/
    function DaleColor(punto){
        var intensity = 0;
        
        if(punto >= 600){
          intensity = 0;  
        } 
        if (punto <= 600 ) intensity =2/3;
        intensity = Math.abs((punto*2/3)/600);
        return intensity; 
    }

    for (var i = 0; i <= ola.vertices.length - w+2*dominio/salto; i++){
        point = ola.vertices[i];
        color = new THREE.Color(0x0000ff);
        //color.setHSL(0.7 *(max - point.z) / avg,1,0.5);
        var intensity = DaleColor(point.y);
        color.setHSL(intensity,1,0.5);
        ola.colors[i] = color;
    }
    
    for ( var i = 0; i < ola.faces.length; i++ ) {
        face = ola.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ ) 
        {
            vertexIndex = face[ faceIndices[ j ] ];
            face.vertexColors[ j ] = ola.colors[ vertexIndex ];

        }
    }

    
    var olaMesh = new THREE.Mesh(ola, olaMaterial);
    console.log(ola.faces.length);
    scene.add(olaMesh);





    //esto ya no se utilizara mas
    // cubo
    /*var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xAA0000});
    var cube = new THREE.CubeGeometry(200, 200, 200);
    var cubeMesh = new THREE.Mesh(cube, cubeMaterial);
    cubeMesh.position.x = 0;
    cubeMesh.position.z = 0;
    cubeMesh.position.y = 100;
    scene.add(cubeMesh);*/

};



var getColor = function(vs1,vs2,vs3,max,min) {
	//asd
	var promedio = (vs1.y+vs2.y+vs3.y)/3;
	var color = (promedio-min*amplificar)/((max-min)*amplificar);//promedio*255/(max*min*amplificar);//((max*amplificar-255)/(min*amplificar))*promedio+255;
	var c = lib.hsvToRgb(color,255,0);
	console.log(color);
	return c;
};

//el criterio depende de la variable ajuste, de la cual dependendiendo del numero encuentra la similituda 
//en las alturas.
//este metodo devuelve verdadero si la diferencia de alturas en menor que ajuste*amplificador falso si no
//para esto obtiene los promedios de alturas tanto en verticar como en horizontal para comparar con la
//altura real en el centro del cuadrado.
//toma la altura real en el centro del cuadrado y las compara con las alturas promediadas que se encuntran 
//en los centros de las aristas laterales y luego la superior e inferior
/*			p3
	v1	*---*---* v2
		|		|
    p2->*	*pm	*<- p1
		|		|
	v3	*---*---* v4
			p4
*/
//tambien existe la posibilidad de comprar segun los angulos de las caras, esto funcionan mejor en funciones
//seno coseno ya que en esta no poseen tantas diferencia de alturas si no cancavidad
var average = function(vs1,vs2,vs3,vs4){
	//en vertical
	var p1 = (vs1.y+vs2.y)/2;
	var p2 = (vs3.y+vs4.y)/2;
	var ptv = (p1+p2)/2;
	var pm = targetFunction(vs1.x/amplificar+salto/2,vs1.z/amplificar+salto/2)*amplificar;
	if (Math.abs(pm - ptv)>ajuste*amplificar)
		return true;
	//en horizontal
	var p3 = (vs1.y+vs3.y)/2;
	var p4 = (vs2.y+vs4.y)/2;
	var pth = (p3+p4)/2;
	if (Math.abs(pm - pth)>ajuste*amplificar)
		return true;
	else
		return false
};
