function ClienteWS(){
    this.socket;

    //enviar peticiones
    this.conectar = function(){ //Peticion de conexion
        this.socket=io();
        this.servidorWS(); //En el momento que mando la peticion de conexion, me pongo a escuchar
    }

    this.crearPartida = function(){ //Esto lo enviara al servidorWS, que lo recoge en un bloque "socket.on"
        this.socket.emit("crearPartida",rest.nick); //Emit para enviar peticiones+una cadena y el atributo
    }

    this.unirseAPartida = function(codigo){
        this.socket.emit("unirseAPartida",rest.nick,codigo);
    }
    this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick,cws.codigo);
	}

    this.colocarBarco=function(nombre,x,y){
        this.socket.emit("colocarBarco",rest.nick,nombre,x,y)
    }
    this.barcosDesplegados=function(){
        this.socket.emit("barcosDesplegados",rest.nick)
    }
    this.disparar=function(x,y){
        this.socket.emit("disparar",rest.nick,x,y)
    }


    //gestionar peticiones

    this.servidorWS=function(){
        let cli=this; //Esto lo hacemos por js para no confundir el this con tantos callbacks

        this.socket.on("partidaCreada",function(data){
            console.log(data);
            if(data.codigo!=-1){
                console.log("Partida creada por "+rest.nick + " con codigo "+ data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;
				
            }
            else{
                console.log("No se ha podido crear la partida");
                iu.mostrarModal("No se ha podido crear partida");
				iu.mostrarCrearPartida();
                rest.comprobarUsuario();
            }

        });

        this.socket.on("unidoAPartida",function(data){
            if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;	
			}
			else{
				console.log("No se ha podido unir a partida")
				
			}
        });

        this.socket.on("actualizarListaPartidas",function(lista){
			if (!cli.codigo){
				iu.mostrarListaDePartidas(lista);
			}
		});

        this.socket.on("partidaAbandonada",function(data){
			if (data.codigo!=-1){
                console.log(data.nombreA+" ha abandonado la partida con codigo: "+data.codigoP+"\n"+" Ha ganado "+data.nombreG)
				iu.mostrarHome();
                iu.mostrarModal(data.nombreA+" ha abandonado la partida con codigo: "+data.codigoP+"\n"+" Ha ganado "+data.nombreG);
			}
            else{
                console.log("No se ha podido abandonar la partida");
                iu.mostrarModal(data.nombreA+" ha intentado abandonar la partida pero no ha podido"); 
            }
		});
        
        this.socket.on("aJugar",function(){
			iu.mostrarModal("A jugaaar!");
		})

        this.socket.on("barcoColocado",function(data){
            iu.mostrarModal("El barco: "+ data.barco + " se ha colocado")
        })

        this.socket.on("disparo",function(data){
            iu.mostrarModal("El jugador: "+data.jugador + " ha disparado en la posicion "+ data.disparoX+ " " +data.disparoY)
        })


    }


}