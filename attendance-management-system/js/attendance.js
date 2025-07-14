document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Set user email and current date
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Load dashboard data
    loadDashboardData();

    // Initialize attendance marking
    initAttendanceMarking();
});

function loadDashboardData() {
    const db = JSON.parse(localStorage.getItem('attendanceDB')) || { 
        students: [], 
        courses: [], 
        attendanceRecords: [] 
    };

    // Update quick stats
    document.getElementById('total-students').textContent = db.students.length;
    document.getElementById('total-courses').textContent = db.courses.length;

    // Calculate today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = db.attendanceRecords.filter(record => record.date === today);
    const presentToday = todayRecords.filter(record => record.status === 'present').length;
    const absentToday = todayRecords.filter(record => record.status === 'absent').length;

    document.getElementById('today-present').textContent = presentToday;
    document.getElementById('today-absent').textContent = absentToday;

    // Load recent attendance
    loadRecentAttendance(db.attendanceRecords.slice(0, 10));

    // Load courses for dropdown
    loadCourseSelect(db.courses);
}

function loadRecentAttendance(records) {
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.studentId}</td>
            <td>${record.studentName}</td>
            <td>${record.course}</td>
            <td>${record.date}</td>
            <td class="status-${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</td>
            <td>
                <button class="btn btn-small btn-primary">Edit</button>
                <button class="btn btn-small btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadCourseSelect(courses) {
    const select = document.getElementById('course-select');
    select.innerHTML = '<option value="">-- Select Course --</option>';
    
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        select.appendChild(option);
    });
}

function initAttendanceMarking() {
    const db = JSON.parse(localStorage.getItem('attendanceDB')) || { 
        students: [], 
        courses: [], 
        attendanceRecords: [] 
    };

    document.getElementById('load-students-btn').addEventListener('click', function() {
        const courseId = document.getElementById('course-select').value;
        const date = document.getElementById('date-input').value;

        if (!courseId || !date) {
            alert('Please select a course and date');
            return;
        }

        const course = db.courses.find(c => c.id === courseId);
        const courseStudents = db.students.filter(student => 
            student.coursesEnrolled.includes(courseId)
        );

        displayStudentList(courseStudents, course.name, date);
    });

    document.getElementById('submit-attendance-btn').addEventListener('click', function() {
        const date = document.getElementById('date-input').value;
        const courseId = document.getElementById('course-select').value;
        const course = db.courses.find(c => c.id === courseId);
        
        const attendanceRecords = [];
        const studentItems = document.querySelectorAll('.student-item');
        
        studentItems.forEach(item => {
            const studentId = item.dataset.studentId;
            const studentName = item.querySelector('.student-name').textContent;
            const status = item.querySelector('.toggle-option.selected').dataset.status;
            
            attendanceRecords.push({
                studentId,
                studentName,
                course: course.name,
                date,
                status
            });
        });

        // Save to database
        db.attendanceRecords = [...db.attendanceRecords, ...attendanceRecords];
        localStorage.setItem('attendanceDB', JSON.stringify(db));
        
        alert('Attendance submitted successfully!');
        loadDashboardData();
        document.getElementById('student-list-container').style.display = 'none';
    });
}

function displayStudentList(students, courseName, date) {
    const container = document.getElementById('student-list');
    container.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.dataset.studentId = student.id;

        studentItem.innerHTML = `
            <div class="student-info">
                <span class="student-name">${student.name}</span>
            </div>
            <div class="student-actions">
                <div class="attendance-toggle">
                    <div class="toggle-option selected" data-status="present">Present</div>
                    <div class="toggle-option" data-status="absent">Absent</div>
                </div>
            </div>
        `;

        container.appendChild(studentItem);
    });

    // Add toggle functionality
    document.querySelectorAll('.toggle-option').forEach(option => {
        option.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.toggle-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    document.getElementById('student-list-container').style.display = 'block';
}