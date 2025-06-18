<?php
// Archivo para manejar el envío de formularios de contacto
// Configuración de codificación UTF-8
header('Content-Type: text/plain; charset=UTF-8');

// Solo aceptar métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "Acceso no autorizado.";
    exit;
}

// ========================================
// CONFIGURACIÓN - MODIFICA ESTOS VALORES
// ========================================

// Correo de destino donde se recibirán los mensajes
$correo_destino = "ssilva@training-360.cl"; // CAMBIAR POR TU CORREO DE DESTINO

// Correo de origen para las cabeceras (no-reply)
$correo_origen = "no-reply@tudominio.cl"; // CAMBIAR POR TU DOMINIO

// ========================================
// PROCESAMIENTO DEL FORMULARIO
// ========================================

// Para debugging - verificar que se reciban los datos
if (empty($_POST)) {
    echo "No se recibieron datos del formulario.";
    exit;
}

// Leer todos los campos del formulario con valores por defecto
$nombre = $_POST['name'] ?? 'No especificado';
$email = $_POST['email'] ?? 'No especificado';
$telefono = $_POST['phone'] ?? 'No especificado';
$empresa = $_POST['company'] ?? 'No especificada';
$servicio = $_POST['service'] ?? 'No especificado';
$mensaje = $_POST['message'] ?? 'Sin mensaje';
$asunto_form = $_POST['asunto'] ?? 'Formulario de contacto';

// Validación básica
if (empty($nombre) || empty($email) || empty($telefono)) {
    echo "Faltan campos obligatorios.";
    exit;
}

// Por ahora, simular envío exitoso para testing
// Comentar las siguientes líneas cuando tengas configurado el servidor de correo
echo "Mensaje enviado correctamente.";
exit;

// Código original del envío de correo (descomentarlo cuando tengas servidor de correo)
/*

// Armar el asunto codificado en UTF-8 (MIME Base64)
$subject_raw = "Nuevo mensaje de contacto - " . $asunto_form;
$subject = "=?UTF-8?B?".base64_encode($subject_raw)."?=";

// Armar el cuerpo del mensaje en texto plano UTF-8
$cuerpo = "NUEVO MENSAJE DE CONTACTO\n";
$cuerpo .= "========================\n\n";
$cuerpo .= "Nombre: " . $nombre . "\n";
$cuerpo .= "Email: " . $email . "\n";
$cuerpo .= "Teléfono: " . $telefono . "\n";
$cuerpo .= "Empresa: " . $empresa . "\n";
$cuerpo .= "Servicio de interés: " . $servicio . "\n\n";
$cuerpo .= "Mensaje:\n";
$cuerpo .= "--------\n";
$cuerpo .= $mensaje . "\n\n";
$cuerpo .= "========================\n";
$cuerpo .= "Enviado desde: " . $_SERVER['HTTP_HOST'] . "\n";
$cuerpo .= "Fecha: " . date('d/m/Y H:i:s') . "\n";

// Configurar las cabeceras del correo
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: " . $correo_origen . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Intentar enviar el correo
$envio_exitoso = mail($correo_destino, $subject, $cuerpo, $headers);

// Devolver respuesta según el resultado
if ($envio_exitoso) {
    echo "Mensaje enviado correctamente.";
} else {
    echo "Error al enviar el correo. Intenta más tarde.";
}

?>