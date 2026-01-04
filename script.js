import { InterpretarVisitor } from "./Interpreter/Interprete.js";
import { parse } from "./Interpreter/gramatica.js";

// --- State Management ---
const tabs = [
    { name: 'main.js', content: '// Escribe tu código aquí...\nconsole.log("Hola Mundo!");' }
];
let editors = [];

// --- DOM Elements ---
const tabButtonsContainer = document.getElementById('tab-buttons');
const tabContentsContainer = document.getElementById('tab-contents');
const addTabButton = document.getElementById('add-tab');
const loadFileBtn = document.getElementById('load-file-btn');
const loadFileInput = document.getElementById('load-file-input');
const interpretButton = document.getElementById('Interpretar');

const consoleTextArea = document.getElementById('console-textarea');
const astContainer = document.getElementById('ast');
const errorsContainer = document.getElementById('errores');

// Initialize Console Editor (Read Only)
const consoleEditor = CodeMirror.fromTextArea(consoleTextArea, {
    lineNumbers: true,
    mode: "text/plain",
    theme: "dracula",
    readOnly: true
});

// --- Initialization ---

// Initialize default tabs
tabs.forEach((tab, index) => createTab(index));
openTab(0);
setupPanelTabs();

// --- Functions ---

function createTab(index) {
    const tab = tabs[index];

    // Create Tab Button
    const button = document.createElement('button');
    button.textContent = tab.name;
    button.className = 'tab-button';
    button.onclick = () => openTab(index);
    tabButtonsContainer.appendChild(button);

    // Create Tab Content
    const content = document.createElement('div');
    content.className = 'tab-content';

    const textarea = document.createElement('textarea');
    content.appendChild(textarea);
    tabContentsContainer.appendChild(content);

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula"
    });
    editor.getDoc().setValue(tab.content);

    editors.push(editor);
}

function openTab(tabIndex) {
    const buttons = document.getElementsByClassName('tab-button');
    const contents = document.getElementsByClassName('tab-content');

    // Deactivate all
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        contents[i].classList.remove('active');
    }

    // Activate selected
    if (buttons[tabIndex] && contents[tabIndex]) {
        buttons[tabIndex].classList.add('active');
        contents[tabIndex].classList.add('active');
        // Refresh CodeMirror to fix sizing issues when becoming visible
        editors[tabIndex].refresh();
    }
}

function setupPanelTabs() {
    const panelTabs = document.querySelectorAll('.panel-tab');
    const panelViews = document.querySelectorAll('.panel-view');

    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            panelTabs.forEach(t => t.classList.remove('active'));
            panelViews.forEach(v => v.classList.remove('active'));

            // Add active class to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// --- Event Listeners ---

addTabButton.onclick = () => {
    const index = tabs.length;
    const newTabName = `Archivo_${index + 1}.js`;
    tabs.push({ name: newTabName, content: '' });
    createTab(index);
    openTab(index);
};

loadFileBtn.onclick = () => {
    loadFileInput.click();
};

loadFileInput.addEventListener('change', function (event) {
    const activeIndex = Array.from(document.getElementsByClassName('tab-button'))
        .findIndex(button => button.classList.contains('active'));
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            if (activeIndex !== -1) {
                editors[activeIndex].getDoc().setValue(fileContent);
                // Optional: Update tab name to filename
                document.getElementsByClassName('tab-button')[activeIndex].textContent = file.name;
            }
        }
        reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
});

interpretButton.onclick = () => {
    const activeIndex = Array.from(document.getElementsByClassName('tab-button'))
        .findIndex(button => button.classList.contains('active'));

    if (activeIndex !== -1) {
        const activeEditor = editors[activeIndex];
        const codigo = activeEditor.getValue();

        try {
            const sentencias = parse(codigo);
            const interprete = new InterpretarVisitor();

            console.log({ sentencias });

            // Execute
            sentencias.forEach(sentencia => sentencia.accept(interprete));

            // Outputs
            // 1. Symbol Table (AST view for now based on original code)
            astContainer.innerHTML = interprete.tablaSimbolos.hacerHTML();

            // 2. Errors
            errorsContainer.innerHTML = interprete.errores.hacerHTML();

            // 3. Console
            consoleEditor.setValue(interprete.consola);

            // Switch to Console tab automatically on run
            document.querySelector('.panel-tab[data-target="console-view"]').click();

        } catch (error) {
            console.error(error);
            consoleEditor.setValue("Error critico en la ejecución: " + error);
            document.querySelector('.panel-tab[data-target="errors-view"]').click();
        }

    } else {
        alert("No hay una pestaña activa.");
    }
};
