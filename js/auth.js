document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử DOM
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
    
    // Get switch links
    const switchToRegister = document.querySelector('.switch-to-register');
    const switchToLogin = document.querySelector('.switch-to-login');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // Xử lý chuyển đổi tab
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Cập nhật trạng thái active cho tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Hiển thị form tương ứng
            const targetForm = this.dataset.tab;
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Function to switch between forms
    function switchForm(formToShow) {
        // Hide all forms and remove active class from all tabs
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        forgotPasswordForm.classList.remove('active');
        loginTab.classList.remove('active');
        registerTab.classList.remove('active');

        // Show selected form and activate corresponding tab
        if (formToShow === 'login') {
            loginForm.classList.add('active');
            loginTab.classList.add('active');
        } else if (formToShow === 'register') {
            registerForm.classList.add('active');
            registerTab.classList.add('active');
        } else if (formToShow === 'forgot-password') {
            forgotPasswordForm.classList.add('active');
        }
    }

    // Add click event listeners to switch links
    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('register');
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('login');
    });

    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('forgot-password');
    });

    // Add click event listeners to tabs
    loginTab.addEventListener('click', function() {
        switchForm('login');
    });

    registerTab.addEventListener('click', function() {
        switchForm('register');
    });

    // Xử lý đăng ký
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Kiểm tra mật khẩu
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra email đã tồn tại
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            alert('Email đã được sử dụng!');
            return;
        }

        // Tạo tài khoản mới
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password, // Trong thực tế nên mã hóa mật khẩu
            createdAt: new Date().toLocaleString('vi-VN')
        };

        // Lưu vào localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Hiển thị thông báo thành công
        alert('Đăng ký thành công! Vui lòng đăng nhập.');

        // Chuyển sang tab đăng nhập
        document.querySelector('[data-tab="login"]').click();

        // Xóa form đăng ký
        registerForm.reset();
    });

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Kiểm tra thông tin đăng nhập
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Lưu thông tin người dùng đăng nhập
            const currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            // Hiển thị thông báo thành công
            alert('Đăng nhập thành công!');

            // Chuyển hướng về trang chủ
            window.location.href = 'index.html';
        } else {
            alert('Email hoặc mật khẩu không đúng!');
        }
    });

    // Kiểm tra người dùng đã đăng nhập
    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            // Chuyển hướng về trang chủ nếu đã đăng nhập
            window.location.href = 'index.html';
        }
    }

    // Gọi hàm kiểm tra đăng nhập
    checkLoggedInUser();

    // Handle forgot password form submission
    const forgotPasswordFormElement = document.getElementById('forgotPasswordForm');
    const codeError = document.getElementById('code-error');

    forgotPasswordFormElement.addEventListener('submit', function(e) {
        e.preventDefault();

        const verificationCode = document.getElementById('verification-code').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
            codeError.textContent = 'Mật khẩu xác nhận không khớp!';
            codeError.classList.add('show');
            return;
        }

        // Check verification code
        if (verificationCode === '123456') {
            // Success - show message and switch to login form
            alert('Bạn đã cập nhật lại mật khẩu thành công!');
            switchForm('login');
            // Clear the form
            forgotPasswordFormElement.reset();
            codeError.classList.remove('show');
        } else {
            // Show error message
            codeError.textContent = 'Mã xác nhận không đúng!';
            codeError.classList.add('show');
        }
    });

    // Form validation and submission
    const loginFormElement = document.getElementById('loginForm');
    const registerFormElement = document.getElementById('registerForm');

    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your login logic here
        console.log('Login form submitted');
    });

    registerFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your registration logic here
        console.log('Register form submitted');
    });
}); 