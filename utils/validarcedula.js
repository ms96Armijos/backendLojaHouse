function validarcedula(a) {
    //var e = a;
   // var cad = document.getElementById(a).value.trim();
    var total = 0;
    var longitud = a.length;
    var longcheck = longitud - 1;


    for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
            var aux = a.charAt(i) * 2;
            if (aux > 9) aux -= 9;
            total += aux;
        } else {
            total += parseInt(a.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
    }

    total = total % 10 ? 10 - total % 10 : 0;

    if (a.charAt(longitud - 1) == total) {
        console.log('Cédula válida');
        return true;
        //document.getElementById("salida").innerHTML = ("* Cédula Válida");

    } else {
        console.log('Cédula inválida');
        return false;
        //document.getElementById("salida").innerHTML = ("* Cédula Inválida");

        
    }

}

module.exports = {
    validarcedula
}