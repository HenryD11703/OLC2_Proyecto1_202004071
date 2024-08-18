// const tabs = [
//     { name: 'Pestaña 1', content: '// Código para pestaña 1' },
//     { name: 'Pestaña 2', content: '// Código para pestaña 2' },
//     { name: 'Pestaña 3', content: '// Código para pestaña 3' }
// ];
// Pestañas dinámicas con JavaScript
const tabs = [
    { name: 'Pestaña 1', content: '\n \n \n \n \n \n \n \n \n \n \n' }
];    

const tabButtons = document.getElementById('tab-buttons');
const tabContents = document.getElementById('tab-contents');
const addTabButton = document.getElementById('add-tab');
const loadFile = document.getElementById('load-file')



tabs.forEach((tab, index) => {
    const button = document.createElement('button');
    const addTabButton = document.getElementById('add-tab');

    addTabButton.textContent = 'Agregar pestaña';
    addTabButton.className = 'add-tab-button';
    tabButtons.appendChild(addTabButton);
    


    button.textContent = tab.name;
    button.className = 'tab-button';
    button.onclick = () => openTab(index);
    tabButtons.appendChild(button);

    const content = document.createElement('div');
    content.className = 'tab-content';
    const textarea = document.createElement('textarea');
    content.appendChild(textarea);
    tabContents.appendChild(content);

    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula"
    });
    editor.getDoc().setValue(tab.content);
});

function openTab(tabIndex) {
    const buttons = document.getElementsByClassName('tab-button');
    const contents = document.getElementsByClassName('tab-content');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        contents[i].classList.remove('active');
    }

    buttons[tabIndex].classList.add('active');
    contents[tabIndex].classList.add('active');
}

addTabButton.onclick = () => {
    const index = tabs.length;
    tabs.push({ name: `Pestaña ${index + 1}`, content: '\n \n \n \n \n \n \n \n \n \n \n' });

    const button = document.createElement('button');
    button.textContent = tabs[index].name;
    button.className = 'tab-button';
    button.onclick = () => openTab(index);
    tabButtons.appendChild(button);

    const content = document.createElement('div');
    content.className = 'tab-content';
    const textarea = document.createElement('textarea');
    content.appendChild(textarea);
    tabContents.appendChild(content);

    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula"
    });
    editor.getDoc().setValue(tabs[index].content);

    openTab(index);
}

// Abrir la primera pestaña por defecto
openTab(0);


