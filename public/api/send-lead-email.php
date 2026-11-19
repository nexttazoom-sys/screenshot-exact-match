<?php
/**
 * Endpoint SMTP SSL/TLS nativo para cPanel / Apache (public_html/api/send-lead-email.php)
 * Victoria Yañez Asesorías - Envío vía solu33.tuwebdns.net:465
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
    exit;
}

// Cargar variables desde archivo .env en public_html o directorio superior si existe
function loadEnvFile($path) {
    if (!is_readable($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === "" || strpos($line, "#") === 0 || strpos($line, "=") === false) continue;
        list($k, $v) = explode("=", $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\n\r\0\x0B\"'");
        if ($k !== "" && getenv($k) === false) {
            putenv("$k=$v");
            $_ENV[$k] = $v;
        }
    }
}

loadEnvFile(__DIR__ . "/../.env");
loadEnvFile(__DIR__ . "/../../.env");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || empty($data["full_name"]) || empty($data["phone"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Nombre completo y teléfono son obligatorios."]);
    exit;
}

$smtpHost = getenv("SMTP_HOST") ?: "solu33.tuwebdns.net";
$smtpPort = (int)(getenv("SMTP_PORT") ?: 465);
$smtpUser = getenv("SMTP_USER") ?: "notificaciones@vyplanesisapre.cl";
$smtpPass = getenv("SMTP_PASS") ?: "";

if ($smtpPass === "") {
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "code" => "MISSING_SMTP_SECRET",
        "error" => "Falta configurar SMTP_PASS en el archivo .env del servidor para autenticar $smtpUser en $smtpHost:$smtpPort."
    ]);
    exit;
}

$recipients = [
    "victoriayanezasesora@gmail.com",
    "victoriayanezasesora@vyplanesisapre.cl"
];

$fullName = htmlspecialchars((string)$data["full_name"], ENT_QUOTES, "UTF-8");
$phone = htmlspecialchars((string)$data["phone"], ENT_QUOTES, "UTF-8");
$email = htmlspecialchars((string)($data["email"] ?? "No informado"), ENT_QUOTES, "UTF-8");
$salary = htmlspecialchars((string)($data["salary"] ?? "No especificada"), ENT_QUOTES, "UTF-8");
$dependents = htmlspecialchars((string)($data["dependents"] ?? "0"), ENT_QUOTES, "UTF-8");
$isapre = htmlspecialchars((string)($data["isapre_interest"] ?? "Por evaluar"), ENT_QUOTES, "UTF-8");
$clinic = htmlspecialchars((string)($data["clinic_commune"] ?? "No especificada"), ENT_QUOTES, "UTF-8");
$prefTime = htmlspecialchars((string)($data["preferred_time"] ?? "Cualquier horario"), ENT_QUOTES, "UTF-8");
$mainQuestion = htmlspecialchars((string)($data["main_question"] ?? "Evaluación de plan de salud"), ENT_QUOTES, "UTF-8");
$additionalMsg = htmlspecialchars((string)($data["additional_message"] ?? "Sin comentarios adicionales"), ENT_QUOTES, "UTF-8");
$sentAt = htmlspecialchars((string)($data["sent_at"] ?? date("d/m/Y H:i:s")), ENT_QUOTES, "UTF-8");

$subject = "Nueva Solicitud de Asesoría Gratuita - " . $data["full_name"];
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

$htmlBody = "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'></head><body style='font-family:Segoe UI,Arial,sans-serif;background:#F6F5FF;padding:24px;color:#0A033C;'>"
    . "<div style='max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:16px;border:2px solid #E91E8C;overflow:hidden;'>"
    . "<div style='background:#12056E;color:#FFFFFF;padding:22px 26px;border-bottom:4px solid #E91E8C;'>"
    . "<div style='font-size:11px;font-weight:800;color:#F01E8E;text-transform:uppercase;'>VICTORIA YAÑEZ ASESORÍAS</div>"
    . "<h2 style='margin:6px 0 0;font-size:20px;'>Nueva Solicitud de Asesoría Gratuita</h2>"
    . "</div>"
    . "<div style='padding:22px 26px;font-size:14px;line-height:1.6;'>"
    . "<p><strong>Nombre completo:</strong> {$fullName}</p>"
    . "<p><strong>Teléfono / WhatsApp:</strong> {$phone}</p>"
    . "<p><strong>Correo electrónico:</strong> {$email}</p>"
    . "<p><strong>Renta imponible aprox.:</strong> {$salary}</p>"
    . "<p><strong>Cargas familiares:</strong> {$dependents}</p>"
    . "<p><strong>Isapre actual o de interés:</strong> {$isapre}</p>"
    . "<p><strong>Clínica / Comuna:</strong> {$clinic}</p>"
    . "<p><strong>Horario preferido:</strong> {$prefTime}</p>"
    . "<p><strong>Motivo principal:</strong> {$mainQuestion}</p>"
    . "<p><strong>Mensaje adicional:</strong> {$additionalMsg}</p>"
    . "<p><strong>Fecha y hora:</strong> {$sentAt}</p>"
    . "</div></div></body></html>";

function smtpRead($fp) {
    $data = "";
    while ($str = fgets($fp, 515)) {
        $data .= $str;
        if (substr($str, 3, 1) === " ") break;
    }
    return $data;
}

function smtpCmd($fp, $cmd, $expectedCode) {
    fwrite($fp, $cmd . "\r\n");
    $res = smtpRead($fp);
    if (strpos($res, (string)$expectedCode) !== 0) {
        throw new Exception("Error SMTP ($expectedCode esperado): " . trim($res));
    }
    return $res;
}

try {
    $ctx = stream_context_create([
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false,
            "allow_self_signed" => true
        ]
    ]);
    $fp = @stream_socket_client("ssl://{$smtpHost}:{$smtpPort}", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        throw new Exception("No se pudo conectar a ssl://{$smtpHost}:{$smtpPort} ($errstr)");
    }

    smtpRead($fp);
    smtpCmd($fp, "EHLO vyplanesisapre.cl", 250);
    smtpCmd($fp, "AUTH LOGIN", 334);
    smtpCmd($fp, base64_encode($smtpUser), 334);
    smtpCmd($fp, base64_encode($smtpPass), 235);
    smtpCmd($fp, "MAIL FROM:<{$smtpUser}>", 250);

    foreach ($recipients as $rcpt) {
        smtpCmd($fp, "RCPT TO:<{$rcpt}>", 250);
    }

    smtpCmd($fp, "DATA", 354);

    $headers = [
        "Date: " . date("r"),
        "From: \"=?UTF-8?B?" . base64_encode("Victoria Yañez Asesorías") . "?=\" <{$smtpUser}>",
        "To: " . implode(", ", $recipients),
        "Subject: {$encodedSubject}",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64"
    ];

    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody)) . "\r\n.";
    smtpCmd($fp, $message, 250);
    fwrite($fp, "QUIT\r\n");
    fclose($fp);

    echo json_encode([
        "success" => true,
        "host" => $smtpHost,
        "port" => $smtpPort,
        "recipients" => $recipients
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
