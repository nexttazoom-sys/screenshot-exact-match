<?php
/**
 * Endpoint SMTP SSL/TLS directo para hosting externo (public_html/send-lead.php)
 * Victoria Yañez Asesorías - Envío autenticado vía solu33.tuwebdns.net:465
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, apikey, x-client-info");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    echo json_encode(["ok" => true, "success" => true]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "success" => false,
        "error" => "Método no permitido. Usa POST."
    ]);
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
loadEnvFile(__DIR__ . "/api/.env");
loadEnvFile(__DIR__ . "/../.env");
loadEnvFile(__DIR__ . "/../.env.local");

function getEnvVar($key, $default = "") {
    $val = getenv($key);
    if ($val !== false && trim($val) !== "") return trim($val, " \t\n\r\0\x0B\"'");
    if (!empty($_ENV[$key])) return trim((string)$_ENV[$key], " \t\n\r\0\x0B\"'");
    if (!empty($_SERVER[$key])) return trim((string)$_SERVER[$key], " \t\n\r\0\x0B\"'");
    return $default;
}

// Soportar tanto payload JSON como application/x-www-form-urlencoded o multipart/form-data
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

if (!is_array($data) || empty(trim((string)($data["full_name"] ?? ""))) || empty(trim((string)($data["phone"] ?? "")))) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "success" => false,
        "code" => "VALIDATION_ERROR",
        "error" => "Nombre completo y teléfono son obligatorios."
    ]);
    exit;
}

// Parámetros oficiales de la cuenta notificaciones@vyplanesisapre.cl
$smtpHost = getEnvVar("SMTP_HOST", "solu33.tuwebdns.net");
$smtpPort = (int)getEnvVar("SMTP_PORT", "465");
$smtpUser = getEnvVar("SMTP_USER", "notificaciones@vyplanesisapre.cl");
$smtpPass = getEnvVar("SMTP_PASS", getEnvVar("SMTP_PASSWORD", "Vicy@ases2029"));

$recipients = [
    "victoriayanezasesora@gmail.com",
    "victoriayanezasesora@vyplanesisapre.cl"
];

$fullNameRaw = trim((string)$data["full_name"]);
$phoneRaw = trim((string)$data["phone"]);
$rawEmail = trim((string)($data["email"] ?? ""));

$fullName = htmlspecialchars($fullNameRaw, ENT_QUOTES, "UTF-8");
$phone = htmlspecialchars($phoneRaw, ENT_QUOTES, "UTF-8");
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

$cleanDigits = preg_replace("/[^\d]/", "", $phoneRaw);
$waUrl = "";
if ($cleanDigits !== "") {
    $waNumber = strpos($cleanDigits, "56") === 0 ? $cleanDigits : "56" . $cleanDigits;
    $waUrl = "https://wa.me/" . $waNumber;
}

$subject = "Nueva Solicitud de Asesoría Gratuita - " . $fullNameRaw;
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
    . "<tr><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Clínica de preferencia / Comuna</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$clinic}</td></tr>"
    . "<tr style='background-color:#FAF9FF;'><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;font-weight:700;color:#12056E;'>Horario preferido de contacto</td><td style='padding:11px 12px;border-bottom:1px solid #ECEAF9;color:#0A033C;'>{$prefTime}</td></tr>"
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

function sendViaSmtpSocket($host, $port, $user, $pass, $recipients, $encodedFromName, $encodedSubject, $rawEmail, $htmlBody) {
    $ctx = stream_context_create([
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false,
            "allow_self_signed" => true
        ]
    ]);
    $transportUrl = ($port === 465 ? "ssl://" : "tcp://") . "{$host}:{$port}";
    $fp = @stream_socket_client($transportUrl, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        throw new Exception("No se pudo abrir socket a {$transportUrl} ($errstr)");
    }
    stream_set_timeout($fp, 20);

    try {
        $banner = smtpRead($fp);
        if (strpos($banner, "220") !== 0) {
            throw new Exception("Saludo SMTP inválido: " . trim($banner));
        }
        smtpCmd($fp, "EHLO vyplanesisapre.cl", 250);
        if ($port !== 465) {
            smtpCmd($fp, "STARTTLS", 220);
            stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            smtpCmd($fp, "EHLO vyplanesisapre.cl", 250);
        }
        smtpCmd($fp, "AUTH LOGIN", 334);
        smtpCmd($fp, base64_encode($user), 334);
        smtpCmd($fp, base64_encode($pass), 235);
        smtpCmd($fp, "MAIL FROM:<{$user}>", 250);

        foreach ($recipients as $rcpt) {
            smtpCmd($fp, "RCPT TO:<{$rcpt}>", 250);
        }

        smtpCmd($fp, "DATA", 354);

        $messageId = "<" . time() . "-" . bin2hex(random_bytes(4)) . "@vyplanesisapre.cl>";
        $headers = [
            "Date: " . date("r"),
            "Message-ID: {$messageId}",
            "From: \"{$encodedFromName}\" <{$user}>",
            "To: " . implode(", ", $recipients),
        ];

        if ($rawEmail !== "" && $rawEmail !== "No informado" && strpos($rawEmail, "@") !== false && $rawEmail !== $user) {
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

        return [
            "messageId" => $messageId,
            "queueResponse" => trim($queueRes),
            "host" => $host,
            "port" => $port
        ];
    } catch (Exception $e) {
        @fclose($fp);
        throw $e;
    }
}

$attempts = [
    ["host" => $smtpHost, "port" => $smtpPort],
    ["host" => "localhost", "port" => 465],
    ["host" => $smtpHost, "port" => 587],
];

$lastError = "";
foreach ($attempts as $attempt) {
    try {
        $result = sendViaSmtpSocket(
            $attempt["host"],
            (int)$attempt["port"],
            $smtpUser,
            $smtpPass,
            $recipients,
            $encodedFromName,
            $encodedSubject,
            $rawEmail,
            $htmlBody
        );

        echo json_encode([
            "ok" => true,
            "success" => true,
            "messageId" => $result["messageId"],
            "queueResponse" => $result["queueResponse"],
            "host" => $result["host"],
            "port" => $result["port"],
            "secure" => (int)$result["port"] === 465,
            "from" => "Victoria Yañez Asesorías <{$smtpUser}>",
            "recipients" => $recipients
        ]);
        exit;
    } catch (Exception $e) {
        if ($lastError === "") {
            $lastError = $e->getMessage();
        }
    }
}

// Respaldo final mediante mail() nativo del servidor si el hosting bloquea sockets salientes directos
if (function_exists("mail")) {
    $mailHeaders = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: \"{$encodedFromName}\" <{$smtpUser}>",
    ];
    if ($rawEmail !== "" && $rawEmail !== "No informado" && strpos($rawEmail, "@") !== false) {
        $mailHeaders[] = "Reply-To: {$rawEmail}";
    }
    $sentNative = @mail(implode(", ", $recipients), $encodedSubject, $htmlBody, implode("\r\n", $mailHeaders), "-f{$smtpUser}");
    if ($sentNative) {
        echo json_encode([
            "ok" => true,
            "success" => true,
            "messageId" => "<native-" . time() . "@vyplanesisapre.cl>",
            "host" => $smtpHost,
            "port" => $smtpPort,
            "secure" => true,
            "from" => "Victoria Yañez Asesorías <{$smtpUser}>",
            "recipients" => $recipients
        ]);
        exit;
    }
}

http_response_code(500);
echo json_encode([
    "ok" => false,
    "success" => false,
    "code" => "SMTP_CONNECTION_ERROR",
    "error" => $lastError !== "" ? $lastError : "No se pudo conectar al servidor SMTP {$smtpHost}:{$smtpPort}."
]);
