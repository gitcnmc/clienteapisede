(function($, window, document, undefined) {
	'use strict';

	var Descargas = function(element, options){

		this._init();
	};

	Descargas.prototype = {

			constructor: Descargas ,
			
			_init : function(){
				$("#listarDescargas").bind("click", {scope:this}, function(event){
					
					event.data.scope.listar();
					
				});
				
			},
			listar : function(){
				$("#alertError").hide();
				var button=$("#listarDescargas");
					button.toggleClass('active');
					var nifEmpresa=$("#nif_empresa").val();
					var procedimiento=$( "#proce option:selected" ).val();
					var estado=$("#desEstado option:selected" ).val();
					var fechaDesde;
					var fechaHasta;					
					var self=this;
					//llamada a consultar descargas
					try {
						$.ajax({
							url: localStorage.getItem(localStorage.getItem("entorno"))+'ficheros/v1/consultar?idProcedimiento='+procedimiento+'&nifEmpresa='+nifEmpresa+'&estado='+estado,//+'&fechaDesde=<>&fechaHasta=<> ,  //Server script to process data
							type: 'POST',	        
							dataType: "json",	
							contentType: "application/json",								
							success: function(data,textStatus){
								console.log("consultar ok");
								self.recorreRespuesta(data);
																
							},
							error:  function( textStatus, errorThrown ){
								$.fn.error("Error en la peticion",textStatus.responseText);
								button.toggleClass('active');
							},
							cache: false,
						});
					} catch (error) {
						alert(error);
					}
					
			},
			recorreRespuesta: function(resultado){
				var self=this;	
				var table = $("#descargaTable");
				$(".item-descarga").remove();
				var i =resultado.length-1;
				for (i; i >=0; i--) {						
					var value = resultado[i];
					var tr = document.createElement( "tr" );					
					tr.id = 'des-' + value.uuid;
					var tdNum = document.createElement( "td" );
					tdNum.id='num-'+ value.uuid;
					tdNum.innerHTML=i+1;
					tr.appendChild(tdNum);
					var tdName = document.createElement( "td" );
					tdName.innerHTML = value.nombre;
					tr.appendChild(tdName);
					var tdSize = document.createElement( "td" );
					tdSize.innerHTML =filesize(value.numeroBytes);
					tr.appendChild(tdSize);
					
					var tdfDisponi = document.createElement( "td" );
					tdfDisponi.innerHTML = value.fechaDisponibilidad?(new Date(value.fechaDisponibilidad+" UTC")).toLocaleString():"";
					tr.appendChild(tdfDisponi);
					var tdfechaCaducidad = document.createElement( "td" );
					tdfechaCaducidad.innerHTML = value.fechaCaducidad?(new Date(value.fechaCaducidad +" UTC")).toLocaleString():"";
					tr.appendChild(tdfechaCaducidad);
					
					var tdTipo = document.createElement( "td" );
					tdTipo.innerHTML = value.tipoFichero;
					tr.appendChild(tdTipo);
					var tdEstado = document.createElement( "td" );					
					tdEstado.innerHTML = value.estado;
					tr.appendChild(tdEstado);
					var tdDow = document.createElement( "td" );					
					tdDow.appendChild( self.createADown(value.uriDescargas));
					tr.appendChild(tdDow);
					tr.className="item-descarga";
					table.append(tr);					
					
				}
				var button=$("#listarDescargas");
				button.toggleClass('active');
			},
			createADown:function(uriDescarga){
				var but = document.createElement( "a" );
				but.setAttribute("href",uriDescarga);	
				var span = document.createElement("span");
				span.className="fa fa-download";				
							
				but.appendChild(span);
				
				
				
				return but;
			}
	};
	
$.fn.listarDescargas  = function(option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function() {
			var $this = $(this),
			data = $this.data('listarDescargas'),
			options = typeof option === 'object' && option;

			if (!data) {
				$this.data('listarDescargas', (data = new Descargas(this, $.extend({}, $.fn.listarDescargas.defaults, options, $(this).data()))));
			}

			if (typeof option === 'string') {
				data[option].apply(data, args);
			}
		});
	};
	$.fn.listarDescargas.defaults={};
	$.fn.listarDescargas.Constructor = Descargas;
	
	
	
	})(jQuery, window, document);