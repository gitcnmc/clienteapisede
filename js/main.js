var onLoadCert = true;
$(document).ready(function() {
                      
			$('#uploader').uploaderFile({});
            $('#listarCargas').listarCargas({});
            $('#boxDescargas').listarDescargas({});
            toggleBoxes("uploader","Carga Express");  
            var info=localStorage.getItem("info");
            if("oculto"==info){
              $("#alertInfo").remove();                
            }
            var pre=localStorage.getItem("preproduccion");
            if (pre==null || pre==undefined){
                localStorage.setItem("preproduccion","https://apipre.cnmc.gob.es/");    
            }
            var pro=localStorage.getItem("produccion");
            if (pro==null || pro==undefined){
                localStorage.setItem("produccion","https://api.cnmc.gob.es/");    
            }
            var entorno=localStorage.getItem("entorno");
            if (entorno!=null && entorno!=undefined){
                if(entorno=="preproduccion"){
                    $("#Entorno").bootstrapToggle('on')
                }else if(entorno=="produccion"){
                    $("#Entorno").bootstrapToggle('off')
                }
            }else{
                localStorage.setItem("entorno","preproduccion"); 
            }
             $('#divFoot').text(localStorage.getItem(localStorage.getItem("entorno")))
             checkCertificado();
             onLoadCert=false;
		});
        
         $("#nif_empresa").change(function(){
            	var nifE=$("#nif_empresa").val();
            	var nifP=$("#nif_presentador").val();
            	if(nifE=="" || nifP==""){
            		$("a[name*='play']").addClass("disabled")	
            	}else{
            		$("a[name*='play']").removeClass("disabled")
            	}
          });
          $("#nif_presentador").change(function(){
            	var nifE=$("#nif_empresa").val();
            	var nifP=$("#nif_presentador").val();
            	if(nifE=="" || nifP==""){
            		$("a[name*='play']").addClass("disabled")
            	}else{
            		$("a[name*='play']").removeClass("disabled")
            	}
          });
           $("#aCarga").click(function(){
               toggleBoxes("uploader",this.text.trim());                                
          });
          $("#aListarCargas").click(function(){
            	toggleBoxes("listarCargas",this.text.trim())  ;              
          });
          $("#aDescargas").click(function(){
            	toggleBoxes("descarga",this.text.trim())  ;              
          });
          $("#Entorno").change(function(){
            	if($("#Entorno").prop('checked')){
                    $('#footer').removeClass('navbar-red');
                    $('#footer').addClass('navbar-green');
                    localStorage.setItem("entorno","preproduccion");
                    
                }else{
                    $('#footer').removeClass('navbar-green');
                    $('#footer').addClass('navbar-red');
                    localStorage.setItem("entorno","produccion");
                }
                $('#divFoot').text(localStorage.getItem(localStorage.getItem("entorno")))  
                if(!onLoadCert){
                    checkCertificado();    
                }else{
                    onLoadCert=false;
                }
                
                     
          });
          
          $('#ocultar').click(function(){
             
              $("#alertInfo").remove();
              localStorage.setItem("info","oculto");
          });
          function toggleBoxes(clase,titulo){
              $("#alertError").hide();
                $("#formTitle").text(titulo);
                $(".caja").addClass('hidden');;               
                $("."+clase).removeClass('hidden');
                $('.'+clase +' .btn.listar').click();
          }
          function checkCertificado(){
              $(".select2").select2({
                  minimumResultsForSearch: Infinity
              });
              $('#nif_empresa').select2({
                           
                            tags: true,
                            maximumSelectionSize: 1
                        });
                        
              $.support.cors = true;
              
              $.ajax({
                url: localStorage.getItem(localStorage.getItem("entorno"))+"test/v1/nif",
                type:'GET',
                contentType:"application/json; charset=utf-8",
                success: function(data,textStatus){
                    console.log("Nif OK");
                    if(data!="" && data!=undefined ){
                        console.log(data);
                        $('#nif_presentador').val(data.nif);
                        $('#nif_empresa').select2({
                            data:data.empresa,
                            tags: true,
                            maximumSelectionSize: 1
                        });    
                        
                    }
                    else{
                        var dialog=$('#modalEstado');
                        $("#modal-title").text('ERROR');
                        var body =$("#modal-body")[0];
						body.textContent="";
						var e =document.createElement("h2");
                        e.innerText="El certificado utilizado no es válido";
						body.appendChild(e);
						dialog.modal("show");
                           
                    }
                                                    
                },
                error:  function( textStatus, errorThrown ){
                     var dialog=$('#modalEstado');
                        $("#modal-title").text('ERROR');
                        var body =$("#modal-body")[0];
						body.textContent="";
						var e =document.createElement("h2");
                        e.innerText="El certificado utilizado no es válido";
                        body.appendChild(e);
						dialog.modal("show");
                          
                },
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
            });
          }