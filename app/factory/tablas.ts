

/** Class TablaFactory. */
export class TablaFactory{

  tablaDescargas: any;
  tablaCargas: any;
  cargas: any;
  tablaListasCargas: any;
  uiGridConstants;

  /**
   * Crea la factory EntornoFactory.
    * @param {object} uiGridConstants - constantes de ui-grid
   */
   static $inject = ['uiGridConstants']
  constructor(uiGridConstants){

    this.uiGridConstants = uiGridConstants;
    this.cargas = [];
    this.tablaDescargas = {};
    this.tablaCargas = {};
    this.tablaListasCargas = {};

   }

  /**
    * genera las opciones de ui-grid de la tabla de descargas.
   */
  public generarTablaDescargas(){
    var self = this;

    self.tablaDescargas = {
      enableMinHeightCheck: true,
      enableColumnMenus: false,
      gridMenuShowHideColumns : false,
      enableFiltering: false,
      enableHorizontalScrollbar  : self.uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar   :  self.uiGridConstants.scrollbars.NEVER,
      enableSorting: true,
      rowHeight: 45,
      columnDefs: [
        { headerCellClass:'header-table-cnmc', field: 'nombre', displayName : 'Fichero', width:'30%' },
        { headerCellClass: 'header-table-cnmc', field: 'numeroBytes', displayName: 'Tamaño', width: '7%', type: 'number', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity[col.field]  | bytes}} </div>'},
        { headerCellClass:'header-table-cnmc', field: 'fechaDisponibilidad', displayName: 'Disponible', width: '10%', type:'number',cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity[col.field] | date : "dd/MM/yyyy" : "+0100"}}</div>' },
        { headerCellClass:'header-table-cnmc', field: 'fechaCaducidad', displayName: 'Caducidad', width: '10%', type:'number',cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity[col.field] | date : "dd/MM/yyyy" : "+0100"}}</div>' },
        { headerCellClass:'header-table-cnmc', field: 'tipoFichero', displayName: 'Tipo', width: '20%' },
        { headerCellClass:'header-table-cnmc', field: 'estado', displayName: 'Estado', width: '10%' },
        { headerCellClass:'header-table-cnmc', field: 'uriDescargas', displayName: 'Original', width: '7%',enableFiltering: false,enableSorting:false,cellTemplate: '<div class="ui-grid-cell-contents" align="center"><a target="_self" ng-href="{{row.entity[col.field]}}"><i class="fa fa-download"></i ></a></div>'},
        { headerCellClass:'header-table-cnmc', field: 'uriDescargas', displayName: 'ZIP', width: '5%',enableFiltering: false,enableSorting:false,cellTemplate: '<div class="ui-grid-cell-contents" align="center"><a target="_self" ng-href="{{row.entity[col.field] + \'.zip\' }}"><i class="fa fa-file-archive-o"></i> </a></di v>'}
      ]
    }

    return self.tablaDescargas;
  }

  /**
    * genera las opciones de ui-grid de la tabla de lista de cargas.
    * @param {object} $scope
   */
  public generarTablaListasCargas($scope){
    var self = this;

    self.tablaListasCargas = {
      enableColumnMenus : false,
      gridMenuShowHideColumns : false,
      enableFiltering: false,
      enableHorizontalScrollbar  : self.uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar   :  self.uiGridConstants.scrollbars.NEVER,
      enableMinHeightCheck: true,
      rowHeight: 45,
      columnDefs: [
        { headerCellClass:'header-table-cnmc', field: 'uuidCarga', displayName : 'UUID', enableColumnResizing : true, width:'30%' },
        { headerCellClass:'header-table-cnmc', field: 'fechaInicio', type:'number', displayName: 'Inicio', enableColumnResizing: true, width: '15%', cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity[col.field] | date : "dd/MM/yyyy HH:mm:ss" : "+0100"}}</div>'} ,
        { headerCellClass: 'header-table-cnmc', field: 'fechaFinProceso', type:'number', displayName: 'Fin Proceso', width: '15%' ,cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity[col.field] | date : "dd/MM/yyyy HH:mm:ss" : "+0100"}}</div>' },
        { headerCellClass: 'header-table-cnmc', field: 'fechaEfecto', type:'number', displayName: 'Fin Efecto', width: '15%' ,cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity[col.field] | date : "dd/MM/yyyy" : "+0100"}}</div>' },
        { headerCellClass: 'header-table-cnmc', field: 'estado', displayName: 'Estado', width: '15%', cellTemplate: '<div class="ui-grid-cell-contents" align="center" ><a href="" ng-click="grid.appScope.lc.consultarEstado(row.entity)" >{{row.entity[col.field]}}</a><span style="margin:10px;"></span><a href ="" ng-show="row.entity.estado === \'INICIADA\' " ng-click="grid.appScope.lc.cancelarCarga(row.entity)" >Cancelar</a></div>'},
        { headerCellClass: 'header-table-cnmc', field: ' ', displayName: 'Detalles Carga', width: '10%', enableFiltering: false, enableSorting: false, cellTemplate: '<div class="ui-grid-cell-contents" align="center"><button class="btn btn-primary" ng-show="row.entity.ficheros.length > 0 " ng-click="grid.appScope.lc.abrirModalDetalles(row.entity)"><i class="fa fa-file-text"></i></button></div>'},
      ]
    }
    return self.tablaListasCargas;
  }

  /**
    * genera las opciones de ui-grid de la tabla de cargaExpress
    * @param {object} $scope
   */
  public generarTablaCargas($scope){
    var self = this;

    self.tablaCargas = {
      enableMinHeightCheck: true,
      enableColumnMenus : false,
      gridMenuShowHideColumns : false,
      enableFiltering: false,
      enableHorizontalScrollbar  : self.uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar   :  self.uiGridConstants.scrollbars.NEVER,
      expandableRowTemplate : './templates/ui-grid/carga.fragmentos.html',
      enableExpandableRowHeader : false,
      rowHeight: 47,
      columnDefs: [
        { headerCellClass:'header-table-cnmc', field: ' ', displayName : ' ', width:'5%', cellTemplate:'./templates/ui-grid/carga.expandable.html'},
        { headerCellClass:'header-table-cnmc', field: 'name', displayName : 'Fichero', width:'25%' },
        { headerCellClass: 'header-table-cnmc', field: 'size', type:'number', displayName: 'Tamaño', width: '10%', cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity.size |  bytes}}</div>'},
        { headerCellClass:'header-table-cnmc', field: ' ', displayName: 'Proceso de Carga', width: '35%', cellTemplate : './templates/ui-grid/carga.progreso.html' },
        { headerCellClass:'header-table-cnmc', field: ' ', displayName: 'Control de Carga', width: '15%', cellTemplate:'./templates/ui-grid/carga.control.html' },
        { headerCellClass:'header-table-cnmc', field: ' ', displayName: 'Opciones', width: '10%', cellTemplate:'<div class="ui-grid-cell-contents" align="center"><button ng-disabled="row.entity.iniciarCarga" ng-click="grid.appScope.cc.abrirModalOpciones(row,grid)" class="btn btn-primary" ><i class="fa fa-cog"></i></button></div>' },
      ],
      onRegisterApi: function(gridApi) {
          gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {

            if(row.isExpanded){
              row.expandedRowHeight = (row.entity.partes.length * 47);
              row.grid.options.gridHeight += (row.entity.partes.length * 47);
              row.entity.subGridOptions.minRowsToShow = row.entity.partes.length;
            }else{
              row.grid.options.gridHeight -= (row.entity.partes.length * 47);
            }

          });
      }
    }

    return self.tablaCargas;
  }

}
