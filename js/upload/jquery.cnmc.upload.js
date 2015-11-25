(function($, window, document, undefined) {
	'use strict';

	var UploaderFile = function(element, options){

		this._init();
	};

	UploaderFile.prototype = {
 
			constructor: UploaderFile ,
			
			_init : function(){
				var self = this;

				this.flow = new Flow({
					target:'uploadChunk', 
					query:{upload_token:'my_token'},
					testChunks:false,
					method: "octet",
					chunkSize: 4*1024*1024
					
				});
				
				this.flow.assignBrowse(document.getElementById('addfile'), false, false);
				
				this.flow.on('fileAdded', function(file, event){
					
				});
				this.flow.on('filesAdded', function(files, event){
					self.addFileToUI(files);
					console.log("files ========",files, event);
				});
				this.flow.on('fileSuccess', function(file,message){
					console.log(file,message);
				});
				this.flow.on('fileError', function(file, message){
					console.log(file, message);
				});
				
				// this.flow.on('progress', function(){
				// 	self.updateTotalProgress();
				// });
				
				this.flow.on('fileProgress', function(file){
					self.updateFileProgress(file);
				});
				
				// this.flow.on('complete', function(){
				// 	$("#totalProgress").addClass( "progress-bar-green" );
				// 	$("#totalProgress").removeClass("progress-bar-blue");
				// });
				
				this.flow.on('fileSuccess', function(file, message){
					$("#progress-"+file.uniqueIdentifier).addClass( "progress-bar-green" );
					$("#progress-"+file.uniqueIdentifier).removeClass("progress-bar-aqua");
				});
				
				$("#run").bind("click", {scope:this}, function(event){
					
					event.data.scope.play();
					
				});
				$("#stop").bind("click", {scope:this}, function(event){
					event.data.scope.cancel();					
				});
				
			},
			
			addFileToUI : function(files){
				
				var table = $("#files");
				for(var i= 0 ; i < files.length ; i++){
					var file = files[i];
					
					var tr = document.createElement( "tr" );
					tr.id = 'line-' + file.uniqueIdentifier;
					var tdNum = document.createElement( "td" );
					tdNum.id='num-'+file.uniqueIdentifier;
					tr.appendChild(tdNum);
					var tdName = document.createElement( "td" );
					tdName.innerHTML = file.name;
					tr.appendChild(tdName);
					
					var tdP = document.createElement( "td" );
					tdP.appendChild(this.createProgress(file));
					tr.appendChild(tdP);
					var tdS = document.createElement( "td" );
					tdS.appendChild( this.createDiv("tds-"+file.uniqueIdentifier));					
					tr.appendChild(tdS);
					var tdI = document.createElement( "td" );
					tdI.appendChild(this.createInitButton(file));
					tr.appendChild(tdI);
					var tdB = document.createElement( "td" );
					tdB.appendChild(this.createDeleteButton(file));
					tr.appendChild(tdB);
					
					table.append(tr);
					
					$("#del-"+file.uniqueIdentifier).bind("click", {scope:this, fileid: file.uniqueIdentifier}, function(event){
						event.data.scope.removeFile(event.data.fileid);	
						if(file.ajaxRequest!=undefined){
							try{
								file.ajaxRequest.abort();
							}catch(error){
								console.log("error abortando peticion");
							}
							
						}				
					});
					$("#play-"+file.uniqueIdentifier).bind("click", {scope:this, fileid: file.uniqueIdentifier}, function(event){
						event.data.scope.play(event.data.fileid);					
					});
					
					this.generateUIFileIndex();
 				}
				
				
			},
			
			createDeleteButton: function(file){
				
				var but = document.createElement( "a" );
				but.className="btn btn-danger btn-sm";
				but.id = "del-"+file.uniqueIdentifier;
				var icon = document.createElement( "i" );
				icon.className="glyphicon glyphicon-remove";
				
				but.appendChild(icon);
				
				return but;
				
			},
			createInitButton: function(file){


				//but.className="btn btn-default consultaEstado has-spinner";
				//but.id = "est-"+file.uniqueIdentifier;
				//but.setAttribute('data-uuid',uuid);
				//var span = document.createElement("span");
				//span.className="spinner fa fa-spinner fa-pulse";
				//var text = document.createElement("span");
				//text.innerText=' Consultar estado';
				//but.appendChild(span);
				//but.appendChild(text);
				
				var but = document.createElement( "a" );
				but.className="btn btn-default has-spinner";
				but.name="play-"+file.uniqueIdentifier;
				but.id = "play-"+file.uniqueIdentifier;
				var span = document.createElement("span");
				span.className="spinner fa fa-spinner fa-pulse";
				var icon = document.createElement( "span" );
				icon.className="fa fa-play";
				var nifE=$("#nif_empresa").val();
				var nifP=$("#nif_presentador").val();
				but.appendChild(span);
				but.appendChild(icon);
				if(nifE=="" || nifP==""){
					but.className="btn btn-default disabled";	
				}
				return but;
				
			},
			
			createProgress : function(file){
				
				var divP = document.createElement( "div" );
				divP.className ='progress';
				divP.style.backgroundColor="#eee";
				
				var divPB = document.createElement( "div" );
				divPB.id = 'progress-' + file.uniqueIdentifier; 
				divPB.className='progress-bar progress-bar-aqua';
				divPB.style.width='0%';
				
				var span = document.createElement( "span" );
				span.id = 'progressText-' + file.uniqueIdentifier;
				
				divPB.appendChild(span);
				
				divP.appendChild(divPB);
				
				return divP
				
			},
			
			generateUIFileIndex: function(){
				
				$("#files td[id|='num']").each(function( index ) {
					  $( this ).html((index + 1) +".");
				});
			},
			
			
			createDiv: function(id){
				var div = document.createElement('div');
				div.id=id;
				return div;
			}
			,
			
			play : function(fileId){
				var file=this.flow.getFromUniqueIdentifier(fileId);
				this.upLoadFile(file);
				var btPlay= $("#play-"+fileId);


				btPlay.children().removeClass("fa-play");
				btPlay.toggleClass('active');
				btPlay.unbind("click");
				self = this;
				window.setTimeout(function(){
					var btPlay= $("#play-"+fileId);
					btPlay.toggleClass('active');
					btPlay.children().addClass("fa-stop");
					btPlay.bind("click", {scope:self, fileid: fileId}, function(event) {
						event.data.scope.stop(event.data.fileid);
					});
				},1000);

			},
			stop : function(fileId){
				var btPlay= $("#play-"+fileId);
				btPlay.children().addClass("fa-play");
				btPlay.children().removeClass("fa-stop");
				var file=this.flow.getFromUniqueIdentifier(fileId);
				if(file.ajaxRequest!=undefined){
					try{
						file.ajaxRequest.abort();
					}catch(error){
						console.log("error abortando peticion");
					}

				}
				btPlay.unbind("click");
				btPlay.bind("click", {scope:this, fileid: file.uniqueIdentifier}, function(event){
					event.data.scope.play(event.data.fileid);
				});
				$("#progressText-"+file.uniqueIdentifier).html( '');
				$("#progress-"+file.uniqueIdentifier).css("width",'0%');
				$("#progress-"+file.uniqueIdentifier).css("min-width",'0px');

				if(file.uuidCarga!=undefined) {
					$.ajax({
						url: localStorage.getItem(localStorage.getItem("entorno")) + 'carga/v1/cancelar_carga//' + file.uuidCarga,  //Server script to process data
						type: 'GET',
						success: function (data, textStatus) {
							console.log("carga cancelada");
							console.log(data);
							;
						},
						error: function (textStatus, errorThrown) {
							//alert("error",textStatus);
							$.fn.error("Error en la peticion", textStatus.responseText);
						},
					});
				}
			},
			
			pause : function(){
				this.flow.pause();
				$("#run").unbind("click");
				$("#run i").addClass( "fa-play" );
				$("#run i").removeClass("fa-pause");
				$("#run span").text("Reanudar");
				$("#run").bind("click", {scope:this}, function(event){
					event.data.scope.resume();					
				});
				
			},
			
			resume : function(){
					$("#totalProgress").css("min-width",'20px');
					this.flow.resume();
					$("#run").unbind("click");
					$("#run i").addClass( "fa-pause" );
					$("#run i").removeClass("fa-play");
					$("#run span").text("Pausar");
					$("#run").bind("click", {scope:this}, function(event){
						event.data.scope.pause();					
					});
			},
			
			cancel : function(){
				this.flow.cancel();
				$("#stop").addClass("disabled");
				$("#run").unbind("click");
				$("#run i").addClass( "fa-play" );
				$("#run i").removeClass("fa-pause");
				$("#run span").text("Iniciar");
				$("#run").bind("click", {scope:this}, function(event){
					event.data.scope.play();					
				});
			},
			
			removeFile : function(fileId){
				console.log("borramos el fichero "+fileId);
				this.flow.removeFile(this.flow.getFromUniqueIdentifier(fileId));
				$("#line-"+fileId).detach();
				this.generateUIFileIndex();
			},
			
			updateTotalProgress : function(){
				console.log(this.flow.progress());
				var p = Math.floor(this.flow.progress()*100);
				$("#totalProgress").css("width",p+'%');
				$("#totalProgressText").html( p+'%');
			},
			
			updateFileProgress : function(file){
				var p = Math.floor(file.progress()*100);
				$("#progress-"+file.uniqueIdentifier).css("min-width",'20px');
				$("#progress-"+file.uniqueIdentifier).css("width",p+'%');
				$("#progressText-"+file.uniqueIdentifier).html( p+'%');
			},
			
			upLoadFile: function(file){ 
				var formData = new FormData();
				var uuidCarga;
				//https://apipre.cnmc.gob.es/carga/v1/cargar_fichero_completo?nifPresentador=a&nifEmpresa=a&idProcedimiento=1&fechaEfecto=1&tipoFichero=1&nombreFichero=1&numeroBytes=1
				var dataJson={
					"nifPresentador": $("#nif_presentador").val(),
					"nifEmpresa": $("#nif_empresa").val(),
					"idProcedimiento": $( "#proce option:selected" ).val()
				}
				self=this;
				//Inicia Carga
				$.ajax({
					url: localStorage.getItem(localStorage.getItem("entorno"))+'carga/v1/iniciar_carga/',  //Server script to process data
					type: 'POST',
					data:JSON.stringify(dataJson),
					dataType: "json",
					contentType: "application/json",
					success: function(data,textStatus){
						console.log("carga iniciada");
						console.log(data);
						uuidCarga=data.uuidCarga;
						file.uuidCarga=uuidCarga;

						var url=localStorage.getItem(localStorage.getItem("entorno"))+'carga/v1/subir_fichero_completo?uuidCarga='+file.uuidCarga+'&tipoFichero='+$( "#tFichero option:selected" ).text()+'&nombreFichero='+file.name+'&numeroBytes='+file.size

						formData.append("file",file.file);
						//subida fichero
						file.ajaxRequest = $.ajax({
							url:  url,  //Server script to process data
							type: 'POST',
							xhr: function() {  // Custom XMLHttpRequest
								var myXhr = $.ajaxSettings.xhr();
								//control de errores AJAX
								if(myXhr.upload){ // Check if upload property exists
									myXhr.upload.addEventListener('progress',function(evt){
										console.log(evt);
										var p = Math.floor((evt.loaded/evt.total)*100);
										p=(p==100?99:p);
										console.log(p);
										$("#progress-"+file.uniqueIdentifier).css("min-width",'20px');
										$("#progress-"+file.uniqueIdentifier).css("width",p+'%');
										$("#progressText-"+file.uniqueIdentifier).html( p+'%');
									}, false); // For handling the progress of the upload

								}
								return myXhr;
							},
							//Ajax events
							//beforeSend: beforeSendHandler,
							success: function(data,textStatus){
								console.log("Subida ok");
								console.log(data);
								//Confirmacion de carga
								$.ajax({
									url: localStorage.getItem(localStorage.getItem("entorno")) + 'carga/v1/confirmar_carga/' + uuidCarga,  //Server script to process data
									type: 'GET',
									success: function (data, textStatus) {
										console.log("carga confirmada" );
										$("#progressText-" + file.uniqueIdentifier).html('100%');
										$("#progress-" + file.uniqueIdentifier).css("width", '100%');
										$("#progress-" + file.uniqueIdentifier).addClass("progress-bar-green");
										$("#progress-" + file.uniqueIdentifier).removeClass("progress-bar-aqua");
										var td = $("#play-" + file.uniqueIdentifier).parent()[0];
										$("#play-" + file.uniqueIdentifier).remove();
										td.appendChild($.fn.createEstadoButton(file, file.uuidCarga));
										$("#est-" + file.uniqueIdentifier).click(function () {
											$.fn.consultaEstado($(this), file.name);

										});
									},
									error: function (textStatus, errorThrown) {
										//alert("error",textStatus);
										if (textStatus.statusText != "abort") {
											$.fn.error("Error en la peticion", textStatus.responseText);
											$("#play-" + file.uniqueIdentifier).remove();
										}
									},
								});
							},
							error:  function( textStatus, errorThrown ){
								//alert("error",textStatus);
								if(textStatus.statusText != "abort") {
									$.fn.error("Error en la peticion", textStatus.responseText);
									$("#play-" + file.uniqueIdentifier).remove();
								}
							},
							// Form data
							data: formData,
							//Options to tell jQuery not to process data or worry about content-type.
							cache: false,
							contentType: false,
							processData: false

						}).always(function(jqXHR, textStatus) {
							if (textStatus != "success" && textStatus != "abort") {
								$.fn.error("Error en la peticion",textStatus.responseText=""?textStatus:textStatus.responseText);
								$("#play-" + file.uniqueIdentifier).remove();
							}
						});
					},
					error:  function( textStatus, errorThrown ){
						//alert("error",textStatus);
						$.fn.error("Error en la peticion",textStatus.responseText);
						$("#play-" + file.uniqueIdentifier).remove();
					},
				});



			}
			
	};

	$.fn.consultaEstado = function(button,name){
		button.toggleClass('active');		
		var uuid=button[0].getAttribute('data-uuid');
		
		$.ajax({
			url: localStorage.getItem(localStorage.getItem("entorno"))+'carga/v1/consultar_estado_carga/'+uuid,  //Server script to process data
			type: 'GET',
			success: function(data,textStatus){
						console.log("estado carga");
						console.log(data);
						
						var dialog =$("#modalEstado");
						$("#modal-title").text(name);
						var uuidCarga= document.createElement("p");
						uuidCarga.innerText="UuidCarga: "+uuid;
						var errores=document.createElement("a");
						var estado=document.createElement("p");
						try {
							if(data.errores.length>0){
								errores.setAttribute("href", data.errores[0].url);					
								errores.text="Errores";	
							}
						} catch (error) {
							console.log(error);
						}
						estado.innerText="Estado: "+data.estado;
						var registros=document.createElement("p");
						registros.innerText="Registros: "+data.registrosErrores+" errores / "+data.registrosProcesados+" procesados";
						var body =$("#modal-body")[0];
						body.textContent="";
						body.appendChild(uuidCarga);
						body.appendChild(estado);
						body.appendChild(registros);
						body.appendChild(errores);
						dialog.modal("show");
						button.toggleClass('active');
			
			},
			error:  function( textStatus, errorThrown ){
						//alert("error",textStatus);
						$.fn.error("Error en la peticion",textStatus.responseText);
					},
			});
	};
	$.fn.createEstadoButton = function(file,uuid){
				
				var but = document.createElement( "a" );
				but.className="btn btn-default consultaEstado has-spinner";
				but.id = "est-"+file.uniqueIdentifier;
				but.setAttribute('data-uuid',uuid);	
				var span = document.createElement("span");
				span.className="spinner fa fa-spinner fa-pulse";
				var text = document.createElement("span");
				text.innerText=' Consultar estado';			
				but.appendChild(span);
				but.appendChild(text);
				//<span class="spinner"><i class="icon-spin icon-refresh"></i></span>
							
				return but;
	};
			
	$.fn.error = function(mensaje,detail){
		$("#MensajeError").text(mensaje);
		if(detail+""=="" || detail==undefined)	{
			$("#preError").hide();
		}else{
			try{
				$("#preError").text(JSON.stringify(JSON.parse(detail),undefined,2));
			}
			catch(err){
				$("#preError").text(detail);
			}
			$("#preError").show();
		}
		$("#alertError").show();
				
	};
	$.fn.sleep=function(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	};
	
	$.fn.uploaderFile = function(option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function() {
			var $this = $(this),
			data = $this.data('uploaderFile'),
			options = typeof option === 'object' && option;

			if (!data) {
				$this.data('uploaderFile', (data = new UploaderFile(this, $.extend({}, $.fn.uploaderFile.defaults, options, $(this).data()))));
			}

			if (typeof option === 'string') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.uploaderFile.defaults = {};
	$.fn.uploaderFile.Constructor = UploaderFile;

	


})(jQuery, window, document);

