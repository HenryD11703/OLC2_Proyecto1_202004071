import { InterpretarVisitor } from "./Interpreter/Interprete.js";
import { parse } from "./Interpreter/gramatica.js";

// --- DOM Elements ---
const tabButtonsContainer = document.getElementById('tab-buttons');
const tabContentsContainer = document.getElementById('tab-contents');
const addTabButton = document.getElementById('add-tab');
const loadFileTrigger = document.getElementById('load-file-trigger'); // Sidebar item
const loadFileInput = document.getElementById('load-file-input');
const interpretButton = document.getElementById('Interpretar');

// Outputs
const consoleTextArea = document.getElementById('console-textarea');
const astContainer = document.getElementById('ast');
const errorsContainer = document.getElementById('errores');

// Status Bar
const cursorLn = document.getElementById('cursor-ln');
const cursorCol = document.getElementById('cursor-col');

// --- State Management ---
const tabs = [
    { name: 'main.js', content: '// Escribe tu código aquí...\nSystem.out.println("Hola Mundo!");' }
];
let editors = [];

// --- Initialization ---

// Initialize default tabs
tabs.forEach((tab, index) => createTab(index));
openTab(0);
setupPanelTabs();
setupResizer();

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
    content.className = 'tab-content'; // Note: Styles might need adjustment if using CM directly
    // Ideally we append the CM wrapper directly, but let's stick to container
    const textarea = document.createElement('textarea');
    content.appendChild(textarea);
    tabContentsContainer.appendChild(content);

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "vscode-dark", // Ensure this theme CSS is loaded, or fallback to 'dracula'
        indentUnit: 4,
        autoCloseBrackets: true,
    });

    // Fallback theme if vscode-dark isn't valid in the CM version loaded:
    // editor.setOption("theme", "dracula"); 

    editor.getDoc().setValue(tab.content);
    editor.setSize("100%", "100%");

    // Cursor Activity for Status Bar
    editor.on("cursorActivity", () => {
        const cursor = editor.getCursor();
        cursorLn.textContent = cursor.line + 1;
        cursorCol.textContent = cursor.ch + 1;
    });

    editors.push(editor);
}

function openTab(tabIndex) {
    const buttons = document.getElementsByClassName('tab-button');
    const contents = document.getElementsByClassName('tab-content');

    // Deactivate all
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        if (contents[i]) contents[i].classList.remove('active');
    }

    // Activate selected
    if (editors[tabIndex]) {
        buttons[tabIndex].classList.add('active');
        if (contents[tabIndex]) contents[tabIndex].classList.add('active');

        // Refresh editor to recalculate size/scrollbars
        setTimeout(() => {
            editors[tabIndex].refresh();
            editors[tabIndex].focus();
        }, 10);
    }
}

function setupPanelTabs() {
    const panelTabs = document.querySelectorAll('.panel-tab');
    const panelViews = document.querySelectorAll('.panel-view');

    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            panelTabs.forEach(t => t.classList.remove('active'));
            panelViews.forEach(v => v.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Close Panel Button
    document.getElementById('close-panel').onclick = () => {
        const panel = document.getElementById('bottom-panel');
        const sizer = document.getElementById('panel-resizer');
        const collapsed = panel.style.display === 'none';

        if (collapsed) {
            panel.style.display = 'flex';
            sizer.style.display = 'block';
        } else {
            panel.style.display = 'none';
            sizer.style.display = 'none';
        }
    };
}

// --- Resizer Logic ---
function setupResizer() {
    const resizer = document.getElementById('panel-resizer');
    const panel = document.getElementById('bottom-panel');
    const workbench = document.querySelector('.workbench'); // Container

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
        resizer.classList.add('active');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        // Calculate new height: Total Configured Height - Mouse Y - Status Bar
        // Or strictly: Window Height - Mouse Y - Status Bar Height
        const statusBarHeight = 22;
        const newHeight = window.innerHeight - e.clientY - statusBarHeight;

        if (newHeight > 50 && newHeight < (window.innerHeight - 100)) {
            panel.style.height = `${newHeight}px`;
            resizer.style.bottom = `${newHeight}px`; // Move sash with it since it's absolute
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            resizer.classList.remove('active');
            // Refresh editors on resize stop to ensure they fill space
            editors.forEach(ed => ed.refresh());
        }
    });
}


// --- Event Listeners ---

// --- Setup Sidebar & Demo Files ---

const demoWorkspace = [
    {
        name: "1- Ciclos.txt", content: `float n = 10;       
string cadenaFigura = "";
float i; 
i=-3*n/2;
        //iniciando dibujo
while(i<=n){
            cadenaFigura = "";
            float j; 
            j=-3*n/2;
            while(j<=3*n){
                float absolutoi;
                absolutoi = i;
                float absolutoj;
                absolutoj = j;
                if(i < 0)
                {
                    absolutoi = i * -1;
                }
                if(j < 0)
                {
                    absolutoj = j * -1;
                }
                if((absolutoi + absolutoj < n)
                        || ((-n / 2 - i) * (-n / 2 - i) + (n / 2 - j) * (n / 2 - j) <= n * n / 2)
                        || ((-n / 2 - i) * (-n / 2 - i) + (-n / 2 - j) * (-n / 2 - j) <= n * n / 2)) {
                    cadenaFigura = cadenaFigura + "* ";
                }
                else
                {
                    cadenaFigura = cadenaFigura + ". ";
                }
                j=j+1;
            }
            System.out.println(cadenaFigura);
            i=i+1;
        }
   ` },
    {
        name: "2 - Bloques.txt", content: `// Variables globales
int globalEntero = 100;
string globalCadena = "Global";

{
    // Bloque 1: Variables locales
    int localEntero = 50;
    string localCadena = "Local";
    boolean condicion = true;

    // Uso de variables locales y globales
    System.out.println("Global entero:", globalEntero);
    System.out.println("Local entero:", localEntero);
    System.out.println("Global cadena:", globalCadena);
    System.out.println("Local cadena:", localCadena);

    // If-else dentro del bloque
    if (condicion) {
        System.out.println("Condición es verdadera en Bloque 1");
    } else {
        System.out.println("Condición es falsa en Bloque 1");
    }

    // Acceso a una función con ámbito local
    string resultado = "Hola" + localCadena;
    System.out.println("Resultado de concatenación en Bloque 1:", resultado);
}

{
    // Bloque 2: Nuevas variables locales que sobrescriben nombres globales
    int globalEntero = 200;  // Sombreado de variable global
    string localCadena = "Bloque 2";

    // Ciclo for-each dentro de este bloque
    int[] enteros = {10, 20, 30};
    for (int num : enteros) {
        System.out.println("Número en bloque 2:", num);
    }

    // Sombreado de la variable global
    System.out.println("Global entero sombreado en Bloque 2:", globalEntero);
    System.out.println("Local cadena en Bloque 2:", localCadena);

    // Llamada a función que depende de la variable global no sombreada
    string resultado = "Adiós"+ globalCadena;  // Usa la global real
    System.out.println("Resultado de concatenación en Bloque 2:", resultado);
}

// Bloque final que muestra resultados globales y actualizaciones
{
    globalEntero += 50;  // Modificación de la variable global
    System.out.println("Global entero modificado:", globalEntero);

    if (globalEntero >= 150) {
        System.out.println("El valor del globalEntero es mayor a 150");
    }

}` },
    {
        name: "4 - Funciones.txt", content: `// Variables globales
int globalEntero = 100;
string globalCadena = "Global";

// Definición de función para concatenar cadenas
string concatenarCadenas(string cadena1, string cadena2) {
    return cadena1 + " " + cadena2;
}


{
    // Bloque 1: Variables locales
    int localEntero = 50;
    string localCadena = "Local";
    boolean condicion = true;

    // Uso de variables locales y globales
    System.out.println("Global entero:", globalEntero);
    System.out.println("Local entero:", localEntero);
    System.out.println("Global cadena:", globalCadena);
    System.out.println("Local cadena:", localCadena);

    // If-else dentro del bloque
    if (condicion) {
        System.out.println("Condición es verdadera en Bloque 1");
    } else {
        System.out.println("Condición es falsa en Bloque 1");
    }

    // Acceso a una función con ámbito local
    string resultado = concatenarCadenas("Hola", localCadena);
    System.out.println("Resultado de concatenación en Bloque 1:", resultado);
}

{
    // Bloque 2: Nuevas variables locales que sobrescriben nombres globales
    int globalEntero = 200;  // Sombreado de variable global
    string localCadena = "Bloque 2";

    // Ciclo for-each dentro de este bloque
    int[] enteros = {10, 20, 30};
    for (int num : enteros) {
        System.out.println("Número en bloque 2:", num);
    }

    // Sombreado de la variable global
    System.out.println("Global entero sombreado en Bloque 2:", globalEntero);
    System.out.println("Local cadena en Bloque 2:", localCadena);

    // Llamada a función que depende de la variable global no sombreada
    string resultado = concatenarCadenas("Adiós", globalCadena);  // Usa la global real
    System.out.println("Resultado de concatenación en Bloque 2:", resultado);
}


// Bloque final que muestra resultados globales y actualizaciones
{
    globalEntero += 50;  // Modificación de la variable global
    System.out.println("Global entero modificado:", globalEntero);

    if (globalEntero > 150) {
        System.out.println("El valor del globalEntero es mayor a 150");
    }

    // Uso de función embebida
    var fechaActual = time();
    System.out.println("Fecha actual:", fechaActual);
}` },
    {
        name: "arrays.oak", content: `
// ------------------------------------------------------------

System.out.println("********** Creacion de array **********");

System.out.println("1. Con lista de valores");

int[] numerosPares = {2, 4, 6, 8, 10};
System.out.println("Ok");
System.out.println("");

System.out.println("2. Con tamaño");

int[] llenoDeCeros = new int[5];
System.out.println("Ok");
System.out.println("");

System.out.println("3. Por copia");
int[] copiaPares = numerosPares;
System.out.println("Ok");
System.out.println("");

// ------------------------------------------------------------

System.out.println("********** Acceso a elementos **********");


System.out.println("1. Lectura de elementos");
System.out.println(numerosPares[0]); // 2
System.out.println(numerosPares[2]); // 6
System.out.println(llenoDeCeros[0]); // 0
System.out.println(llenoDeCeros[4]); // 0
System.out.println("");

System.out.println("2. Asignacion de elementos");
numerosPares[2] = 20;
System.out.println(numerosPares[2]); // 20
System.out.println(copiaPares[2]); // 6
System.out.println("");

// ------------------------------------------------------------

System.out.println("********** Creacion de matriz **********");

System.out.println("1. Con lista de valores");

int[][][] matriz = {{ {1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};
System.out.println("Ok");
System.out.println("");

System.out.println("2. Con tamaño");
int[][][] matrizVacia = new int[2][2][2];
System.out.println("Ok");
System.out.println("");

System.out.println("********** Acceso a elementos de matriz **********");

System.out.println("1. Lectura de elementos");
System.out.println(matriz[0][0][0]); // 1
System.out.println(matriz[1][1][1]); // 8
System.out.println(matriz[1][0][1]); // 6
System.out.println(matrizVacia[0][0][0]); // 0
System.out.println(matrizVacia[1][1][1]); // 0
System.out.println("");

System.out.println("2. Asignacion de elementos");
matriz[0][0][0] = 10;
matrizVacia[1][1][1] = 20;
System.out.println(matriz[0][0][0]); // 10
System.out.println(matrizVacia[1][1][1]); // 20

// ------------------------------------------------------------

System.out.println("********** Funciones y propedades de array **********");

System.out.println("1. indexOf");

System.out.println(numerosPares.indexOf(10)); // 1
System.out.println(numerosPares.indexOf(5)); // -1
System.out.println("");

System.out.println("2. join");
System.out.println(copiaPares.join()); // 2, 4, 6, 8, 10
System.out.println("");

System.out.println("3. length");
System.out.println(numerosPares.length); // 5

System.out.println("");
for (int i = 0; i < copiaPares.length; i = i + 1) {
    System.out.println(copiaPares[i]);
}` },
    {
        name: "basicas.oak", content: `
// ------------------------------------------------------------

System.out.println("********** Declaracion de variables **********");

System.out.println("1. Declaracion con tipo y valor");

int numero1 = 10;
float numero2 = 20.5;
string cadena = "Hola mundo";
char letra = 'a';

System.out.println(numero1);
System.out.println(numero2);
System.out.println(cadena);
System.out.println(letra);
System.out.println("");

System.out.println("2. Declaracion con tipo y sin valor");

int numero3; // null
float numero4; // null

System.out.println(numero3);
System.out.println(numero4);
System.out.println("");

System.out.println("3. Declaracion infiriendo el tipo");

var numero5 = 10; // tipo: int
var numero6 = 20.5; // tipo: float
var cadena2 = "Hola mundo"; // tipo: string
var letra2 = 'a'; // tipo: char

System.out.println(numero5);
System.out.println(numero6);
System.out.println(cadena2);
System.out.println(letra2);
System.out.println("");

// ------------------------------------------------------------

System.out.println("********** Asignacion de variables **********");

// 1. Asignacion con tipo correcto
numero1 = 20;
numero2 = 30.5;
cadena = "Adios mundo";
letra = 'b';

System.out.println(numero1);
System.out.println(numero2);
System.out.println(cadena);
System.out.println(letra);
System.out.println("");
` }
]; // Excluding long files for brevity, can add later if requested

// --- Initialize Sidebar ---
function setupSidebar() {
    const fileTree = document.querySelector('.file-tree');

    // Clear existing (except load file trigger if we want to keep it, but lets rebuild)
    fileTree.innerHTML = '';

    // Add "Open File" Item manually
    const openFileItem = document.createElement('div');
    openFileItem.className = 'tree-item';
    openFileItem.id = 'load-file-trigger';
    openFileItem.innerHTML = `
        <span class="material-icons file-icon" style="color: #64dd17;">file_upload</span>
        <span class="item-label">Abrir Archivo Local...</span>
    `;
    openFileItem.onclick = () => loadFileInput.click();
    fileTree.appendChild(openFileItem);

    // Add Divider
    const divider = document.createElement('div');
    divider.style.height = '1px';
    divider.style.backgroundColor = '#3e3e42';
    divider.style.margin = '5px 0';
    fileTree.appendChild(divider);

    // Add Demo Files
    demoWorkspace.forEach((file, idx) => {
        const item = document.createElement('div');
        item.className = 'tree-item';
        // Use different icon for .oak files
        const iconColor = file.name.endsWith('.oak') ? '#ff9800' : '#ffd700';
        item.innerHTML = `
            <span class="material-icons file-icon" style="color: ${iconColor};">article</span>
            <span class="item-label">${file.name}</span>
        `;
        item.onclick = () => {
            // Check if tab exists? for now just open new
            const index = tabs.length;
            tabs.push({ name: file.name, content: file.content });
            createTab(index);
            openTab(index);
        };
        fileTree.appendChild(item);
    });
}

// Call it
setupSidebar();

// --- Event Listeners ---

addTabButton.onclick = () => {
    const index = tabs.length;
    tabs.push({ name: `Untitled-${index + 1}`, content: '' });
    createTab(index);
    openTab(index);
};

// Handle File Input Change
loadFileInput.addEventListener('change', function (event) {
    const activeIndex = Array.from(document.getElementsByClassName('tab-button'))
        .findIndex(button => button.classList.contains('active'));

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            // Create New Tab for loaded file to avoid overwriting "Untitled" if it has content
            // actually user might want to overwrite if empty. Let's stick to simple logic:
            // If active tab is empty (default), overwrite. Else create new.

            // For now, consistent behavior: Create NEW tab for loaded file
            const newIndex = tabs.length;
            tabs.push({ name: file.name, content: fileContent });
            createTab(newIndex);
            openTab(newIndex);
        }
        reader.readAsText(file);
    }
    event.target.value = '';
});

// --- Activity Bar Logic ---
const activityIcons = document.querySelectorAll('.activity-icon');
const sidebarTitle = document.querySelector('.sidebar-header span:first-child');
const explorerSection = document.querySelector('.explorer-section');
// We can simulate a "Search" view
const searchView = document.createElement('div');
searchView.className = 'search-section';
searchView.style.display = 'none';
searchView.innerHTML = `
    <div style="padding: 10px;">
        <input type="text" placeholder="Buscar (Ctrl+Shift+F)" style="width: 100%; background: #3c3c3c; border: 1px solid #3c3c3c; color: #ccc; padding: 4px;">
    </div>
`;
document.querySelector('.sidebar-content').appendChild(searchView);


activityIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        // If it's settings, do nothing for now
        if (icon.getAttribute('title') === 'Settings') return;

        // Toggle Active
        activityIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');

        const title = icon.getAttribute('title');

        // Switch Views
        if (title === 'Explorer') {
            sidebarTitle.textContent = 'EXPLORER';
            explorerSection.style.display = 'block';
            searchView.style.display = 'none';
        } else if (title === 'Search') {
            sidebarTitle.textContent = 'SEARCH';
            explorerSection.style.display = 'none';
            searchView.style.display = 'block';
        } else {
            // For Source Control or Run, just show placeholder or keep explorer hidden
            sidebarTitle.textContent = title.toUpperCase();
            explorerSection.style.display = 'none';
            searchView.style.display = 'none';
        }
    });
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

            // Clear previous
            consoleTextArea.value = "";
            astContainer.innerHTML = "";
            errorsContainer.innerHTML = "";

            sentencias.forEach(sentencia => sentencia.accept(interprete));

            // Populate view
            astContainer.innerHTML = interprete.tablaSimbolos.hacerHTML();
            errorsContainer.innerHTML = interprete.errores.hacerHTML();
            consoleTextArea.value = interprete.consola;

            // Auto-switch to Terminal
            document.querySelector('.panel-tab[data-target="console-view"]').click();

        } catch (error) {
            console.error(error);
            consoleTextArea.value = "Error fatal: " + error;
            document.querySelector('.panel-tab[data-target="errors-view"]').click();
        }
    }
};
