document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('signupMessage');

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, firstname, lastname, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Signup failed');
        }

        messageElement.innerHTML = '<span class="text-success">Signup successful!</span>';
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000);
    } catch (error) {
        messageElement.innerHTML = `<span class="text-danger">${error.message}</span>`;
    }
});
