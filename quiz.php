<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $subjectId = $_GET['subjectId'];

    $stmt = $conn->prepare("SELECT * FROM quiz_questions WHERE subject_id = ?");
    $stmt->execute([$subjectId]);
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as &$question) {
        $question['options'] = json_decode($question['options']);
    }

    echo json_encode($questions);
}
?>
