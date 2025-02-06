document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('loginMessage');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }
        
        localStorage.setItem('username', username);
        localStorage.setItem('token', result.token);
        messageElement.innerHTML = '<span class="text-success">Login successful!</span>';
        setTimeout(() => {
            window.location.href = 'chat.html'; // Redirect to chat page
        }, 2000);
    } catch (error) {
        messageElement.innerHTML = `<span class="text-danger">${error.message}</span>`;
    }
});
