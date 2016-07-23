$(document).ready(function () {

    $('#form_').submit(function () {
        mail($(this));
        return false;
    });

});