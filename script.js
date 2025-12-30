
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('form-message');
    const originalBtnText = submitBtn.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    messageDiv.style.display = 'none';
    
    try {
        // Send data to Django backend
        const response = await fetch('http://127.0.0.1:8000/api/contact/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Success message
            messageDiv.textContent = data.message || 'Thank you for your message! I\'ll get back to you soon.';
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(99, 102, 241, 0.2)';
            messageDiv.style.color = 'var(--primary-color)';
            messageDiv.style.border = '1px solid var(--primary-color)';
            
            // Reset form
            form.reset();
        } else {
            // Error message
            messageDiv.textContent = data.error || 'Something went wrong. Please try again.';
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(239, 68, 68, 0.2)';
            messageDiv.style.color = '#ef4444';
            messageDiv.style.border = '1px solid #ef4444';
        }
    } catch (error) {
        // Network or other error
        messageDiv.textContent = 'Unable to send message. Please check your connection and try again.';
        messageDiv.style.display = 'block';
        messageDiv.style.background = 'rgba(239, 68, 68, 0.2)';
        messageDiv.style.color = '#ef4444';
        messageDiv.style.border = '1px solid #ef4444';
        console.error('Error:', error);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});