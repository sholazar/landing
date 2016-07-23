$(document).ready(function () {

    $('#form_a').submit(function () {
        mail($(this));
        return false;
    });

});