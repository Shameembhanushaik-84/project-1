document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Initialize database if not exists
    initializeDatabase();

    // Signup button click handler
    signupBtn.addEventListener('click', handleSignup);

    // Login button click handler
    loginBtn.addEventListener('click', handleLogin);

    function initializeDatabase() {
        if (!localStorage.getItem('attendanceDB')) {
            localStorage.setItem('attendanceDB', JSON.stringify({
                users: [],
                attendanceRecords: []
            }));
        }
    }

    function handleSignup() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const db = JSON.parse(localStorage.getItem('attendanceDB'));
        
        // Check if user exists
        if (db.users.some(user => user.email === email)) {
            alert('User already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            email,
            password, // Note: In production, hash this password
            createdAt: new Date().toISOString()
        };
        
        // Save user
        db.users.push(newUser);
        localStorage.setItem('attendanceDB', JSON.stringify(db));
        
        // Log in the user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Debugging: Check if we reach this point
        console.log('Signup successful, redirecting...');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }

    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const db = JSON.parse(localStorage.getItem('attendanceDB'));
        const user = db.users.find(user => user.email === email);
        
        if (!user) {
            alert('User not found');
            return;
        }
        
        if (user.password !== password) {
            alert('Incorrect password');
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    }
});