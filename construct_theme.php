<?php
if ($theme = opendir('theme')) {
    while (($block = readdir($theme)) !== false) {
        if (!in_array($block, ['.', '..'])) {
            $blocks[] = $block;
        }
    }
    sort($blocks);
    foreach ($blocks as $block) {
        require_once 'theme/' . $block;
    }
}