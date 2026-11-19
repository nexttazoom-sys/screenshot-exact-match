<?php
/**
 * Endpoint SMTP SSL/TLS nativo para cPanel / Apache (public_html/api/send-lead-email.php)
 * Victoria Yañez Asesorías - Envío vía solu33.tuwebdns.net:465
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, apikey, x-client-info");
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

function loadEnvFile($path) {
    if (!is_readable($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) return;
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === "" || strpos($line, "#") === 0 || strpos($line, "=") === false) continue;
        list($k, $v) = explode("=", $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\n\r\0\x0B\"'");
        if ($k !== "" && $v !== "") {
            putenv("$k=$v");
            $_ENV[$k] = $v;
            $_SERVER[$k] = $v;
        }
    }
}

loadEnvFile(__DIR__ . "/.env");
loadEnvFile(__DIR__ . "/.env.local");
loadEnvFile(__DIR__ . "/../.env");
loadEnvFile(__DIR__ . "/../.env.local");
loadEnvFile(__DIR__ . "/../../.env");
loadEnvFile(__DIR__ . "/../../.env.local");

function getEnvVar($key, $default = "") {
    $val = getenv($key);
    if ($val !== false && trim($val) !== "") return trim($val, " \t\n\r\0\x0B\"'");
    if (!empty($_ENV[$key])) return trim((string)$_ENV[$key], " \t\n\r\0\x0B\"'");
    if (!empty($_SERVER[$key])) return trim((string)$_SERVER[$key], " \t\n\r\0\x0B\"'");
    return $default;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || empty($data["full_name"]) || empty($data["phone"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "code" => "VALIDATION_ERROR",
        "error" => "Nombre completo y teléfono son obligatorios."
    ]);
    exit;
}

$smtpHost = getEnvVar("SMTP_HOST", "solu33.tuwebdns.net");
$smtpPort = (int)getEnvVar("SMTP_PORT", "465");
$smtpUser = getEnvVar("SMTP_USER", "notificaciones@vyplanesisapre.cl");
$smtpPass = getEnvVar("SMTP_PASS", getEnvVar("SMTP_PASSWORD", getEnvVar("VITE_SMTP_PASS", "")));

if ($smtpPass === "") {
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "code" => "MISSING_SMTP_SECRET",
        "host" => $smtpHost,
        "port" => $smtpPort,
        "user" => $smtpUser,
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
$rawEmail = trim((string)($data["email"] ?? ""));
$email = htmlspecialchars($rawEmail !== "" ? $rawEmail : "No informado", ENT_QUOTES, "UTF-8");

$rawSalary = $data["salary"] ?? "";
if (is_numeric($rawSalary) && (float)$rawSalary > 0) {
    $salaryNum = (float)$rawSalary;
    $salaryFormatted = "$" . number_format($salaryNum, 0, ",", ".");
    $sevenPctNum = isset($data["estimated_seven_percent"]) && is_numeric($data["estimated_seven_percent"])
        ? (float)$data["estimated_seven_percent"]
        : round($salaryNum * 0.07);
    $sevenPctFormatted = "$" . number_format($sevenPctNum, 0, ",", ".");
} else {
    $salaryFormatted = htmlspecialchars((string)($rawSalary ?: "No especificada"), ENT_QUOTES, "UTF-8");
    $sevenPctFormatted = "No calculado";
}

$dependents = htmlspecialchars((string)($data["dependents"] ?? "0"), ENT_QUOTES, "UTF-8");
$isapre = htmlspecialchars((string)($data["isapre_interest"] ?? "Por evaluar en asesoría"), ENT_QUOTES, "UTF-8");
$clinic = htmlspecialchars((string)($data["clinic_commune"] ?? "No especificada"), ENT_QUOTES, "UTF-8");
$prefTime = htmlspecialchars((string)($data["preferred_time"] ?? "Cualquier horario"), ENT_QUOTES, "UTF-8");
$mainQuestion = htmlspecialchars((string)($data["main_question"] ?? "Evaluación de plan de salud"), ENT_QUOTES, "UTF-8");
$additionalMsg = htmlspecialchars((string)($data["additional_message"] ?? "Sin comentarios adicionales"), ENT_QUOTES, "UTF-8");
$selectedPlan = htmlspecialchars((string)($data["selected_plan"] ?? ""), ENT_QUOTES, "UTF-8");
$sentAt = htmlspecialchars((string)($data["sent_at"] ?? date("d/m/Y H:i:s")), ENT_QUOTES, "UTF-8");
$isTest = !empty($data["is_test"]);

$cleanDigits = preg_replace("/[^\d]/", "", (string)$data["phone"]);
$waUrl = "";
if ($cleanDigits !== "") {
    $waNumber = strpos($cleanDigits, "56") === 0 ? $cleanDigits : "56" . $cleanDigits;
    $waUrl = "https://wa.me/" . $waNumber;
}

$subject = "Nueva Solicitud de Asesoría Gratuita - " . $data["full_name"];
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
$encodedFromName = "=?UTF-8?B?" . base64_encode("Victoria Yañez Asesorías") . "?=";

$badgePrefix = $isTest ? "PRUEBA DE CONEXIÓN SMTP SSL/TLS · " : "";
$selectedPlanRow = $selectedPlan !== ""
    ? "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Plan / Escenario preseleccionado</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$selectedPlan}</td></tr>"
    : "";
$waButtonBlock = $waUrl !== ""
    ? "<div style='margin-top:22px;text-align:center;'><a href='{$waUrl}' style='display:inline-block;background-color:#E91E8C;color:#FFFFFF;font-weight:800;font-size:13px;padding:12px 24px;border-radius:999px;text-decoration:none;'>Contactar a {$fullName} por WhatsApp</a></div>"
    : "";

$htmlBody = "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><title>Nueva Solicitud de Asesoría Gratuita</title></head>"
    . "<body style='margin:0;padding:0;background-color:#F6F5FF;font-family:Segoe UI,Arial,sans-serif;color:#0A033C;'>"
    . "<table width='100%' cellpadding='0' cellspacing='0' style='background-color:#F6F5FF;padding:28px 16px;'><tr><td align='center'>"
    . "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:620px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;border:2px solid #E91E8C;box-shadow:0 12px 32px rgba(18,5,110,0.12);'>"
    . "<tr><td style='background:linear-gradient(135deg,#12056E 0%,#1B0994 100%);padding:26px 30px;color:#FFFFFF;border-bottom:4px solid #E91E8C;'>"
    . "<div style='font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#F01E8E;margin-bottom:6px;'>{$badgePrefix}VICTORIA YAÑEZ ASESORÍAS</div>"
    . "<h1 style='margin:0;font-size:22px;font-weight:800;color:#FFFFFF;line-height:1.3;'>Nueva Solicitud de Asesoría Gratuita</h1>"
    . "<p style='margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.86);'>Cliente: <strong>{$fullName}</strong> · Recibido el {$sentAt}</p>"
    . "</td></tr>"
    . "<tr><td style='padding:26px 30px;'>"
    . "<table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;font-size:14px;'>"
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;width:42%;'>Nombre completo</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:600;'>{$fullName}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Teléfono / WhatsApp</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#E91E8C;font-weight:800;'>{$phone}</td></tr>"
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Correo electrónico</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$email}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Renta imponible aprox.</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:700;'>{$salaryFormatted} <span style='color:#E91E8C;'>(7% est.: {$sevenPctFormatted}/mes)</span></td></tr>"
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Cargas familiares</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$dependents}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Isapre actual o de interés</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;font-weight:600;'>{$isapre}</td></tr>"
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Clínica / Comuna o Región</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$clinic}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Horario preferido</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$prefTime}</td></tr>"
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Motivo / Consulta principal</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$mainQuestion}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Mensaje o consulta adicional</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$additionalMsg}</td></tr>"
    . $selectedPlanRow
    . "<tr><td style='padding:11px 12px;font-weight:700;color:#12056E;'>Fecha y hora de envío</td><td style='padding:11px 12px;color:#0A033C;'>{$sentAt}</td></tr>"
    . "</table>"
    . $waButtonBlock
    . "</td></tr>"
    . "<tr><td style='background-color:#0A033C;padding:16px 30px;color:rgba(255,255,255,0.75);font-size:11px;text-align:center;'>"
    . "Notificación automática enviada vía SSL/TLS ({$smtpHost}:{$smtpPort}) desde <strong>{$smtpUser}</strong> · Victoria Yañez Asesorías"
    . "</td></tr></table></td></tr></table></body></html>";

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
    $transportUrl = ($smtpPort === 465 ? "ssl://" : "tcp://") . "{$smtpHost}:{$smtpPort}";
    $fp = @stream_socket_client($transportUrl, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        throw new Exception("No se pudo conectar a {$transportUrl} ($errstr)");
    }
    stream_set_timeout($fp, 20);

    $banner = smtpRead($fp);
    if (strpos($banner, "220") !== 0) {
        throw new Exception("Saludo SMTP inválido: " . trim($banner));
    }
    smtpCmd($fp, "EHLO vyplanesisapre.cl", 250);
    if ($smtpPort !== 465) {
        smtpCmd($fp, "STARTTLS", 220);
        stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        smtpCmd($fp, "EHLO vyplanesisapre.cl", 250);
    }
    smtpCmd($fp, "AUTH LOGIN", 334);
    smtpCmd($fp, base64_encode($smtpUser), 334);
    smtpCmd($fp, base64_encode($smtpPass), 235);
    smtpCmd($fp, "MAIL FROM:<{$smtpUser}>", 250);

    foreach ($recipients as $rcpt) {
        smtpCmd($fp, "RCPT TO:<{$rcpt}>", 250);
    }

    smtpCmd($fp, "DATA", 354);

    $messageId = "<" . time() . "-" . bin2hex(random_bytes(4)) . "@vyplanesisapre.cl>";
    $headers = [
        "Date: " . date("r"),
        "Message-ID: {$messageId}",
        "From: \"{$encodedFromName}\" <{$smtpUser}>",
        "To: " . implode(", ", $recipients),
    ];

    if ($rawEmail !== "" && $rawEmail !== "No informado" && strpos($rawEmail, "@") !== false && $rawEmail !== $smtpUser) {
        $headers[] = "Reply-To: <{$rawEmail}>";
    }

    $headers[] = "Subject: {$encodedSubject}";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/html; charset=UTF-8";
    $headers[] = "Content-Transfer-Encoding: base64";

    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody), 76, "\r\n") . "\r\n.";
    $queueRes = smtpCmd($fp, $message, 250);
    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);

    echo json_encode([
        "success" => true,
        "messageId" => $messageId,
        "queueResponse" => trim($queueRes),
        "host" => $smtpHost,
        "port" => $smtpPort,
        "secure" => $smtpPort === 465,
        "from" => "Victoria Yañez Asesorías <{$smtpUser}>",
        "recipients" => $recipients
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "code" => "SMTP_CONNECTION_ERROR",
        "error" => $e->getMessage()
    ]);
}
