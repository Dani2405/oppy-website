const boxContainer = document.querySelector('#box-container');
const selectedOption = document.querySelector('#selected-option');
const selectedContainer = document.querySelector('#selected-container');
const options = document.querySelectorAll('.option');
const optionsContainer = document.querySelector('#options-container');
const {
  german,
  english,
  spanish,
  italian,
  defaultLng
} = window.languages;

const resources = {
  en: {
    translation: english
  },
  de: {
    translation: german
  },
  es: {
    translation: spanish
  },
  it: {
    translation: italian
  }
}

/*--------------------------------------------------------------
# Select Handle
--------------------------------------------------------------*/
const updateSelectedOption = () => {
  selectedOption.innerHTML = (i18next.language || window.localStorage.i18nextLng || '').toUpperCase();
}

const deactivateAnimationClasses = () => {
  optionsContainer.classList.remove('active');
  selectedContainer.classList.remove('rotate');
}

const initializationSelect = () => {
  updateSelectedOption();
  options.forEach(option => {
    if (option.value.toLowerCase() === i18next.language)
      option.style.display = 'none';
  })
}

selectedContainer.addEventListener('click', () => {
  optionsContainer.classList.toggle('active');
  selectedContainer.classList.toggle('rotate');
});

options.forEach(option => {
  option.addEventListener('click', () => {
    options.forEach(option => option.style.display = 'block');
    option.style.display = 'none';

    i18next.changeLanguage(option.value.toLowerCase());
    deactivateAnimationClasses();
    updateSelectedOption();
  });
});

// Handle outside click
document.addEventListener('click', (event) => {
  const isClickedInsideBoxContainer = boxContainer.contains(event.target);

  if (!isClickedInsideBoxContainer)
    deactivateAnimationClasses();
});

// Handle select when scroll
document.addEventListener('scroll', () => {
  deactivateAnimationClasses();
})

/*--------------------------------------------------------------
# i18next
--------------------------------------------------------------*/
const updateContent = () => {
  const attributeRefName = 'data-i18n';
  const elements = document.querySelectorAll(`[${attributeRefName}]`);

  elements.forEach(element => {
    const key = element.getAttribute(attributeRefName);

    switch (element.tagName.toLowerCase()) {
      case 'input':
        element.value = i18next.t(key);
        break;
      case 'meta':
        element.content = i18next.t(key);
        break;
      default:
        element.innerHTML = i18next.t(key);
    }
  })
}

i18next
  .use(i18nextBrowserLanguageDetector)
  .init({
    resources,
    fallbackLng: defaultLng,
    detection: {
      lookupQueryString: 'lng',
    },
  }, function (err, t) {
    // init set content
    if (!Object.keys(resources).includes(i18next.language))
      i18next.changeLanguage(defaultLng);

    updateContent();
    initializationSelect();
  });

i18next.on('languageChanged', () => {
  updateContent();
});

i18next.on('failedLoading', () => {
  i18next.changeLanguage(defaultLng);
})