$(document).ready(function () {

    var message_text = 'Ваша заявка отправлена<br>Мы скоро свяжемся с Вами!';
    var formData;

    var form = $('#seven_form');
    var form_phone = $('#seven_form input[name="phone"]');
    var form_file = $('#seven_form input[name="file"]');
    form.submit(function () {
        if (!form_phone.val()) {
            validate_phone(form_phone);
        } else {
            formData = new FormData(form[0]);
            $.ajax({
                url: 'mail/mailer.php',
                type: 'post',
                contentType: false,
                processData: false,
                data: formData,
                success: function (answer) {
                    succ(answer, form, form_file, message_text);
                }
            });
        }
        return false;
    });

    form_file.on('change', function () {
        file_button(form_file);
    });
});

/*
Обработка ответа сервера
 */
function succ(answer, form, file, message_text) {
    switch (answer) {
        case 'send':
            var type = form.find('input[name="type"]').val();
            form.trigger('reset').fadeOut(300, function () {
                form.after('<p class="message_send">' + message_text + '</p>');
                if (file) {
                    file.siblings('span')
                        .html('Выбрать файл')
                        .css({'background': '#999'});
                }
            });
            form.find('input[name="type"]').val(type);
            setTimeout(function () {
                form.fadeIn(300).siblings('.message_send').remove();
            }, 15000);
            break
        case 'nosend':
            break
        case 'format':
            if (file) {
                file.siblings('span')
                    .html('Неверный формат')
                    .css({'background': '#ff0000'});
            }
            break
        case 'size':
            if (file) {
                file.siblings('span')
                    .html('Слишком большой файл')
                    .css({'background': '#ff0000'});
            }
            break
    }
}

/*
Валидация телефона
 */
function validate_phone(phone) {
    phone
        .animate({backgroundColor: "#ff0000", opacity: 0.8}, 300)
        .animate({backgroundColor: "#fff", opacity: 1}, 300);
}

/*
Валидация формата и размера файла
 */
function file_button(form_file) {
    if (form_file.val()) {
        form_file.siblings('span')
            .html('Файл выбран')
            .css({'background': '#3FAE47'});
    } else {
        form_file.siblings('span')
            .html('Выбрать файл <i>.jpg, .png, .pdf</i>')
            .css({'background': '#999'});
    }
}