/* конечная функция */
function mail(form) {
    var message_text = 'Ваша заявка отправлена<br>Мы скоро свяжемся с Вами!', form_file, form_phone;

    form_phone = $(form).find('input[name="phone"]');

    if ($(form).find('input').is('input[name="file"]')) {
        form_file = $(form).find('input[name="file"]');
    } else {
        form_file = false;
    }

    if (!form_phone.val()) {
        validate(form_phone);
    } else {
        ajax(form, form_file, message_text)
    }
}

/* ajax */
function ajax(form, form_file, message_text) {
    var formData = new FormData(form[0]);
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


/* Обработка ответа сервера */
function succ(answer, form, file, message_text) {
    switch (answer) {
        case 'success':
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
        case 'failed':
            break
        case 'format_error':
            file_answ(file, 'Неверный формат');
            break
        case 'size_error':
            file_answ(file, 'Слишком большой файл');
            break
    }
}


/* анимация валидации телефона */
function validate(phone) {
    phone
        .animate({boxShadow: 'inset 0 0 0px 5px #ff0000'})
        .animate({boxShadow: "inset 0 0 0 0 transparent"});
}


/* Анимация валидации формата и размера файла */
$('input[type="file"]').on('change', function () {
    file_button($(this));
});
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
function file_answ(file, answer) {
    file.siblings('span')
        .html(answer)
        .css({'background': '#ff0000'});
}