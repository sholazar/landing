<?php
if ($scripts_folder = opendir('js')) {
    while (($script = readdir($scripts_folder)) !== false) {
        if (!in_array($script, ['.', '..'])) {
            $scripts[] = $script;
        }
    }
    sort($scripts);
    foreach ($scripts as $script) {
        print '<script type="text/javascript" src="js/' . $script .'"></script>';
    }
}