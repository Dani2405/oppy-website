const cover = document.querySelector("#cover");
const header = document.querySelector("#header");
const headerLogo = document.querySelector("#header-logo");
const headerNav = header.querySelector("nav");
const hamburger = header.querySelector("#hamburger");
const ctaTitle = document.querySelector("#cta-title");
const ctaButton = document.querySelector("#cta-btn");
const sections = document.querySelectorAll("section");
const contactSection = document.querySelector("#contact");
const contactForm = document.querySelector("#contactForm");
const contactFormStatus = document.querySelector("#contactFormStatus");
const upButton = document.querySelector("#up-button");
const smallHeaderHeight = 70;

const hideClass = "hide";

const headerMobileNavStyleClass = "header-mobile-nav";
const headerMobileOpenNavStyleClass = "header-mobile-nav-open";

let mobileDevice;

let changeHeaderHeightScrollPosition = 20;

let style = document.createElement("style");
document.getElementsByTagName("head")[0].appendChild(style);

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeoutID;
  return function () {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(func, wait);
  };
}

/**
 * Handle height for sections
 */
function handleSectionsHeight() {
  const clientHeight = window.innerHeight;

  style.innerHTML = `    
    .section-height {
      min-height: ${clientHeight}px;
    }
  `;

  sections.forEach(function (section) {
    section.classList.add("section-height");
  });
}

function handleMobileResponsive() {
  const clientWidth = window.innerWidth;

  if (mobileDevice || clientWidth < 950) {
    hamburger.style.display = "block";
    headerNav.classList.add(headerMobileNavStyleClass);
  } else {
    hamburger.style.display = "none";
    hamburger.classList.remove("change");
    headerNav.classList.remove(headerMobileOpenNavStyleClass);
    headerNav.classList.remove(headerMobileNavStyleClass);
  }
}

function handleNavBarScroll() {
  const scrollPosition = Math.floor(window.pageYOffset);

  if (scrollPosition < changeHeaderHeightScrollPosition) {
    homeView();
  } else {
    contentView();
  }
}

function homeView() {
  upButton.classList.add(hideClass);
}

function contentView() {
  upButton.classList.remove(hideClass);
}

/**
 * Smooth Scrolling effect, when a link is pressed
 */
function linkClickEvent(e) {
  var e = window.e || e;

  if (e.target.tagName === "A" && !e.target.hash.indexOf("#")) {
    e.preventDefault();

    let destinationEl = document.querySelector(e.target.hash);
    let position = getElementPosition(destinationEl);
    let duration = 800; //ms
    scrollToPosition(position, duration);
  }
}

/**
 * Scroll content by position
 * @param  {Number|String}      position  Position to scroll to
 * @param  {Number}             duration  Duration of scroll animation in ms, default 0
 * @param  {function}           callback  Callback, default undefined
 * @return {Void}
 */
function scrollToPosition(destination, duration = 0, callback = undefined) {
  const easing = "easeOutSine";
  const easings = {
    linear(t) {
      // no easing, no acceleration
      return t;
    },
    easeOutSine(t) {
      return Math.sin(t * (Math.PI / 2));
    },
    easeOutQuad(t) {
      // decelerating to zero velocity
      return t * (2 - t);
    },
    easeOutQuart(t) {
      // decelerating to zero velocity
      return 1 - --t * t * t * t;
    },
  };

  const start = window.pageYOffset;
  const startTime =
    "now" in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight;
  const destinationOffset =
    typeof destination === "number" ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset
  );

  if ("requestAnimationFrame" in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now =
      "now" in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = easings[easing](time);

    const nextPosition = Math.ceil(
      timeFunction * (destinationOffsetToScroll - start) + start
    );
    window.scroll(0, nextPosition);

    if (nextPosition === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

function scrollToTop() {
  let position = 0;
  let duration = 800; //ms
  scrollToPosition(position, duration, homeView);
}

function scrollToFirstElement() {
  let firstSection = sections[0];

  let position = getElementPosition(firstSection);
  let duration = 800; //ms
  scrollToPosition(position, duration);
}

function getElementPosition(element) {
  return element.offsetTop - smallHeaderHeight;
}

/**
 * Show page
 */
function showPage() {
  cover.classList.add(hideClass);
}

/**
 * Hide page
 */
function hidePage() {
  cover.classList.remove(hideClass);
}

function onClickHamburger() {
  hamburger.classList.toggle("change");
  headerNav.classList.toggle(headerMobileOpenNavStyleClass);
}

function closeMenu() {
  if (headerNav.classList.contains(headerMobileOpenNavStyleClass))
    onClickHamburger();
}

/**
 * check and update device type
 */
function updateDeviceType() {
  mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Function to check if element is currently being displayed on the screen
 * arguments: ID of the element to check
 */
function isDisplayed(elSelector) {
  let element = document.querySelector(elSelector);

  var top = element.offsetTop;
  var height = element.offsetHeight - smallHeaderHeight;

  return (
    top < window.pageYOffset + window.innerHeight &&
    top + height > window.pageYOffset
  );
}

/**
 * Function to check if the element is in view, if it is, start animation
 */
function animateSection(elementSelector, querySelector, animation) {
  let elements = document.querySelectorAll(querySelector);
  let element = document.querySelector(querySelector);

  if (isDisplayed(elementSelector) && !element.classList.contains(animation)) {
    elements.forEach(function (el, index) {
      setTimeout(function () {
        el.classList.add(animation);
      }, 150 * index);
    });
  }
}

/**
 * contact form success
 */
function contactFormSuccess() {
  contactForm.reset();
  contactFormStatus.innerHTML = "Thanks for contacting us!";

  setTimeout(() => {
    contactFormStatus.innerHTML = "";
  }, 3000);
}

/**
 * contact form error
 */
function contactFormError() {
  contactFormStatus.innerHTML = "Oops! There was a problem.";

  setTimeout(() => {
    contactFormStatus.innerHTML = "";
  }, 3000);
}

/**
 * Init
 */
function init() {
  updateDeviceType();

  handleSectionsHeight();
  handleMobileResponsive();
  handleNavBarScroll();
}

init();

/**
 * Listeners and initial function executions
 */
document.addEventListener(
  "DOMContentLoaded",
  function () {
    setTimeout(showPage, 100);
  },
  false
);

// handle the contact form submission event
contactForm.addEventListener("submit", function (ev) {
  ev.preventDefault();

  const data = JSON.stringify(Object.fromEntries(new FormData(contactForm)));

  fetch("https://formspree.io/f/xzbybdnr", {
    method: "POST",
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.ok) {
        contactForm.reset();
        contactFormSuccess();
      } else {
        console.log(`Form not submitted: ${response}`);
        contactFormError();
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      contactFormError();
    });
});
window.addEventListener("resize", debounce(updateDeviceType, 50));
window.addEventListener("resize", debounce(handleSectionsHeight, 50));
window.addEventListener("resize", debounce(handleMobileResponsive, 50));

window.addEventListener("click", linkClickEvent, false);

headerNav.addEventListener("click", closeMenu);

upButton.addEventListener("click", scrollToTop);
headerLogo.addEventListener("click", scrollToTop);

window.addEventListener(
  "scroll",
  function (e) {
    handleNavBarScroll();

    return false; //will prevent the default event from occurring and will prevent the event from bubbling up
  },
  true
);
