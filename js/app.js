/**
 * Define Global Variables
*/
let sectionEle = document.querySelectorAll('section');
let ulElement = document.querySelector('ul');
let currentActive;

let debounce = false;
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
/**
 *@description Helper Function that adds active class/higlight to the nav link related to the section in viewport
 * @param {Event} e - Contains event information
*/
const handleAnchorChange = (e) => {
	e.preventDefault();

	// get the element hash and remove the #
	const id = e.target.hash.slice(1);

	// call to function that handles automatic scroll to selected section
	scrollToSection(id);

	// remove the active class from the previous active section
	document.getElementById(currentActive).classList.remove('active');

	// add the active class to the current section
	document.getElementById(id).classList.add('active');

	// remove the existing active class on the link
	document
		.querySelector(`a[href='#${currentActive}']`)
		.classList.remove('active');

	// set a new active class to the current link
	document.querySelector(`a[href='#${id}']`).classList.add('active');
	currentActive = id;
};

/**
 *@description Helper Function that creates li elements
 * @param {string} id - Hash value of the anchor tag inside the created li element
 * @param {string} label - text of the anchor tag inside of the created li element
*/
const createLI = (id, label) => {
	const li = document.createElement('li');
	li.innerHTML = `<a href="#${id}">${label}</a>`;
	return li;
};

/**
 *@description Helper Function that automatically scrolls to page section when its corresponding nav link is clicked
 * @param {targetId} id - id attribute of the section element
*/
const scrollToSection = (targetID) => {

	// get the target element
	const targetAnchor = document.getElementById(targetID);
	if (!targetAnchor) return;

	// get the distance of this element from the top
	const originalTop = Math.floor(targetAnchor.getBoundingClientRect().top);

	// use the scrollby window method to scroll to the given top
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	// prevent scroll event check
	debounce = true;

	// enable scrool after 1 seconds
	setTimeout(() => {
		debounce = false;
	}, 1000);
};

/**
 *@description Helper Function that checks if element is in the viewport
 * @param {HTMLElement} element - html section element
*/
const isSectionInViewPort = (element) => {
	const bounding = element.getBoundingClientRect();
	let inViewPort = (
		(bounding.top >= 0 || bounding.top <= 0) &&
		bounding.left >= 0 &&
		bounding.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		bounding.right <=
			(window.innerWidth || document.documentElement.clientWidth)
	);
	return inViewPort;
};
/**
 * End Helper Functions
*/
// build the nav
sectionEle.forEach((node, index) => {
	const id = node.getAttribute('id');
	const label = node.getAttribute('data-nav');
	const newListItem = createLI(id, label);
	if (index === 0) {
		currentActive = id;
	}
	// append the created li to the ul element
	ulElement.appendChild(newListItem);
});

// Add class 'active' to section when near top of viewport
const linkItems = document.querySelectorAll('a[href^="#"]');
linkItems.forEach((link, index) => {
	// add active class to the first link
	if (index === 0) {
		link.classList.add('active');
	}
	link.addEventListener('click', handleAnchorChange);
});

// handler function to update the navbar on scroll
const initNavUpdate = () => {
	let lastElTop = -20;
	const windowWidth = window.innerWidth;
	sectionEle.forEach((section) => {
		inViewPort = isSectionInViewPort(section);
		
		if (inViewPort) {
			const id = section.getAttribute('id');
			// remove initial active nav
			document
				.querySelector(`a[href='#${currentActive}']`)
				.classList.remove('active');

			// add new active nav
			document.querySelector(`a[href='#${id}']`).classList.add('active');
			// udate current active
			currentActive = id;
		}
	});
};

// window event listener for scroll event
let checks = false;
window.addEventListener('scroll', () => {
	if (!checks && !debounce) {
		window.requestAnimationFrame(() => {
			initNavUpdate();
			ticking = false;
		});
		ticking = true;
	}
});
