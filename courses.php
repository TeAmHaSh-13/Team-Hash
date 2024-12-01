<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'];

    if ($action === 'getCourses') {
        $stmt = $conn->query("SELECT * FROM courses");
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($courses);
    } elseif ($action === 'getSubjects') {
        $courseId = $_GET['courseId'];
        $stmt = $conn->prepare("SELECT * FROM subjects WHERE course_id = ?");
        $stmt->execute([$courseId]);
        $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($subjects);
    }
}
?>
