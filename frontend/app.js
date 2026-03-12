// 1. DATA: The Profiles
const profileData = [
    { id: 1, name: "Chloe", age: 22, bio: "Digital artist & gamer", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" },
    { id: 2, name: "Sarah", age: 24, bio: "Architect & traveler", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { id: 3, name: "Maya", age: 23, bio: "Vinyl records and rainy days", img: "https://images.unsplash.com/photo-1531746020798-e795c5399c7c" },
    { id: 4, name: "Jessica", age: 26, bio: "Coffee addict. Dog mom.", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9" }
];

const stack = document.getElementById('card-stack');

// 2. GENERATE CARDS
function initApp() {
    profileData.forEach((profile, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.zIndex = profileData.length - index;
        
        card.innerHTML = `
            <img src="${profile.img}?auto=format&fit=crop&w=600&q=80" alt="${profile.name}">
            <div class="card-info">
                <h2>${profile.name}, ${profile.age}</h2>
                <p>${profile.bio}</p>
            </div>
        `;
        
        stack.appendChild(card);
        setupHammer(card);
    });
}

// 3. SWIPE LOGIC
function setupHammer(el) {
    const hammertime = new Hammer(el);

    hammertime.on('pan', (event) => {
        el.style.transition = 'none';
        let rotation = event.deltaX / 10;
        el.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotation}deg)`;
    });

    hammertime.on('panend', (event) => {
        el.style.transition = 'transform 0.5s ease-out';
        
        // Threshold: If dragged more than 120px, fly away
        if (Math.abs(event.deltaX) > 120) {
            let flyX = event.deltaX > 0 ? 1000 : -1000;
            el.style.transform = `translate(${flyX}px, ${event.deltaY}px) rotate(${flyX/10}deg)`;
            setTimeout(() => el.remove(), 300);
            console.log(event.deltaX > 0 ? "Liked!" : "Passed.");
        } else {
            // Snap back to center
            el.style.transform = '';
        }
    });
}

// 4. BUTTON CLICKS
function handleBtnClick(isLike) {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;
    
    const topCard = cards[0];
    let flyX = isLike ? 1000 : -1000;
    topCard.style.transition = 'transform 0.6s ease-in';
    topCard.style.transform = `translate(${flyX}px, 0px) rotate(${flyX/20}deg)`;
    
    setTimeout(() => topCard.remove(), 400);
}

initApp();