
/*** filtro que devuelve si un elemento esta vacío ***/
export function ifEmpty() {
    return function(input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
}
