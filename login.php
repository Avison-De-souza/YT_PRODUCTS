<?php
header('Content-Type: application/json');


$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');


if ($username === '') {
    echo json_encode(["success" => false, "message" => "Enter the name"]);
    exit;
}

if ($password === '') {
    echo json_encode(["success" => false, "message" => "Enter the password"]);
    exit;
}


$validUser = "admin";
$validPass = "1234";

if ($username === $validUser && $password === $validPass) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid username or password"]);
}
?>
