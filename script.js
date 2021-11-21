const timeTracking = (function () {
    let _frequency = 'weekly';
    const _attributes = [
        _createAttribute('work', 'images/icon-work.svg', 'Work'),
        _createAttribute('play', 'images/icon-play.svg', 'Play'),
        _createAttribute('study', 'images/icon-study.svg', 'Study'),
        _createAttribute('exercise', 'images/icon-exercise.svg', 'Exercise'),
        _createAttribute('social', 'images/icon-social.svg', 'Social'),
        _createAttribute('self-care', 'images/icon-self-care.svg', 'Self Care')
    ];

    function createCards() {
        let mainContainer = document.querySelector('.tt-container');

        _attributes.forEach(attribute => {
            let cardContainer = document.createElement('div');
            cardContainer.classList.add('tt-card-container');
            mainContainer.appendChild(cardContainer);

            let cardBg = _createCardBackground(attribute);
            cardContainer.appendChild(cardBg);

            let cardBanner = _createCardBanner(attribute);
            cardBg.appendChild(cardBanner);
            let cardBody = _createCardBody(attribute);
            cardBg.appendChild(cardBody);
        });

        _getCardsData();
    }

    function _getCardsData() {
        fetch('data.json')
        .then(response => response.json())
        .then(dataList => {
            _populateCards(dataList);
        })
        .catch(err => console.warn(err));
    }

    function initializeListeners() {
        let frequencySelectors = document.querySelectorAll('.stats-selection');
        frequencySelectors.forEach(selectorEl => {
            selectorEl.addEventListener('click', _changeFrequency);
        });
    }

    function _populateCards(dataList) {
        dataList.forEach(data => {
            let attribute = _attributes.find(attribute => attribute.title === data.title);
            data.type = attribute.type;

            let timeCurrentEl = document.querySelector(`h2[data-type="${data.type}"]`);
            timeCurrentEl.textContent = data.timeframes[_frequency].current + 'hrs';

            let timePreviousEl = document.querySelector(`.previous[data-type="${data.type}"]`);
            let displayText = '';
            switch(_frequency) {
                case 'daily':
                    displayText = 'Yesterday'
                break;
                case 'weekly':
                    displayText = 'Last week'
                break;
                case 'monthly':
                    displayText = 'Last month';
                break;
            }
            timePreviousEl.textContent = displayText + ' - ' + data.timeframes[_frequency].previous + 'hrs';
        });
    }

    function _changeFrequency() {
        _frequency = this.dataset.select;
        let activeSelection = document.querySelector(`div.stats-selection.active`);
        activeSelection.classList.remove('active');
        this.classList.add('active');
        _getCardsData();
    }

    function _createAttribute(type, bannerImage, title) {
        return { type, bannerImage, title };
    }

    function _createCardBackground(attribute) {
        let cardBg = document.createElement('div');
        cardBg.classList.add('bg');
        cardBg.classList.add(attribute.type);
        return cardBg;
    }

    function _createCardBanner(attribute) {
        let cardBanner = document.createElement('div');
        cardBanner.classList.add('card-icon-banner');

        let cardImage = document.createElement('img');
        cardImage.src = attribute.bannerImage;
        cardImage.alt = attribute.title + ' Icon';
        cardBanner.appendChild(cardImage);

        return cardBanner;
    }

    function _createCardBody(attribute) {
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        cardBody.appendChild(cardHeader);

        let cardTitle = document.createElement('div');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = attribute.title;
        cardHeader.appendChild(cardTitle);

        let cardOptionsIcon = document.createElement('img');
        cardOptionsIcon.src = 'images/icon-ellipsis.svg';
        cardOptionsIcon.alt = 'More';
        cardHeader.appendChild(cardOptionsIcon);

        let cardTime = document.createElement('div');
        cardTime.classList.add('card-time');
        cardBody.appendChild(cardTime);

        let timeCurrent = document.createElement('h2');
        timeCurrent.dataset.type = attribute.type;
        cardTime.appendChild(timeCurrent);

        let timePrevious = document.createElement('div');
        timePrevious.classList.add('previous');
        timePrevious.dataset.type = attribute.type;
        cardTime.appendChild(timePrevious);

        return cardBody;
    }

    return {
        createCards,
        initializeListeners
    }
})();

window.onload = () => {
    timeTracking.createCards();
    timeTracking.initializeListeners();
};

