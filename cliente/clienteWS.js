function ClienteWS(){
    // zona de atributos
    this.socket;

    // enviar peticiones
    this.conectar = function(){
        this.socket = io();
        this.servidorWS();
    }
    
    this.crearPartida=function(nick){
		this.socket.emit("crearPartida",nick);
	}

    // gestionar peticiones
    this.servidorWS = function(){
        let cli = this;
        this.socket.on("partidaCreada", function(data){
            if (data.codigo != -1) {
                console.log("Usuario " + nick + " crea partida codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
            }
            else {
                console.log("No se ha podido crear partida")
            }
        });
    }
}