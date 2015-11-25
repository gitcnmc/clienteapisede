(function($, window, document, undefined) {
	'use strict';

	var ListCargas = function(element, options){

		this._init();
	};

	ListCargas.prototype = {

			constructor: ListCargas ,
			
			_init : function(){
				$("#listar").bind("click", {scope:this}, function(event){
					
					event.data.scope.listar();
					
				});
			},
			listar : function(){
				if(this.valida()){
					var button=$("#listar");
					button.toggleClass('active');
					var nifPresentador=$("#nif_presentador").val();
					var nifEmpresa=$("#nif_empresa").val();
					var procedimiento=$( "#proce option:selected" ).val();
					var estado=$("#Estado option:selected" ).val();
					var consulta;
					if(estado==""){					
						consulta={
							nifPresentador:nifPresentador,
							nifEmpresa	:nifEmpresa,
							idProcedimiento :procedimiento
						};
					}else{				
						consulta={
							nifPresentador:nifPresentador,
							nifEmpresa	:nifEmpresa,
							idProcedimiento :procedimiento,
							estado:estado
						};
					}
					var self=this;
					$.ajax({
						url: localStorage.getItem(localStorage.getItem("entorno"))+'carga/v1/listar_cargas' ,  //Server script to process data
						type: 'POST',		    
						dataType: "json",	
						contentType: "application/json",								
						success: function(data,textStatus){
							console.log("listar ok");
							self.recorreRespuesta(data);
															
						},
						error:  function( textStatus, errorThrown ){
							$.fn.error("Error en la peticion",textStatus.responseText);
							button.toggleClass('active');
						},
						
						data: JSON.stringify(consulta),
						//Options to tell jQuery not to process data or worry about content-type.
						cache: false,
					});
				}
			},
			valida:function(){
				if($("#nif_empresa").val()==null ||$("#nif_empresa").val()==''){
					
					$.fn.error("Introduzca el NIF de la empresa","");
				}else{
					$("#alertError").hide();
					return true;
				}
			}
			,
			recorreRespuesta: function(resultado){
				var self=this;	
				var table = $("#cargas");
				$(".item-carga").remove();
				var i =resultado.length-1;
				for (i; i >=0; i--) {						
					var value = resultado[i];
					var tr = document.createElement( "tr" );
					tr.className="accordion-toggle";
					tr.id = 'line-' + value.uuidCarga;
					var tdPlus = document.createElement( "td" );
					tdPlus.appendChild(self.createPlusButton(value));
					tdPlus.className="pl-toggle collapsed";
					tdPlus.setAttribute("data-toggle","collapse");
					tdPlus.setAttribute("data-target","#files-"+value.uuidCarga);
					tr.appendChild(tdPlus);
					var tdNum = document.createElement( "td" );
					tdNum.id='num-'+ value.uuidCarga;
					tdNum.innerHTML=i+1;
					tr.appendChild(tdNum);
					var tdName = document.createElement( "td" );
					tdName.innerHTML = value.uuidCarga;
					tr.appendChild(tdName);
					var tdInicio = document.createElement( "td" );
					tdInicio.innerHTML = value.fechaInicio?(new Date(value.fechaInicio+" UTC")).toLocaleString():"";
					tr.appendChild(tdInicio);
					// var tdFin = document.createElement( "td" );
					// tdFin.innerHTML = value.fechaFin;
					// tr.appendChild(tdFin);
					var tdFinProceso = document.createElement( "td" );
					tdFinProceso.innerHTML =value.fechaFinProceso?(new Date(value.fechaFinProceso+" UTC")).toLocaleString():"";
					tr.appendChild(tdFinProceso);
					var tdEstado = document.createElement( "td" );					
					tdEstado.appendChild(self.createButonEstado(value.estado,value.uuidCarga));
					var tdCancelar = document.createElement( "td" );
					tr.appendChild(tdEstado);
					if(value.estado=='INICIADA'){
						tdCancelar.appendChild(self.createButonCancelar(value.uuidCarga))
					}
					tr.appendChild(tdCancelar);
					var tdFiles = document.createElement( "td" );
					tdFiles.appendChild(self.createFilestButton(value));
					tdFiles.setAttribute("data-toggle","collapse");
					tdFiles.setAttribute("data-target","#files-"+value.uuidCarga);
					tr.appendChild(tdFiles);					
					var tbody=document.createElement("tbody");
					tbody.className="item-carga";
					tbody.appendChild(tr);
					tbody.appendChild(self.createTableFiles(value.ficheros,value.uuidCarga));
					table.append(tbody);
					$("#est-"+value.uuidCarga).click(function(){							
						$.fn.consultaEstado($(this),value.uuidCarga);
					});
					if(value.estado=='INICIADA') {
						$("#cancel-" + value.uuidCarga).click(function () {
							$.fn.cancelarCarga($(this));
						});
					}
					
				}
				var button=$("#listar");
				button.toggleClass('active');
			},
			createButonCancelar:function(uuidCarga){
				var but = document.createElement( "a" );
				but.className="cancelarCarga has-spinner enlace";
				but.id = "cancel-"+uuidCarga;
				but.setAttribute('data-uuid',uuidCarga);
				var span = document.createElement("span");
				span.className="spinner fa fa-spinner fa-pulse";
				var text = document.createElement("span");
				text.innerText="Cancelar";
				but.appendChild(span);
				but.appendChild(text);

				return but;

			},
			createButonEstado:function(estado,uuidCarga){
				var but = document.createElement( "a" );
				but.className="consultaEstado has-spinner enlace";
				but.id = "est-"+uuidCarga;
				but.setAttribute('data-uuid',uuidCarga);	
				var span = document.createElement("span");
				span.className="spinner fa fa-spinner fa-pulse";
				var text = document.createElement("span");
				text.id="est-text-"+uuidCarga;
				text.innerText=estado;			
				but.appendChild(span);
				but.appendChild(text);
				
				
				return but;
			},
			createFilestButton: function(value){
		
				var but = document.createElement( "a" );
				but.className="enlace";
				
				but.name="files-"+value.uuidCarga;
				but.id = "fB-"+value.uuidCarga;
				var span = document.createElement( "span" );
				span.className="fa fa-ellipsis-v";
				var text = document.createElement("span");
				text.innerText=' Detalles';			
				//but.appendChild(span);
				but.appendChild(text);
				return but;
				
			},
			createPlusButton: function(value){
		
				var but = document.createElement( "a" );
				but.className="enlace";
				but.name="plus-"+value.uuidCarga;
				but.id = "plus-"+value.uuidCarga;
				var span = document.createElement( "i" );
				span.className="fa fa-plus";		
				var span2 = document.createElement( "i" );
				span2.className="fa fa-minus";		
				but.appendChild(span);
				but.appendChild(span2);
				return but;
				
			},
			createTableFiles:function(ficheros,uuidCarga) {
				var td = document.createElement( "td" );
					td.className="hiddenRow";
					td.setAttribute("colspan","5");
					td.setAttribute("style","border-top: none !important;");	
				var div = document.createElement("div");
				div.id = 'files-' + uuidCarga;
				div.className="accordian-body collapse ";
				var table = document.createElement("table");
				table.className="table";				
				var trCabecera = document.createElement("tr");
				var thUuid=document.createElement("th");
				thUuid.innerHTML="uuidUpload";
				// var thTipo=document.createElement("th");
				// thTipo.innerHTML="Tipo";
				var thNombre=document.createElement("th");
				thNombre.innerHTML="Nombre";
				var thBytes=document.createElement("th");
				thBytes.innerHTML="Tamaño";
				var thEstado=document.createElement("th");
				thEstado.innerHTML="Estado";
				trCabecera.appendChild(thUuid);
				// trCabecera.appendChild(thTipo);
				trCabecera.appendChild(thNombre);
				trCabecera.appendChild(thBytes);
				trCabecera.appendChild(thEstado);
				table.appendChild(trCabecera);
				$.each(ficheros,function(index,value){	
					if(value.nombre!=null && value.nombre.indexOf(".err") <0){
						var trLinea = document.createElement("tr");
						var tdUuid=document.createElement("td");
						tdUuid.innerHTML=value.uuidUpload;
						// var tdTipo=document.createElement("td");
						// tdTipo.innerHTML=value.tipo;
						var tdNombre=document.createElement("td");
						tdNombre.innerHTML=value.nombre;
						var tdBytes=document.createElement("td");
						tdBytes.innerHTML=filesize(value.numeroBytes);
						var tdEstado=document.createElement("td");
						tdEstado.innerHTML=value.estado;
						trLinea.appendChild(tdUuid);
						// trLinea.appendChild(tdTipo);
						trLinea.appendChild(tdNombre);
						trLinea.appendChild(tdBytes);
						trLinea.appendChild(tdEstado);
						table.appendChild(trLinea);
					}
				});
				div.appendChild(table);
				
				td.appendChild(div);
				var td2 = document.createElement( "td" );
				td2.setAttribute("style","border-top: none !important;");
				var tr	= document.createElement( "tr" );
				tr.appendChild(td2);				
				tr.appendChild(td);	
					
				return tr;
			}
			
			
			
	};
	
	$.fn.cancelarCarga = function(button){
		button.toggleClass('active');
		var uuid=button[0].getAttribute('data-uuid');

		$.ajax({
			url: localStorage.getItem(localStorage.getItem("entorno"))+'carga/v1/cancelar_carga//'+uuid,  //Server script to process data
			type: 'GET',
			success: function(data,textStatus){
				console.log("carga cancelada");
				console.log(data);
				$("#est-text-"+uuid).text("CANCELADA");
				button.toggleClass('active');
				button.remove();
			},
			error:  function( textStatus, errorThrown ){
				//alert("error",textStatus);
				$.fn.error("Error en la peticion",textStatus.responseText);
			},
		});
	};
	$.fn.listarCargas  = function(option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function() {
			var $this = $(this),
			data = $this.data('listarCargas'),
			options = typeof option === 'object' && option;

			if (!data) {
				$this.data('listarCargas', (data = new ListCargas(this, $.extend({}, $.fn.listarCargas.defaults, options, $(this).data()))));
			}

			if (typeof option === 'string') {
				data[option].apply(data, args);
			}
		});
	};
	$.fn.listarCargas.defaults={};
	$.fn.listarCargas.Constructor = ListCargas;
	
	
	
	})(jQuery, window, document);
		
			