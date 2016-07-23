<?php
if (!empty($_POST)) {

    $uploaddir = '../upload/';
    $uploadfile = $uploaddir . $_FILES['file']['name'];
    $picture = false;

    $to = "sholazar2@gmail.com";
    $site = '';
    $title = 'Заявка с сайта ' . $site;
    $mes = "";

    if (isset($_POST['phone'])) {
        $mes .= "Телефон: <b>{$_POST['phone']}</b><br>";
    }
    if (isset($_POST['type'])) {
        $mes .= "Форма: <b>{$_POST['type']}</b><br>";
    }
    if (isset($_POST[''])) {
        $mes .= ": <b>{$_POST['']}</b><br>";
    }

    $file_format = strrchr($_FILES['file']['name'], '.');
    $whitelist = array(".jpeg", ".JPEG", ".JPG", ".PNG", ".PDF", ".jpg", ".png", ".pdf");

    //если файл прикреплён
    if (!empty($_FILES['file']['tmp_name'])) {
        if (in_array($file_format, $whitelist)) {
            if ($_FILES['file']['size'] <= 10485760) {
                if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                    $picture = $uploadfile;
                }
            } else {
                echo 'size_error'; //файл слишком большой
                exit;
            }
        } else {
            echo 'format_error'; //неверный формат
            exit;
        }
    }

    $sub = '=?utf-8?B?' . base64_encode($title) . '?=';

    if (send_mail($to, $sub, $mes, $picture, $site . ' <mailer@deltaplan.by>')) {
        echo 'success';
    } else {
        echo 'failed'; //почта не отправлена
    }
}

function send_mail($to, $thm, $html, $path, $from)
{
    $boundary = "--" . md5(uniqid(time())); //генерируем разделитель

    $headers = "MIME-Version: 1.0\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\n";
    $headers .= 'From: ' . $from . '';

    $multipart = "--$boundary\n";
    $multipart .= "Content-Type: text/html; charset=utf8\n";
    $multipart .= "Content-Transfer-Encoding: Quot-Printed\n\n";
    $multipart .= "$html\n\n";

    if ($path) {

        $fp = fopen($path, "r");
        $file = fread($fp, filesize($path));
        fclose($fp);
        $message_part = "--$boundary\n";
        $message_part .= "Content-Type: application/octet-stream\n";
        $message_part .= "Content-Transfer-Encoding: base64\n";
        $message_part .= "Content-Disposition: attachment; filename = \"" . $path . "\"\n\n";
        $message_part .= chunk_split(base64_encode($file)) . "\n";

        $multipart .= $message_part . "--$boundary--\n";
    }

    if (mail($to, $thm, $multipart, $headers)) {
        if ($path) {
            unlink($path);
        }
        return true;
    } else {
        if ($path) {
            unlink($path);
        }
        return false;
    }
}

function sms($phone, $name, $number)
{
    $url = "http://cp.websms.by";
    $timeout = 5;
    $func = 'msg_send_bulk';

    $package = array(
        array(
            'recipient' => $number,
            'message'   => "Заявка \nТелефон: $phone\nИмя: $name", // ЗАЯВКА С !!!!!!!!!!!!!!
            'sender'    => 'DeltaPlanBY'
        ),
    );

    $rawData = json_encode($package);
    $ch = curl_init();

//задаем параметры CURL
    curl_setopt_array($ch, array(
        CURLOPT_URL            => $url,
        CURLOPT_FAILONERROR    => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_CONNECTTIMEOUT => 0,
        CURLOPT_POST           => 1,
        CURLOPT_POSTFIELDS     => array(
            'r'        => 'api/' . $func,
            'user'     => 'deltaplanirovanie@gmail.com',
            'apikey'   => '',
            'messages' => $rawData)
    ));

    $result = curl_exec($ch);

    if ($result) {
        $__BOM = pack('CCC', 239, 187, 191);
        while (0 === strpos($result, $__BOM)) $result = substr($result, 3);
        $result = json_decode($result);
    } else {
        echo 'Ошибка доступа к сервису !';
    }

    curl_close($ch);
}
