import ancientsData from '../data/ancients.js';
import blueCards from '../data/mythicCards/blue/index.js';
import brownCards from '../data/mythicCards/brown/index.js';
import greenCards from '../data/mythicCards/green/index.js';
import difficulties from '../data/difficulties.js';

const difficulties_w = document.querySelector('.difficulties');
const make_stack = document.querySelector('.make_stack');
const stage_color_w = document.querySelectorAll('.stage_color_w');
const active_card = document.querySelector('.active_card');
const active_card_stack = document.querySelector('.active_card_stack');
let all_ancient = document.querySelectorAll('.ancient_i');
let diff_i = document.querySelectorAll('.diff_i');
let card_matrix_w = document.querySelector('.card_matrix_w');

let selectedAncient = null;
let selectedDifficulties = null;
let startFullStack = [];
let tempStack = [];
let finishStack = [[], [], []];
let shema = [];

function showAncient() {
    ancientsData.forEach((i, idx) => {
        let img = document.createElement('img');
        img.src = i.cardFace;
        all_ancient[idx].append(img);
        all_ancient[idx].addEventListener('click', () => {
            all_ancient.forEach(i => {
                i.classList.remove('active_ancient');
            });
            all_ancient[idx].classList.add('active_ancient')
            selectedAncient = i;
            resetValues();
            difficulties_w.classList.add('show_d')
        })
    })
}
showAncient();

function renderDifficulties() {
    selectedDifficulties = null;
    difficulties.forEach((i, idx) => {
        diff_i[idx].textContent = i.name;
        diff_i[idx].addEventListener('click', () => {
            diff_i.forEach(i => {
                i.classList.remove('active_diff');
            });
            diff_i[idx].classList.add('active_diff')
            selectedDifficulties = i;
            resetValues();
            make_stack.classList.add('show_make_stack')
        })
    })
}
renderDifficulties();

make_stack.addEventListener('click', () => {
    startFullStack = [...blueCards, ...brownCards, ...greenCards];
    card_matrix_w.classList.add('show_matrix')
    resetValues();
    getFullStack();
});

function resetValues() {
    tempStack = [];
    finishStack = [[], [], []];
    active_card_stack.src = '';
    calcNumOfColorCard();
}

function getFullStack() {
    shema = [selectedAncient.firstStage, selectedAncient.secondStage, selectedAncient.thirdStage];
    shema.forEach(obj => {
        for (const key in obj) {
            for (let i = 0; i < obj[key]; i++) {
                getCardToTempStack(key);
            }
        }
    });
    shema.forEach((obj, idx) => {
        for (const key in obj) {
            for (let i = 0; i < obj[key]; i++) {
                getCardToFinishStack(key, idx);
            }
        }
    });
    calcNumOfColorCard();
}

function getCardToTempStack(color) {
    if (selectedDifficulties.id === 'very_easy' || selectedDifficulties.id === 'easy') { startFullStack = startFullStack.filter(i => i.difficulty !== 'hard'); }
    if (selectedDifficulties.id === 'very_hard' || selectedDifficulties.id === 'hard') { startFullStack = startFullStack.filter(i => i.difficulty !== 'easy'); }
    if (selectedDifficulties.id === 'very_easy' || selectedDifficulties.id === 'very_hard') {
        let difficultyLevel = selectedDifficulties.id.split('_')[1]; // 'easy' or 'hard' 
        if (startFullStack.some(el => el.difficulty === difficultyLevel && el.color === color)) {
            randCard(color, difficultyLevel);
        } else {
            randCard(color, 'normal');
        }
    }
    else {
        randCard(color);
    }
}

function getCardToFinishStack(color, idx) {
    let rand = Math.floor(Math.random() * tempStack.length);
    if (tempStack[rand].color === color) {
        finishStack[idx].push(...tempStack.splice(rand, 1))
    } else {
        getCardToFinishStack(color, idx);
    }
}

function randCard(color, difficultyLevel) {
    let rand = Math.floor(Math.random() * startFullStack.length);
    if (difficultyLevel) {
        if (startFullStack[rand].difficulty === difficultyLevel && startFullStack[rand].color === color) {
            tempStack.push(...(startFullStack.splice(rand, 1)));
        } else {
            randCard(color, difficultyLevel);
        }
    } else {
        if (startFullStack[rand].color === color) {
            tempStack.push(...(startFullStack.splice(rand, 1)));
        } else {
            randCard(color);
        }
    }
}

function calcNumOfColorCard() {
    finishStack.forEach((stage, idx) => {
        stage_color_w[idx].firstElementChild.textContent = stage.filter(i => i.color === 'green').length;
        stage_color_w[idx].firstElementChild.nextElementSibling.textContent = stage.filter(i => i.color === 'brown').length;
        stage_color_w[idx].lastElementChild.textContent = stage.filter(i => i.color === 'blue').length;
    });
}

active_card.addEventListener('click', () => {
    if (finishStack[0].length) {
        let rand = Math.floor(Math.random() * finishStack[0].length);
        let card = finishStack[0].splice(rand, 1);
        active_card_stack.src = `./assets/MythicCards/${card[0].color}/${card[0].cardFace}`;
    } else if (finishStack[1].length) {
        let rand = Math.floor(Math.random() * finishStack[1].length);
        let card = finishStack[1].splice(rand, 1);
        active_card_stack.src = `./assets/MythicCards/${card[0].color}/${card[0].cardFace}`;
    } else if (finishStack[2].length) {
        let rand = Math.floor(Math.random() * finishStack[2].length);
        let card = finishStack[2].splice(rand, 1);
        active_card_stack.src = `./assets/MythicCards/${card[0].color}/${card[0].cardFace}`;
    }
    calcNumOfColorCard();
});








