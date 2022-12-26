function ControlWeb() {
	this.comprobarCookie = function () {
		if ($.cookie('nick')) {
			rest.nick = $.cookie('nick');
			rest.comprobarUsuario();
		} else {
			this.mostrarAgregarUsuario();
		}
	}

	this.mostrarAgregarUsuario = function () {
		let cadena = '<div class="text-center" id="mAU">';
		cadena = cadena + '<h1>Mar de Ladrones</h1>';
		cadena = cadena + '<div>'
		cadena = cadena + '<input type="text" id="usr" placeholder="Introduce tu nick" required>'
		cadena = cadena + '<button id="btnAU" class="bn632-hover bn19">Iniciar sesion</button>'
		cadena = cadena + '</div>'
		cadena = cadena + '<a href="/auth/google"><button class="bn632-hover bn19">Accede con Google'
		// SVG con el logo de Google
		cadena = cadena + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16"> <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/> </svg>'
		cadena = cadena + '</button></a>';
		cadena = cadena + '<div><a href="/auth/twitter"><button class="bn632-hover bn19">Accede con Twitter'
		// SVG con el logo de Twitter
		cadena = cadena + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16"> <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/> </svg>'
		cadena = cadena + '</button></a>'
		cadena = cadena + '</div>'

		$("#agregarUsuario").append(cadena);

		$("#btnAU").on("click", function (e) {
			if ($('#usr').val() === '' || $('#usr').val().length > 6) {
				e.preventDefault();
				iu.mostrarModal('Nick invalido');
			}
			else {
				let nick = $('#usr').val();
				$("#mAU").remove();
				rest.agregarUsuario(nick);
			}
		})
	}

	this.mostrarHome = function () {
		$('#mH').remove();
		$('#gc').remove();
		let cadena = "<div class ='row' id='mH'>";
		cadena = cadena + "<div class='col'>";
		cadena = cadena + "<h2>Bienvenido <b>" + rest.nick + "</b></h2>";
		cadena = cadena + "<div style='margin-bottom:15px' id='codigo'></div>"
		cadena = cadena + '<button id="btnBC" class="btn btn-primary mb-2 mr-sm-2">Salir</button>';
		cadena = cadena + "</div></div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerPartidas();

		$("#btnBC").on("click", function () {
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$('#gc').remove();
			$('#mAU').remove();
			rest.usuarioSale();
		})
	}

	this.mostrarCrearPartida = function () {
		$("#mCP").remove();
		let cadena = '<div id="mCP">';
		cadena = cadena + '<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
		cadena = cadena + '<div id="nota"></div>';
		cadena = cadena + '</div></div>';

		$("#crearPartida").append(cadena);

		$("#btnCP").on("click", function () {
			$("#mLP").remove();
			$("#mCP").remove();
			cws.crearPartida();
		})
	}

	this.mostrarCodigo = function (codigo) {
		let cadena = "Codigo de la partida: " + codigo;
		cadena = cadena + '<div style="margin-top:15px">';
		cadena = cadena + '<button id="btnAP" class="btn btn-primary mb-2 mr-sm-2">Abandonar partida</button>';
		cadena = cadena + '</div>';
		this.mostrarEsperarPartidaEncontrada();
		$("#codigo").append(cadena);

		$("#btnAP").on("click", function () {
			$('#mEPE').remove();
			$('#mH').remove();
			$('#mAU').remove();
			cws.abandonarPartida();
		})
	}

	this.mostrarListaDePartidas = function (lista) {
		$('#mLP').remove();
		let cadena = '<div id="mLP"><h3>Partidas disponibles</h3>';
		cadena = cadena + '<div class="col" style="margin-top:10px">';
		cadena = cadena + '<ul class="list-group">';
		for (i = 0; i < lista.length; i++) {
			cadena = cadena + "<li class='list-group-item' style='margin-top:10px'><a href='#' value='" + lista[i].codigo +
				"'>Partida creada por <b>" + lista[i].owner + "</b></a></li>";
		}
		cadena = cadena + " </ul>";
		cadena = cadena + " </div></div>";
		$("#listaPartidas").append(cadena);

		$(".list-group a").click(function () {
			codigo = $(this).attr("value");

			if (codigo) {
				$('#mLP').remove();
				$('#mCP').remove();
				cws.unirseAPartida(codigo);
			}
		});
	}

	this.finalPartida = function () {
		$('#mH').remove()
		cws.codigo = undefined;
		$('#gc').remove();
		tablero = new Tablero(10);
		this.mostrarHome()
	}
	{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg> */}

	this.mostrarEsperarPartidaEncontrada = function () {
		$('#mEPE').remove();
		var cadena = '<div class="mt-5"id="mEPE"><h3>Aun no tienes rival...</h3>';
		cadena = cadena + '<img src="cliente/img/espera.gif">';
		cadena = cadena + '</div>';
		$('#agregarUsuario').append(cadena);
	}

	this.mostrarModal = function (msg) {
		$('#mM').remove();
		let cadena = "<p class='text-dark' id='mM'>" + msg + "</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
}