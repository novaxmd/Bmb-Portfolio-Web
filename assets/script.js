(function() {
    const linkRelList = document.createElement("link").relList;
    if (linkRelList && linkRelList.supports && linkRelList.supports("modulepreload")) return;
    
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        preloadModule(link);
    }
    
    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === "LINK" && node.rel === "modulepreload") {
                        preloadModule(node);
                    }
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });

    function getFetchOptions(link) {
        const options = {};
        if (link.integrity) options.integrity = link.integrity;
        if (link.referrerPolicy) options.referrerPolicy = link.referrerPolicy;
        
        if (link.crossOrigin === "use-credentials") {
            options.credentials = "include";
        } else if (link.crossOrigin === "anonymous") {
            options.credentials = "omit";
        } else {
            options.credentials = "same-origin";
        }
        
        return options;
    }

    function preloadModule(link) {
        if (link.ep) return;
        link.ep = true;
        
        const options = getFetchOptions(link);
        fetch(link.href, options);
    }
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(event) {
        event.preventDefault();
        const targetId = this.getAttribute("href");
        document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
    });
});

// Button animation elements
const buttonText = document.getElementById("button-text");
const buttonImg = document.getElementById("button-img");
const sendButton = document.getElementById("send-button");

// Form inputs
const formInputs = document.querySelectorAll("#contact-form input, #contact-form textarea");

// Check form inputs to enable/disable send button
function checkFormInputs() {
    for (let input of formInputs) {
        if (input.value.length > 0) {
            sendButton.disabled = false;
            sendButton.style.cursor = "pointer";
            return;
        }
    }
    sendButton.disabled = true;
    sendButton.style.cursor = "not-allowed";
}

// Setup intersection observer for animations
function observeElements(selector, options = {}) {
    let elements = document.querySelectorAll(selector);
    elements = Array.from(elements);
    
    elements.forEach(element => {
        observeElement(element, options);
    });
}

function observeElement(element, options) {
    if (!("IntersectionObserver" in window)) {
        // Fallback if IntersectionObserver not supported
        if (options.callback) {
            options.callback(element);
        } else {
            element.classList.add("active");
        }
        return;
    }
    
    new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (options.callback) {
                    options.callback(element);
                } else {
                    entry.target.classList.add("animated");
                }
                observer.unobserve(entry.target);
            }
        });
    }, options).observe(element);
}

// Observe elements for animations
observeElements(".stack-header", { rootMargin: "-100px" });
observeElements(".tech", { rootMargin: "-20px" });
observeElements(".animateFromLeft", { rootMargin: "-20px" });
observeElements(".animateFromRight", { rootMargin: "-20px" });
observeElements(".animateFadeIn", { rootMargin: "-20px" });
observeElements(".animateFadeBottom", { rootMargin: "-20px" });

// Event listeners
formInputs.forEach(input => input.addEventListener("input", checkFormInputs));

sendButton.addEventListener("mouseover", function() {
    buttonText.style.transform = "translateX(-20px)";
    buttonText.style.transition = "all 0.35s ease";
    buttonImg.style.transition = "all 0.3s ease";
    buttonImg.style.transform = "translateX(70px)";
    buttonImg.style.opacity = 1;
});

sendButton.addEventListener("mouseleave", function() {
    buttonText.style.transform = "translateX(0px)";
    buttonImg.style.opacity = 0;
    buttonImg.style.transform = "translateX(50px)";
});

sendButton.addEventListener("click", function() {
    buttonText.style.transform = "translateX(0px)";
    buttonImg.style.transition = "all 0.8s ease";
    buttonImg.style.opacity = 1;
    buttonImg.style.transform = "translateX(150px)";
    buttonImg.style.opacity = 0;
});