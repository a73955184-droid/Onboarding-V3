import { WELCOME_COPY } from '../../content/welcome-copy.js';
import { navigate } from '../../application/router.js';
import { resetState } from '../../application/state.js';
export function renderWelcome(root){document.title=WELCOME_COPY.documentTitle;root.innerHTML=`<main class="main"><section class="intro-simple"><div class="eyebrow">${WELCOME_COPY.eyebrow}</div><h1>${WELCOME_COPY.heading}</h1><p class="intro-note">${WELCOME_COPY.note}</p><button class="btn btn-primary" id="startBtn">${WELCOME_COPY.button}</button></section></main>`;document.getElementById('startBtn').onclick=()=>{resetState();navigate('assessment/1');};}
