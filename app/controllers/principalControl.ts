
export function principalControl($scope,entorno){
  $scope.mostrarSideBar = true;
  $scope.footer = localStorage.getItem(localStorage.getItem("entorno"));
}
