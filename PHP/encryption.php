<?php
/**
 * Author/s: Carl Joshua Lalwet
 */
    
    $secretKey = hex2bin('b36cdff9bdaeb3dbd39c4d308eaff2ca524f27b4f9db9071e4f2248e51989a43');
    function encryptString($message, $key) {
        $cipher = "aes-256-ecb";
        $options = OPENSSL_RAW_DATA;
        $encrypted = openssl_encrypt($message, $cipher, $key, $options, '');
        return base64_encode($encrypted);
    }
?>
