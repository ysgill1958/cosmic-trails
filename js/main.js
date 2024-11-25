// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    mobileMenu.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for Fade-in Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Portfolio Image Loading and Gallery
const portfolioGrid = document.querySelector('.portfolio-grid');

// Sample portfolio items - Replace with actual images
const portfolioItems = [
    {
        title: 'Milky Way Galaxy',
        image: 'images/portfolio/milky-way.jpg',
        description: 'Capturing the heart of our galaxy'
    },
    {
        title: 'Northern Lights',
        image: 'images/portfolio/aurora.jpg',
        description: 'Aurora Borealis in all its glory'
    },
    {
        title: 'Deep Sky Objects',
        image: 'images/portfolio/nebula.jpg',
        description: 'Exploring distant nebulae'
    }
    // Add more portfolio items as needed
];

// Load portfolio items
function loadPortfolio() {
    portfolioItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());

    try {
        // Replace with actual form submission endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        if (response.ok) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        alert('There was an error sending your message. Please try again later.');
        console.error('Error:', error);
    }
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', loadPortfolio);

// Add scroll-based parallax effect to hero section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Workshop Registration Modal
function createWorkshopModal() {
    const modal = document.createElement('div');
    modal.className = 'workshop-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Register for Workshop</h2>
            <form id="workshop-form">
                <input type="text" name="name" placeholder="Your Name" required>
                <input type="email" name="email" placeholder="Your Email" required>
                <select name="workshop" required>
                    <option value="">Select Workshop</option>
                    <option value="basics">Astrophotography Basics</option>
                    <option value="advanced">Advanced Techniques</option>
                    <option value="post-processing">Post-Processing</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    return modal;
}

// Initialize workshop modal
const workshopModal = createWorkshopModal();

// Add click handlers for workshop registration buttons
document.querySelectorAll('.register-workshop').forEach(button => {
    button.addEventListener('click', () => {
        workshopModal.style.display = 'block';
    });
});

// News Section
const newsContainer = document.getElementById('news-container');
const newsFilters = document.querySelectorAll('.news-filter');
let currentFilter = 'all';

// RSS Feed URLs
const NASA_FEED = 'https://www.nasa.gov/feeds/iotd-feed/';
const SPACE_FEED = 'https://www.space.com/feeds/all';

// Function to parse RSS feed using RSS2JSON API (more reliable than direct RSS parsing)
async function fetchRSSFeed(url) {
    try {
        const rss2jsonAPI = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await fetch(rss2jsonAPI);
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.items.map(item => ({
                title: item.title,
                link: item.link,
                description: item.description
                    .replace(/<[^>]*>/g, '')
                    .substring(0, 150) + '...',
                pubDate: item.pubDate,
                image: item.enclosure?.link || item.thumbnail || 'images/default-news.jpg'
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to create news card
function createNewsCard(item, source) {
    const card = document.createElement('article');
    card.className = 'news-item';
    card.dataset.source = source;

    card.innerHTML = `
        <img src="${item.image || 'images/news-placeholder.jpg'}" alt="${item.title}" loading="lazy">
        <div class="news-content">
            <span class="news-source">${source.toUpperCase()}</span>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-date">${formatDate(item.pubDate)}</p>
            <p class="news-excerpt">${item.description}</p>
            <a href="${item.link}" class="news-link" target="_blank" rel="noopener noreferrer">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;

    return card;
}

// Function to load news
async function loadNews() {
    newsContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading latest astronomy news...</p>
        </div>
    `;

    try {
        const [nasaNews, spaceNews] = await Promise.all([
            fetchRSSFeed(NASA_FEED),
            fetchRSSFeed(SPACE_FEED)
        ]);

        const allNews = [
            ...nasaNews.map(item => ({ ...item, source: 'nasa' })),
            ...spaceNews.map(item => ({ ...item, source: 'space' }))
        ].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        newsContainer.innerHTML = '';
        
        allNews.forEach(item => {
            if (currentFilter === 'all' || currentFilter === item.source) {
                const card = createNewsCard(item, item.source);
                newsContainer.appendChild(card);
            }
        });

        if (newsContainer.children.length === 0) {
            newsContainer.innerHTML = '<p class="no-news">No news articles found.</p>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = '<p class="error-message">Failed to load news. Please try again later.</p>';
    }
}

// Event listeners for news filters
newsFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        newsFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        currentFilter = filter.dataset.source;
        loadNews();
    });
});

// Load news when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

// Smart Recommendations System
const recommendations = {
    gallery: {
        icon: 'fa-camera',
        title: 'Professional Astrophotography Services',
        description: 'Discover our premium astrophotography services at Cosmic Trails.',
        url: 'https://www.cosmictrails.in/services'
    },
    workshops: {
        icon: 'fa-chalkboard-teacher',
        title: 'Learn Astrophotography',
        description: 'Join our expert-led workshops to master astrophotography techniques.',
        url: 'https://www.cosmictrails.in/workshops'
    },
    equipment: {
        icon: 'fa-telescope',
        title: 'Professional Equipment',
        description: 'Explore our top-tier astrophotography equipment and setups.',
        url: 'https://www.cosmictrails.in/equipment'
    },
    blog: {
        icon: 'fa-blog',
        title: 'Astrophotography Blog',
        description: 'Read our latest articles and tips on astrophotography.',
        url: 'https://www.cosmictrails.in/blog'
    }
};

const recommendationPopup = document.getElementById('recommendation-popup');
const closeRecommendation = document.querySelector('.close-recommendation');
const remindLater = document.querySelector('.remind-later');
const recommendationBody = document.querySelector('.recommendation-body');

let userInterests = new Set();
let popupShown = false;

// Track user interests based on section visibility
const observeUserInterests = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target.id;
                userInterests.add(section);
                
                // Show recommendation after user has shown interest in at least 2 sections
                if (userInterests.size >= 2 && !popupShown && !localStorage.getItem('hideRecommendations')) {
                    showRecommendations();
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all main sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
};

// Create recommendation items based on user interests
const createRecommendationItems = () => {
    let items = '';
    const relevantRecommendations = Object.entries(recommendations)
        .filter(([key]) => userInterests.has(key))
        .slice(0, 2);

    relevantRecommendations.forEach(([_, rec]) => {
        items += `
            <div class="recommendation-item">
                <i class="fas ${rec.icon}"></i>
                <div class="recommendation-text">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `;
    });

    return items;
};

// Show recommendations popup
const showRecommendations = () => {
    if (popupShown || localStorage.getItem('hideRecommendations')) return;

    recommendationBody.innerHTML = createRecommendationItems();
    recommendationPopup.classList.add('show');
    popupShown = true;
};

// Event Listeners
closeRecommendation.addEventListener('click', () => {
    recommendationPopup.classList.remove('show');
});

remindLater.addEventListener('click', () => {
    recommendationPopup.classList.remove('show');
    // Hide recommendations for 24 hours
    localStorage.setItem('hideRecommendations', Date.now() + (24 * 60 * 60 * 1000));
});

// Initialize recommendation system
document.addEventListener('DOMContentLoaded', () => {
    // Clear expired hide recommendation setting
    const hideUntil = localStorage.getItem('hideRecommendations');
    if (hideUntil && Number(hideUntil) < Date.now()) {
        localStorage.removeItem('hideRecommendations');
    }
    
    observeUserInterests();
});
