

/** Class FirmarURL **/
export class OauthFactory {

	$q;
	consumidor;
	credenciales;
	entorno;

	static $inject = ['$q', 'consumidor', 'credenciales', 'entorno'];

	/**
	* Crea el service FirmarURL.
	* @param {object} $q - ng.IQService
	* @param {object} consumidor - ConsumidorResource
	* @param {object} credenciales - CredencialesResource
	* @param {object} entorno - EntornoResource
	*/

	constructor($q,consumidor,credenciales,entorno) {
		this.$q = $q;
		this.consumidor = consumidor;
		this.credenciales = credenciales;
		this.entorno = entorno;
	}

	validarCredenciales(): any{
		var self = this;
		var deferred = self.$q.defer();
		if (!self.entorno.autorizacion && self.credenciales.consumerKey == "" && self.credenciales.consumerSecret ==   ""){
			deferred.reject();
		}else{
			var res = self.consumidor.nif().get();
			res.$promise
			.then(function(data){
				self.credenciales.nif = data.empresa[0];
				if (self.entorno.autorizacion){
					self.credenciales.nif_presentador = data.nif;
				}else{
					self.credenciales.nif_presentador = "";
				}
				deferred.resolve();
			},function(error){
				self.credenciales.nif = "";
				self.credenciales.nif_presentador = "";
				deferred.reject();
			});
		}

		return deferred.promise;
	}
}
