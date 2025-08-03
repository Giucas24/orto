// Stato del gioco
let gameState = {
    currentPlayer: 0,
    phase: 'reinforcement',
    selectedTerritory: null,
    attackMode: false,
    reinforcements: 4,
    turn: 1,
    battleCount: 0,
    drawnCard: null,
    cardsRemaining: 12,
    players: [
        {
            name: 'Cavolfiori',
            emoji: '❄️',
            color: '#e8d5e8',
            territories: ['snowpeak', 'frostland', 'iceberg'],
            leader: 'Generale Cavolo Brassius',
            ability: 'Resistenza Glaciale',
            abilityDescription: 'Una volta per turno può rigenerare 1 unità in un territorio che ha subito perdite',
            bonus: '+1 difesa in territori di montagna',
            weakness: '-1 attacco contro fazioni di radice (Carote)',
            abilityUsed: false,
            cards: []
        },
        {
            name: 'Cipolle',
            emoji: '🧅',
            color: '#d1a3d1',
            territories: ['bulbopoli', 'tropeaFields', 'scalognaValley'],
            leader: 'Duca Cipollotto di Tropea',
            ability: 'Lacrime Corrosive',
            abilityDescription: 'In battaglia, il nemico perde automaticamente 1 dado',
            bonus: '+1 attacco contro tutte le fazioni non-bulbo',
            weakness: 'Perde 1 unità extra con eventi acqua',
            abilityUsed: false,
            cards: []
        },
        {
            name: 'Carote',
            emoji: '🥕',
            color: '#ffb347',
            territories: ['carrotCity', 'orangeCounty', 'rootDeep'],
            leader: 'Imperatrice Carota Regina',
            ability: 'Vista Acuta',
            abilityDescription: 'Può vedere le info degli avversari adiacenti',
            bonus: '+1 rinforzo ogni 3 territori controllati',
            weakness: '-1 difesa contro fazioni aeree (Broccoli, Cavolfiori)',
            abilityUsed: false,
            cards: []
        },
        {
            name: 'Broccoli',
            emoji: '🥦',
            color: '#90ee90',
            territories: ['greenValley', 'broccoliForest', 'cavoloNero'],
            leader: 'Sciamano Broccolo Antico',
            ability: 'Germogli Selvaggi',
            abilityDescription: 'Può evocare 1 unità bonus in qualsiasi territorio controllato',
            bonus: '+2 rinforzi in territori fertili',
            weakness: 'Perde 1 unità extra con carte pesticidi',
            abilityUsed: false,
            cards: []
        },
        {
            name: 'Pomodori',
            emoji: '🍅',
            color: '#ff7f7f',
            territories: ['sanMarzano', 'cherryValley', 'pachinoCoast'],
            leader: 'Generale Pomodoro San Marzano',
            ability: 'Polpa Esplosiva',
            abilityDescription: 'Quando attacca, infligge 1 danno al territorio nemico adiacente',
            bonus: '+1 attacco quando ha 5+ unità in un territorio',
            weakness: '-1 difesa in territori secchi o montani',
            abilityUsed: false,
            cards: []
        }
    ],
    territories: {},
    eventCards: [
        { name: 'Grandinata Devastante', effect: 'destroy', power: 2, description: 'Distrugge 2 unità in una regione scelta dal nemico', icon: '🌨️' },
        { name: 'Miracolo Agricolo', effect: 'boost', power: 5, description: 'Ricevi immediatamente 5 rinforzi extra', icon: '🌟' },
        { name: 'Invasione Afidi', effect: 'halve', power: 1, description: 'Un nemico a scelta perde metà delle sue unità', icon: '🐛' },
        { name: 'Attacco Lampo', effect: 'extra_attacks', power: 3, description: 'Puoi effettuare 3 attacchi extra in questo turno', icon: '⚡' },
        { name: 'Super Fertilizzante', effect: 'grow_all', power: 2, description: 'Tutte le tue unità ricevono +2 unità', icon: '🌱' },
        { name: 'Siccità Estrema', effect: 'drought', power: 1, description: 'Tutti i territori secchi perdono 1 unità', icon: '☀️' },
        { name: 'Pioggia Benefica', effect: 'rain', power: 1, description: 'Tutti i tuoi territori umidi guadagnano 1 unità', icon: '🌧️' },
        { name: 'Tempesta Magnetica', effect: 'shuffle', power: 0, description: 'Mescola casualmente tutte le unità sulla mappa', icon: '🌪️' },
        { name: 'Alleanza Temporanea', effect: 'alliance', power: 1, description: 'Per 1 turno, non puoi essere attaccato', icon: '🤝' },
        { name: 'Tradimento', effect: 'betray', power: 1, description: 'Ruba 1 territorio neutrale o nemico con 1 unità', icon: '🗡️' },
        { name: 'Raccolto Abbondante', effect: 'harvest', power: 3, description: 'Guadagni 1 rinforzo per ogni 2 territori controllati', icon: '🌾' },
        { name: 'Epidemia Vegetale', effect: 'plague', power: 2, description: 'Scegli una fazione: perde 2 unità a caso', icon: '🦠' }
    ]
};

// Canvas e contesto
let canvas, ctx;

// Mappa dei territori con posizioni
// Mappa dei territori con posizioni (AGGIORNATA per evitare sovrapposizioni)
const territoryPositions = {
    // CIPOLLANDIA (Nord-Ovest) - più spaziati
    'bulbopoli': { x: 200, y: 150, region: 'cipollandia', type: 'humid' },
    'tropeaFields': { x: 308, y: 120, region: 'cipollandia', type: 'humid' },
    'scalognaValley': { x: 160, y: 237, region: 'cipollandia', type: 'normal' },

    // CAROTEGNA (Nord-Est) - spostati più a destra
    'carrotCity': { x: 870, y: 309, region: 'carotegna', type: 'normal' },
    'orangeCounty': { x: 750, y: 260, region: 'carotegna', type: 'dry' },
    'rootDeep': { x: 775, y: 388, region: 'carotegna', type: 'dry' },

    // TOMATOSIA (Sud-Ovest) - più in basso e spaziati
    'sanMarzano': { x: 180, y: 480, region: 'tomatosia', type: 'hot' },
    'cherryValley': { x: 280, y: 560, region: 'tomatosia', type: 'hot' },
    'pachinoCoast': { x: 320, y: 450, region: 'tomatosia', type: 'hot' },

    // BROCCOLANDIA (Sud-Est) - più spaziati
    'greenValley': { x: 625, y: 512, region: 'broccolandia', type: 'fertile' },
    'broccoliForest': { x: 720, y: 545, region: 'broccolandia', type: 'fertile' },
    'cavoloNero': { x: 650, y: 625, region: 'broccolandia', type: 'fertile' },

    // REGNO CAVOLFIORI (Nord) - più in alto e centrati
    'snowpeak': { x: 520, y: 80, region: 'cavolfiori', type: 'mountain' },
    'frostland': { x: 640, y: 90, region: 'cavolfiori', type: 'mountain' },
    'iceberg': { x: 562, y: 165, region: 'cavolfiori', type: 'mountain' },

    // MERCATO CENTRALE - disposti in rombo per evitare sovrapposizioni
    'grandBazaar': { x: 450, y: 320, region: 'mercato', type: 'market' },      // Sinistra
    'seedBank': { x: 550, y: 320, region: 'mercato', type: 'market' },         // Destra  
    'compostWorks': { x: 500, y: 280, region: 'mercato', type: 'fertile' },    // Alto
    'greenhouseLabs': { x: 500, y: 360, region: 'mercato', type: 'market' }    // Basso
};

// Adiacenze tra territori (AGGIORNATE)
const adjacencies = {
    'bulbopoli': ['tropeaFields', 'scalognaValley', 'grandBazaar'],
    'tropeaFields': ['bulbopoli', 'carrotCity', 'compostWorks'],
    'scalognaValley': ['bulbopoli', 'grandBazaar', 'pachinoCoast'],

    'carrotCity': ['tropeaFields', 'orangeCounty', 'rootDeep', 'snowpeak'],
    'orangeCounty': ['carrotCity', 'rootDeep', 'frostland', 'broccoliForest'],
    'rootDeep': ['carrotCity', 'orangeCounty', 'seedBank', 'greenValley'],

    'sanMarzano': ['cherryValley', 'pachinoCoast', 'grandBazaar'],
    'cherryValley': ['sanMarzano', 'pachinoCoast', 'greenValley'],
    'pachinoCoast': ['sanMarzano', 'cherryValley', 'scalognaValley', 'grandBazaar'],

    'greenValley': ['cherryValley', 'broccoliForest', 'cavoloNero', 'rootDeep', 'greenhouseLabs'],
    'broccoliForest': ['greenValley', 'cavoloNero', 'orangeCounty', 'seedBank'],
    'cavoloNero': ['greenValley', 'broccoliForest', 'greenhouseLabs'],

    'snowpeak': ['frostland', 'iceberg', 'carrotCity', 'compostWorks'],
    'frostland': ['snowpeak', 'iceberg', 'orangeCounty'],
    'iceberg': ['snowpeak', 'frostland', 'seedBank'],

    // Mercato centrale - disposto a rombo
    'grandBazaar': ['bulbopoli', 'scalognaValley', 'sanMarzano', 'pachinoCoast', 'compostWorks'],
    'seedBank': ['rootDeep', 'iceberg', 'broccoliForest', 'compostWorks', 'greenhouseLabs'],
    'compostWorks': ['tropeaFields', 'snowpeak', 'grandBazaar', 'seedBank'],
    'greenhouseLabs': ['greenValley', 'cavoloNero', 'seedBank']
};

// Colori per i territori
const colors = {
    onion: { light: '#e6d3f7', medium: '#d4b5e8', dark: '#a87cc8', border: '#6b4e71' },
    carrot: { light: '#f5d5a8', medium: '#e8b977', dark: '#c8934a', border: '#8b5a2b' },
    tomato: { light: '#f2c5c5', medium: '#e89999', dark: '#c46666', border: '#8b2635' },
    broccoli: { light: '#c8e6c9', medium: '#a5d6a7', dark: '#7cb342', border: '#2d5016' },
    cauliflower: { light: '#f0f0f0', medium: '#e0e0e0', dark: '#d0d0d0', border: '#8e24aa' },
    market: { light: '#f5e6a3', medium: '#e6d174', dark: '#c5a632', border: '#8b6914' }
};

// Variabili per l'interazione
let selectedTerritoryId = null;
let hoveredTerritoryId = null;

// Forme pre-generate per i territori (statiche)
let territoryShapes = {};
// Macchie di invecchiamento pre-generate (statiche)
let parchmentSpots = [];

// Sistema di editing base (MANTIENI)
let editMode = false;
let selectedTerritoryForEdit = null;
let territoryTransforms = {};

// Tracciamento posizione mouse per brush cursor (ASSICURATI CHE SIA QUI)
let lastMouseX = 0, lastMouseY = 0;

// Sistema editing avanzato (AGGIUNGI)
let brushEditMode = {
    active: false,
    selectedTerritory: null,
    tool: 'brush',
    brushSize: 20,
    isDrawing: false
};


// Funzioni di salvataggio/caricamento (AGGIUNGI QUESTE)
function saveTerritoryShapes() {
    localStorage.setItem('ortoConquista_territories', JSON.stringify(territoryShapes));
    console.log('💾 Forme salvate nel browser');
}

function loadTerritoryShapes() {
    const saved = localStorage.getItem('ortoConquista_territories');
    if (saved) {
        territoryShapes = JSON.parse(saved);
        console.log('📁 Forme caricate dal browser');
        return true;
    }
    return false;
}

function exportTerritoryShapes() {
    console.log('=== COPIA QUESTO CODICE NEL TUO SCRIPT ===');
    console.log('');
    console.log('// Sostituisci la funzione generateTerritoryShapes() con questa:');
    console.log('function generateTerritoryShapes() {');
    console.log('    // Forme personalizzate salvate:');

    Object.entries(territoryShapes).forEach(([territoryId, shape]) => {
        console.log(`    territoryShapes['${territoryId}'] = ${JSON.stringify(shape, null, 8)};`);
    });

    console.log('}');
    console.log('');
    console.log('=== FINE CODICE DA COPIARE ===');
}

// Inizializzazione del gioco
function initGame() {
    canvas = document.getElementById('mapCanvas');
    ctx = canvas.getContext('2d');

    initTerritoryTransforms();

    // PROVA A CARICARE FORME SALVATE
    if (!loadTerritoryShapes()) {
        // Se non ci sono forme salvate, genera quelle standard
        generateTerritoryShapes();
    }

    generateParchmentSpots();

    // Event listeners
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove); // Ora gestisce tutto
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);

    // AGGIUNGI SOLO QUESTI DUE:
    canvas.addEventListener('mousedown', (e) => {
        if (brushEditMode.active && brushEditMode.selectedTerritory) {
            brushEditMode.isDrawing = true;
            // handleBrushEdit verrà chiamato da handleCanvasMouseMove
        }
    });

    canvas.addEventListener('mouseup', () => {
        brushEditMode.isDrawing = false;
    });

    // Inizializza trasformazioni
    initTerritoryTransforms();

    // PRE-GENERA LE FORME E LE MACCHIE (UNA SOLA VOLTA)
    generateTerritoryShapes();
    generateParchmentSpots();

    // Inizializza territori con unità
    gameState.players.forEach((player, playerIndex) => {
        player.territories.forEach(territoryId => {
            gameState.territories[territoryId] = {
                owner: playerIndex,
                units: Math.floor(Math.random() * 3) + 2
            };
        });
    });

    // Territori neutrali del mercato centrale
    ['grandBazaar', 'seedBank', 'compostWorks', 'greenhouseLabs'].forEach(territoryId => {
        gameState.territories[territoryId] = {
            owner: -1,
            units: 1
        };
    });

    // Event listeners per il canvas
    canvas.addEventListener('click', handleCanvasClick);
    let lastMouseX = 0, lastMouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        lastMouseX = (e.clientX - rect.left) * (canvas.width / rect.width);  // SENZA let
        lastMouseY = (e.clientY - rect.top) * (canvas.height / rect.height);  // SENZA let
        handleCanvasMouseMove(e);
    });

    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);

    // Event listeners per brush editing
    canvas.addEventListener('mousedown', (e) => {
        if (brushEditMode.active && brushEditMode.selectedTerritory) {
            brushEditMode.isDrawing = true;
        }
    });

    canvas.addEventListener('mouseup', () => {
        brushEditMode.isDrawing = false;
    });

    // Disegna la mappa iniziale
    drawMap();
    updateDisplay();
    addLogEntry('🎮 Benvenuti all\'Orto Conquista! Che la battaglia vegetale abbia inizio!', 'log-special');
    showPhaseOverlay('reinforcement');
}

// Gestione del click sulla mappa
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const clickedTerritory = getTerritoryAtPosition(x, y);

    // MODALITÀ EDITING
    if (editMode && clickedTerritory) {
        selectedTerritoryForEdit = clickedTerritory;
        console.log(`Territorio selezionato per editing: ${clickedTerritory}`);
        console.log('Usa WASD=sposta, QE=scala X, CV=scala Y, RF=ruota, ZX=raggio');
        return;
    }

    // MODALITÀ GIOCO NORMALE
    if (clickedTerritory) {
        handleTerritoryClick(clickedTerritory);
    }
}

// Gestione del movimento del mouse
function handleCanvasMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const hoveredTerritory = getTerritoryAtPosition(x, y);

    if (hoveredTerritory !== hoveredTerritoryId) {
        hoveredTerritoryId = hoveredTerritory;
        drawMap();
    }
}

function handleCanvasMouseLeave() {
    if (hoveredTerritoryId) {
        hoveredTerritoryId = null;
        drawMap();
    }
}

// Trova territorio alle coordinate
function getTerritoryAtPosition(x, y) {
    for (const [territoryId, pos] of Object.entries(territoryPositions)) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance < 35) {
            return territoryId;
        }
    }
    return null;
}

// Gestisce il click sui territori
function handleTerritoryClick(territoryId) {
    const territory = gameState.territories[territoryId];

    if (gameState.phase === 'reinforcement') {
        if (territory && territory.owner === gameState.currentPlayer && gameState.reinforcements > 0) {
            territory.units++;
            gameState.reinforcements--;
            addLogEntry(`➕ +1 unità piazzata in ${getDisplayName(territoryId)}`, 'log-move');
            updateDisplay();
            drawMap();
            checkPhaseTransition();
        }
    } else if (gameState.phase === 'attack') {
        if (!selectedTerritoryId) {
            if (territory && territory.owner === gameState.currentPlayer && territory.units > 1) {
                selectTerritory(territoryId);
            }
        } else if (selectedTerritoryId === territoryId) {
            deselectTerritory();
        } else {
            if (territory && territory.owner !== gameState.currentPlayer &&
                adjacencies[selectedTerritoryId].includes(territoryId)) {
                performBattle(selectedTerritoryId, territoryId);
            }
        }
    }
}

function selectTerritory(territoryId) {
    selectedTerritoryId = territoryId;
    drawMap();
}

function deselectTerritory() {
    selectedTerritoryId = null;
    drawMap();
}

// Inizializza le trasformazioni di default
function initTerritoryTransforms() {
    Object.keys(territoryPositions).forEach(territoryId => {
        territoryTransforms[territoryId] = {
            x: 0,        // offset X
            y: 0,        // offset Y
            scaleX: 1,   // scala orizzontale
            scaleY: 1,   // scala verticale
            rotation: 0, // rotazione in radianti
            radius: getTerritoryRadius(territoryId) // raggio base
        };
    });
}

function selectTerritory(territoryId) {
    selectedTerritoryId = territoryId;
    drawMap();
}

function deselectTerritory() {
    selectedTerritoryId = null;
    drawMap();
}

// Ottieni nome visualizzato del territorio
function getDisplayName(territoryId) {
    const names = {
        'bulbopoli': 'Bulbopoli',
        'tropeaFields': 'Tropea Fields',
        'scalognaValley': 'Scalogna Valley',
        'carrotCity': 'Carrot City',
        'orangeCounty': 'Orange County',
        'rootDeep': 'Root Deep',
        'sanMarzano': 'San Marzano',
        'cherryValley': 'Cherry Valley',
        'pachinoCoast': 'Pachino Coast',
        'greenValley': 'Green Valley',
        'broccoliForest': 'Broccoli Forest',
        'cavoloNero': 'Cavolo Nero',
        'snowpeak': 'Snow Peak',
        'frostland': 'Frost Land',
        'iceberg': 'Iceberg',
        'grandBazaar': 'Grand Bazaar',
        'seedBank': 'Seed Bank',
        'compostWorks': 'Compost Works',
        'greenhouseLabs': 'Greenhouse Labs'
    };
    return names[territoryId] || territoryId;
}

// FUNZIONI DI DISEGNO DELLA MAPPA

// FUNZIONI DI DISEGNO

// Funzione per creare texture di pergamena
function createParchmentTexture() {
    const gradient = ctx.createRadialGradient(500, 350, 50, 500, 350, 600);
    gradient.addColorStop(0, '#f4e8d0');
    gradient.addColorStop(0.3, '#e8dcc0');
    gradient.addColorStop(0.7, '#d4c4a8');
    gradient.addColorStop(1, '#c8b99c');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 700);

    // Usa le macchie pre-generate
    ctx.globalAlpha = 0.1;
    parchmentSpots.forEach(spot => {
        ctx.fillStyle = spot.color;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.globalAlpha = 1;
}

// Funzione per disegnare acqua antica
function drawAncientSea() {
    ctx.fillStyle = '#6b8db5';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 1000, 700);
    ctx.globalAlpha = 1;
}

// FUNZIONI PER LA GENERAZIONE DELLE FORME

// Funzione per generare forma organica
function generateOrganicShape(centerX, centerY, baseRadius, seed = 0, transforms = {}) {
    const points = [];
    const numPoints = 12 + Math.floor(seed * 8) % 8;

    // Applica trasformazioni
    const finalX = centerX + (transforms.x || 0);
    const finalY = centerY + (transforms.y || 0);
    const finalRadius = (transforms.radius || baseRadius);
    const scaleX = transforms.scaleX || 1;
    const scaleY = transforms.scaleY || 1;
    const rotation = transforms.rotation || 0;

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 + rotation;
        let variance = 0.6 + (Math.sin(seed + i) + 1) * 0.4;
        const roughness = Math.sin(angle * 4 + seed) * 0.2 + Math.cos(angle * 7 + seed) * 0.15;
        variance += roughness;
        const radius = finalRadius * variance;

        const x = finalX + Math.cos(angle) * radius * scaleX;
        const y = finalY + Math.sin(angle) * radius * scaleY;

        points.push({ x, y });
    }
    return points;
}

// Pre-genera tutte le forme dei territori
function generateTerritoryShapes() {
    Object.entries(territoryPositions).forEach(([territoryId, pos], index) => {
        const radius = getTerritoryRadius(territoryId);
        const seed = index * 123.456;
        const transforms = territoryTransforms[territoryId] || {};
        territoryShapes[territoryId] = generateOrganicShape(pos.x, pos.y, radius, seed, transforms);
    });
}

// Pre-genera le macchie di invecchiamento
function generateParchmentSpots() {
    parchmentSpots = [];
    for (let i = 0; i < 50; i++) {
        parchmentSpots.push({
            x: Math.random() * 1000,
            y: Math.random() * 700,
            radius: Math.random() * 30 + 10,
            color: `hsl(${30 + Math.random() * 20}, 40%, ${20 + Math.random() * 20}%)`
        });
    }
}

// Disegna linee di demarcazione tra territori della stessa regione
function drawRegionBorders() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.globalAlpha = 0.4;

    // Cipollandia
    drawLineBetween('bulbopoli', 'tropeaFields');
    drawLineBetween('tropeaFields', 'scalognaValley');
    drawLineBetween('scalognaValley', 'bulbopoli');

    // Carotegna  
    drawLineBetween('carrotCity', 'orangeCounty');
    drawLineBetween('orangeCounty', 'rootDeep');
    drawLineBetween('rootDeep', 'carrotCity');

    // Tomatosia
    drawLineBetween('sanMarzano', 'cherryValley');
    drawLineBetween('cherryValley', 'pachinoCoast');
    drawLineBetween('pachinoCoast', 'sanMarzano');

    // Broccolandia
    drawLineBetween('greenValley', 'broccoliForest');
    drawLineBetween('broccoliForest', 'cavoloNero');
    drawLineBetween('cavoloNero', 'greenValley');

    // Regno Cavolfiori
    drawLineBetween('snowpeak', 'frostland');
    drawLineBetween('frostland', 'iceberg');
    drawLineBetween('iceberg', 'snowpeak');

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
}

function drawLineBetween(territory1, territory2) {
    const pos1 = territoryPositions[territory1];
    const pos2 = territoryPositions[territory2];

    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}

function getTerritoryRadius(territoryId) {
    const radii = {
        'bulbopoli': 55, 'tropeaFields': 60, 'scalognaValley': 50,
        'carrotCity': 65, 'orangeCounty': 55, 'rootDeep': 58,
        'sanMarzano': 52, 'cherryValley': 48, 'pachinoCoast': 50,
        'greenValley': 55, 'broccoliForest': 60, 'cavoloNero': 52,
        'snowpeak': 50, 'frostland': 55, 'iceberg': 48,
        'grandBazaar': 25, 'seedBank': 25, 'compostWorks': 25, 'greenhouseLabs': 25
    };
    return radii[territoryId] || 50;
}

// Funzione per disegnare territorio organico con stato del gioco
function drawGameTerritory(territoryId, centerX, centerY, radius, colorSet) {
    const territory = gameState.territories[territoryId];
    if (!territory) return;

    // Usa le forme pre-generate
    const points = territoryShapes[territoryId];
    if (!points) return;

    ctx.save();

    // Disegna il territorio
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const currentPoint = points[i];
        const nextPoint = points[(i + 1) % points.length];
        const controlX = (currentPoint.x + nextPoint.x) / 2;
        const controlY = (currentPoint.y + nextPoint.y) / 2;
        ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, controlX, controlY);
    }
    ctx.closePath();

    // Colore basato sul proprietario
    let fillColor;
    if (territory.owner === -1) {
        fillColor = colorSet.light;
    } else {
        const playerColor = gameState.players[territory.owner].color;
        fillColor = playerColor;
    }

    // Effetti visivi per selezione e hover
    if (territoryId === selectedTerritoryId) {
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
    } else if (territoryId === hoveredTerritoryId) {
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 10;
    } else if (selectedTerritoryId && adjacencies[selectedTerritoryId]?.includes(territoryId) &&
        territory.owner !== gameState.currentPlayer) {
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 8;
    }

    ctx.fillStyle = fillColor;
    ctx.fill();

    // Bordo
    ctx.strokeStyle = colorSet.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore();

    // Disegna unità
    drawUnits(centerX, centerY, territory.units, territory.owner);

    return { x: centerX, y: centerY };
}

// Disegna unità sui territori
function drawUnits(x, y, units, owner) {
    // Sfondo per il numero
    ctx.fillStyle = owner === gameState.currentPlayer ? '#ffeb3b' :
        owner === -1 ? '#fff' : gameState.players[owner].color;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Numero unità
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(units.toString(), x, y);
}

// Disegna il lago centrale
function drawCentralLake() {
    ctx.save();
    const lakeGradient = ctx.createRadialGradient(500, 350, 60, 500, 350, 120);
    lakeGradient.addColorStop(0, '#7bb3d9');
    lakeGradient.addColorStop(0.7, '#5a9bc4');
    lakeGradient.addColorStop(1, '#4682b4');

    ctx.fillStyle = lakeGradient;
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.arc(500, 350, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
}

// Rosa dei venti
function drawCompass(x, y) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#f4e8d0';
    ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#8b5a2b';
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', x, y - 35);
    ctx.fillText('S', x, y + 45);
    ctx.fillText('E', x + 35, y + 4);
    ctx.fillText('O', x - 35, y + 4);

    ctx.restore();
}

// Disegna connessioni dal territorio selezionato
function drawConnections() {
    if (!selectedTerritoryId || !adjacencies[selectedTerritoryId]) return;

    const fromPos = territoryPositions[selectedTerritoryId];

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    adjacencies[selectedTerritoryId].forEach(adjId => {
        const toPos = territoryPositions[adjId];
        if (toPos) {
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.stroke();
        }
    });

    ctx.setLineDash([]);
}

// Funzione principale per disegnare la mappa
function drawMap() {
    // Pulisci canvas
    ctx.clearRect(0, 0, 1000, 700);

    // Sfondo pergamena
    createParchmentTexture();

    // Mare esterno
    drawAncientSea();

    // Lago centrale
    drawCentralLake();

    // Disegna tutti i territori
    const territoryData = {
        // CIPOLLANDIA
        'bulbopoli': { pos: territoryPositions.bulbopoli, radius: 55, colors: colors.onion },
        'tropeaFields': { pos: territoryPositions.tropeaFields, radius: 60, colors: colors.onion },
        'scalognaValley': { pos: territoryPositions.scalognaValley, radius: 50, colors: colors.onion },

        // CAROTEGNA
        'carrotCity': { pos: territoryPositions.carrotCity, radius: 65, colors: colors.carrot },
        'orangeCounty': { pos: territoryPositions.orangeCounty, radius: 55, colors: colors.carrot },
        'rootDeep': { pos: territoryPositions.rootDeep, radius: 58, colors: colors.carrot },

        // TOMATOSIA
        'sanMarzano': { pos: territoryPositions.sanMarzano, radius: 52, colors: colors.tomato },
        'cherryValley': { pos: territoryPositions.cherryValley, radius: 48, colors: colors.tomato },
        'pachinoCoast': { pos: territoryPositions.pachinoCoast, radius: 50, colors: colors.tomato },

        // BROCCOLANDIA
        'greenValley': { pos: territoryPositions.greenValley, radius: 55, colors: colors.broccoli },
        'broccoliForest': { pos: territoryPositions.broccoliForest, radius: 60, colors: colors.broccoli },
        'cavoloNero': { pos: territoryPositions.cavoloNero, radius: 52, colors: colors.broccoli },

        // REGNO CAVOLFIORI
        'snowpeak': { pos: territoryPositions.snowpeak, radius: 50, colors: colors.cauliflower },
        'frostland': { pos: territoryPositions.frostland, radius: 55, colors: colors.cauliflower },
        'iceberg': { pos: territoryPositions.iceberg, radius: 48, colors: colors.cauliflower },

        // MERCATO CENTRALE
        'grandBazaar': { pos: territoryPositions.grandBazaar, radius: 25, colors: colors.market },
        'seedBank': { pos: territoryPositions.seedBank, radius: 25, colors: colors.market },
        'compostWorks': { pos: territoryPositions.compostWorks, radius: 25, colors: colors.market },
        'greenhouseLabs': { pos: territoryPositions.greenhouseLabs, radius: 25, colors: colors.market }
    };

    // Disegna territori
    Object.entries(territoryData).forEach(([territoryId, data]) => {
        drawGameTerritory(territoryId, data.pos.x, data.pos.y, data.radius, data.colors);
    });

    // Disegna nomi delle regioni
    ctx.font = 'bold 18px serif';
    ctx.globalAlpha = 0.8;
    ctx.textAlign = 'center';

    ctx.fillStyle = '#6b4e71';
    ctx.fillText('CIPOLLANDIA', 290, 100);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillText('CAROTEGNA', 640, 100);

    ctx.fillStyle = '#8b2635';
    ctx.fillText('TOMATOSIA', 270, 380);

    ctx.fillStyle = '#2d5016';
    ctx.fillText('BROCCOLANDIA', 700, 380);

    ctx.fillStyle = '#8e24aa';
    ctx.fillText('REGNO DEI CAVOLFIORI', 650, 30);

    ctx.fillStyle = '#8b6914';
    ctx.font = 'bold 14px serif';
    ctx.fillText('MERCATO CENTRALE', 500, 280);

    ctx.globalAlpha = 1;

    // Rosa dei venti
    drawCompass(850, 120);

    // Bordi delle regioni
    drawRegionBorders();

    // Connessioni tra territori (se territorio selezionato)
    if (selectedTerritoryId) {
        drawConnections();
    }
}

function drawBrushCursor() {
    // Ottieni posizione mouse corrente (dovrai tracciare questo)
    if (lastMouseX && lastMouseY) {
        ctx.strokeStyle = brushEditMode.tool === 'brush' ? '#00ff00' : '#ff0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.arc(lastMouseX, lastMouseY, brushEditMode.brushSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([]);
    }
}



// FUNZIONI DI GIOCO

// FUNZIONI DI GIOCO

// Calcola rinforzi
function calculateReinforcements(playerIndex) {
    const player = gameState.players[playerIndex];
    let reinforcements = Math.max(3, Math.floor(player.territories.length / 2));

    // Bonus Carote: +1 rinforzo ogni 3 territori
    if (playerIndex === 2) {
        reinforcements += Math.floor(player.territories.length / 3);
    }

    // Bonus Broccoli: +2 rinforzi per territori fertili
    if (playerIndex === 3) {
        const fertileTerritories = player.territories.filter(tId =>
            territoryPositions[tId] && territoryPositions[tId].type === 'fertile'
        ).length;
        reinforcements += fertileTerritories * 2;
    }

    return reinforcements;
}

// Mostra overlay per le fasi
function showPhaseOverlay(phase) {
    const overlay = document.getElementById('phase-overlay');
    const icon = document.getElementById('phase-icon');
    const text = document.getElementById('phase-text');

    const phaseInfo = {
        'reinforcement': { icon: '⚡', text: 'Fase Rinforzi', color: '#4caf50' },
        'attack': { icon: '⚔️', text: 'Fase Attacco', color: '#f44336' },
        'move': { icon: '🚶', text: 'Fase Movimento', color: '#2196f3' }
    };

    const info = phaseInfo[phase];
    icon.textContent = info.icon;
    text.textContent = info.text;
    text.style.color = info.color;

    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2000);
}

// Controllo transizione fasi
function checkPhaseTransition() {
    if (gameState.phase === 'reinforcement' && gameState.reinforcements === 0) {
        setTimeout(() => {
            gameState.phase = 'attack';
            document.getElementById('attack-btn').disabled = false;
            addLogEntry(`⚔️ Fase attacco iniziata per i ${gameState.players[gameState.currentPlayer].name}`, 'log-move');
            showPhaseOverlay('attack');
            updateDisplay();
        }, 1000);
    }
}

// ABILITÀ DEI LEADER

// Usa abilità leader
function useLeaderAbility() {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    if (currentPlayer.abilityUsed) {
        addLogEntry('❌ Abilità già usata questo turno!', 'log-attack');
        return;
    }

    switch (gameState.currentPlayer) {
        case 0: // Cavolfiori
            useResistenzaGlaciale();
            break;
        case 1: // Cipolle
            useLacrimeCorrosive();
            break;
        case 2: // Carote
            useVistaAcuta();
            break;
        case 3: // Broccoli
            useGermogliSelvaggi();
            break;
        case 4: // Pomodori
            usePolpaEsplosiva();
            break;
    }

    currentPlayer.abilityUsed = true;
    updateDisplay();
}

function useResistenzaGlaciale() {
    const player = gameState.players[gameState.currentPlayer];
    const damagedTerritories = player.territories.filter(tId => {
        const territory = gameState.territories[tId];
        return territory && territory.units < 3;
    });

    if (damagedTerritories.length > 0) {
        const randomTerritory = damagedTerritories[Math.floor(Math.random() * damagedTerritories.length)];
        gameState.territories[randomTerritory].units++;
        addLogEntry(`❄️ Resistenza Glaciale: +1 unità rigenerata in ${getDisplayName(randomTerritory)}!`, 'log-special');
        drawMap();
    } else {
        addLogEntry('❄️ Resistenza Glaciale: Nessun territorio da rigenerare', 'log-special');
    }
}

function useLacrimeCorrosive() {
    addLogEntry('🧅 Lacrime Corrosive attive: il prossimo attacco avrà bonus speciale!', 'log-special');
}

function useVistaAcuta() {
    const adjacentPlayers = new Set();
    const currentPlayerTerritories = gameState.players[gameState.currentPlayer].territories;

    currentPlayerTerritories.forEach(tId => {
        adjacencies[tId]?.forEach(adjId => {
            const adjTerritory = gameState.territories[adjId];
            if (adjTerritory && adjTerritory.owner !== gameState.currentPlayer && adjTerritory.owner !== -1) {
                adjacentPlayers.add(adjTerritory.owner);
            }
        });
    });

    let infoText = '🥕 Vista Acuta rivela:';
    adjacentPlayers.forEach(playerIndex => {
        const player = gameState.players[playerIndex];
        infoText += ` ${player.emoji} ${player.name}: ${player.territories.length} territori;`;
    });

    addLogEntry(infoText, 'log-special');
}

function useGermogliSelvaggi() {
    const player = gameState.players[gameState.currentPlayer];
    if (player.territories.length > 0) {
        const randomTerritory = player.territories[Math.floor(Math.random() * player.territories.length)];
        gameState.territories[randomTerritory].units++;
        addLogEntry(`🥦 Germogli Selvaggi: +1 unità evocata in ${getDisplayName(randomTerritory)}!`, 'log-special');
        drawMap();
    }
}

function usePolpaEsplosiva() {
    addLogEntry('🍅 Polpa Esplosiva attiva: il prossimo attacco farà danni collaterali!', 'log-special');
}

// Battaglia
function performBattle(fromId, toId) {
    const attacker = gameState.territories[fromId];
    const defender = gameState.territories[toId];
    const attackerPlayer = gameState.players[gameState.currentPlayer];
    const defenderPlayer = defender.owner === -1 ? null : gameState.players[defender.owner];

    gameState.battleCount++;

    // Calcola modificatori
    let attackBonus = 0;
    let defenseBonus = 0;

    // Bonus territori
    const defenderTerritoryType = territoryPositions[toId];
    if (defenderTerritoryType && defenderPlayer) {
        if (defender.owner === 0 && defenderTerritoryType.type === 'mountain') {
            defenseBonus += 1;
            addLogEntry(`❄️ Bonus Cavolfiori: +1 difesa in montagna`, 'log-defend');
        }
    }

    // Lancia i dadi
    let attackerDice = Math.floor(Math.random() * 6) + 1 + attackBonus;
    let defenderDice = Math.floor(Math.random() * 6) + 1 + defenseBonus;

    // Abilità Lacrime Corrosive
    if (gameState.currentPlayer === 1 && attackerPlayer.abilityUsed) {
        defenderDice = Math.max(1, defenderDice - 1);
        addLogEntry(`💧 Lacrime Corrosive: dado nemico ridotto!`, 'log-attack');
    }

    showDiceRoll(attackerDice, defenderDice);

    const fromName = getDisplayName(fromId);
    const toName = getDisplayName(toId);

    addLogEntry(`⚔️ ${fromName} (${attackerDice}) attacca ${toName} (${defenderDice})`, 'log-attack');

    if (attackerDice > defenderDice) {
        // Attaccante vince
        defender.units--;
        addLogEntry(`💥 ${toName} perde 1 unità!`, 'log-attack');

        // Abilità Polpa Esplosiva
        if (gameState.currentPlayer === 4 && attackerPlayer.abilityUsed) {
            adjacencies[toId]?.forEach(adjId => {
                const adjTerritory = gameState.territories[adjId];
                if (adjTerritory && adjTerritory.owner !== gameState.currentPlayer &&
                    adjTerritory.owner !== -1 && adjTerritory.units > 1) {
                    adjTerritory.units--;
                    addLogEntry(`💥 Polpa Esplosiva colpisce ${getDisplayName(adjId)}!`, 'log-attack');
                }
            });
        }

        if (defender.units <= 0) {
            // Territorio conquistato
            const oldOwner = defender.owner;
            defender.owner = gameState.currentPlayer;
            defender.units = Math.max(1, attacker.units - 1);
            attacker.units = 1;

            // Aggiorna liste territori
            if (oldOwner !== -1) {
                gameState.players[oldOwner].territories =
                    gameState.players[oldOwner].territories.filter(t => t !== toId);
            }
            attackerPlayer.territories.push(toId);

            addLogEntry(`🏆 ${toName} conquistato dai ${attackerPlayer.name}!`, 'log-attack');
            checkVictory();
        }
    } else {
        // Difensore vince
        attacker.units--;
        addLogEntry(`🛡️ ${fromName} perde 1 unità nell'attacco fallito!`, 'log-defend');
    }

    deselectTerritory();
    updateDisplay();
    drawMap();
}

function showDiceRoll(attackerDice, defenderDice) {
    document.querySelectorAll('.dice').forEach(dice => dice.remove());

    const logContent = document.getElementById('log-content');
    const diceContainer = document.createElement('div');
    diceContainer.className = 'dice-container';

    const attackerDiceEl = document.createElement('div');
    attackerDiceEl.className = 'dice attacker';
    attackerDiceEl.textContent = attackerDice;

    const defenderDiceEl = document.createElement('div');
    defenderDiceEl.className = 'dice defender';
    defenderDiceEl.textContent = defenderDice;

    diceContainer.appendChild(attackerDiceEl);
    diceContainer.appendChild(document.createTextNode(' VS '));
    diceContainer.appendChild(defenderDiceEl);

    logContent.appendChild(diceContainer);
    logContent.scrollTop = logContent.scrollHeight;
}

// Piazza rinforzi automaticamente
function placeReinforcements() {
    const playerTerritories = gameState.players[gameState.currentPlayer].territories
        .filter(tId => gameState.territories[tId]);

    while (gameState.reinforcements > 0 && playerTerritories.length > 0) {
        const borderTerritories = playerTerritories.filter(tId => {
            return adjacencies[tId]?.some(adjId => {
                const adjTerritory = gameState.territories[adjId];
                return adjTerritory && adjTerritory.owner !== gameState.currentPlayer;
            });
        });

        const targetTerritories = borderTerritories.length > 0 ? borderTerritories : playerTerritories;
        const randomTerritory = targetTerritories[Math.floor(Math.random() * targetTerritories.length)];

        gameState.territories[randomTerritory].units++;
        gameState.reinforcements--;
    }

    addLogEntry(`🎯 Rinforzi piazzati strategicamente sui territori di confine`, 'log-move');
    updateDisplay();
    drawMap();
    checkPhaseTransition();
}

function toggleAttackMode() {
    gameState.attackMode = !gameState.attackMode;
    const btn = document.getElementById('attack-btn');
    btn.textContent = gameState.attackMode ? '🔥 Attacco Attivo!' : '⚔️ Modalità Attacco';
    btn.style.background = gameState.attackMode ?
        'linear-gradient(45deg, #ff5722, #d84315)' :
        'linear-gradient(45deg, #f44336, #d32f2f)';
}

// Fine turno
function endTurn() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    gameState.phase = 'reinforcement';
    gameState.turn++;

    // Reset abilità
    gameState.players[gameState.currentPlayer].abilityUsed = false;

    // Calcola nuovi rinforzi
    gameState.reinforcements = calculateReinforcements(gameState.currentPlayer);

    deselectTerritory();

    // Reset bottoni
    document.getElementById('attack-btn').disabled = true;
    document.getElementById('end-turn').disabled = true;
    document.getElementById('attack-btn').textContent = '⚔️ Modalità Attacco';
    document.getElementById('attack-btn').style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';

    const currentPlayer = gameState.players[gameState.currentPlayer];
    addLogEntry(`🔄 Turno ${gameState.turn}: ${currentPlayer.emoji} ${currentPlayer.name} inizia!`, 'log-move');

    showPhaseOverlay('reinforcement');
    updateDisplay();
    drawMap();
}

// Pesca carta evento
function drawEventCard() {
    if (gameState.cardsRemaining <= 0) {
        addLogEntry('🎴 Mazzo esaurito!', 'log-move');
        return;
    }

    const availableCards = gameState.eventCards.filter(card =>
        !gameState.players[gameState.currentPlayer].cards.some(playerCard => playerCard.name === card.name)
    );

    if (availableCards.length === 0) {
        addLogEntry('🎴 Nessuna carta disponibile!', 'log-move');
        return;
    }

    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    gameState.drawnCard = randomCard;
    gameState.cardsRemaining--;

    showDrawnCard(randomCard);
    addLogEntry(`🎴 Carta pescata: ${randomCard.name}`, 'log-special');
    updateCardsDisplay();
}

function showDrawnCard(card) {
    const overlay = document.getElementById('card-drawn-overlay');
    const cardName = document.getElementById('drawn-card-name');
    const cardDesc = document.getElementById('drawn-card-description');
    const cardEffect = document.getElementById('drawn-card-effect');

    cardName.textContent = `${card.icon} ${card.name}`;
    cardDesc.textContent = card.description;
    cardEffect.textContent = `Effetto: ${card.effect} (Potenza: ${card.power})`;

    overlay.style.display = 'flex';
}

function closeDrawnCard() {
    document.getElementById('card-drawn-overlay').style.display = 'none';

    if (gameState.drawnCard) {
        gameState.players[gameState.currentPlayer].cards.push(gameState.drawnCard);
        gameState.drawnCard = null;
        updateCardsDisplay();
    }
}

function useDrawnCard() {
    if (gameState.drawnCard) {
        playEventCard(gameState.drawnCard);
        gameState.drawnCard = null;
        document.getElementById('card-drawn-overlay').style.display = 'none';
    }
}

// Apri overlay delle carte in mano
function openCardsOverlay() {
    const overlay = document.getElementById('cards-overlay');
    const grid = document.getElementById('cards-grid');
    const playerCards = gameState.players[gameState.currentPlayer].cards;

    // Pulisci griglia
    grid.innerHTML = '';

    if (playerCards.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Nessuna carta in mano</p>';
    } else {
        playerCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'player-card';
            cardElement.innerHTML = `
                <div class="player-card-name">${card.icon} ${card.name}</div>
                <div class="player-card-desc">${card.description}</div>
                <div class="player-card-effect">Effetto: ${card.effect} (Potenza: ${card.power})</div>
            `;
            cardElement.onclick = () => {
                playEventCard(card);
                playerCards.splice(index, 1);
                updateCardsDisplay();
                closeCardsOverlay();
            };
            grid.appendChild(cardElement);
        });
    }

    overlay.style.display = 'flex';
}

function closeCardsOverlay() {
    document.getElementById('cards-overlay').style.display = 'none';
}

function playEventCard(card) {
    switch (card.effect) {
        case 'boost':
            gameState.reinforcements += card.power;
            addLogEntry(`🌟 ${card.name}: +${card.power} rinforzi!`, 'log-special');
            break;
        case 'grow_all':
            gameState.players[gameState.currentPlayer].territories.forEach(tId => {
                if (gameState.territories[tId]) {
                    gameState.territories[tId].units += card.power;
                }
            });
            addLogEntry(`🌿 ${card.name}: +${card.power} unità ovunque!`, 'log-special');
            drawMap();
            break;
        case 'destroy':
            const enemyTerritories = [];
            Object.entries(gameState.territories).forEach(([tId, territory]) => {
                if (territory.owner !== gameState.currentPlayer && territory.owner !== -1) {
                    enemyTerritories.push(tId);
                }
            });
            if (enemyTerritories.length > 0) {
                const target = enemyTerritories[Math.floor(Math.random() * enemyTerritories.length)];
                gameState.territories[target].units = Math.max(1, gameState.territories[target].units - card.power);
                addLogEntry(`💥 ${card.name}: ${getDisplayName(target)} devastato!`, 'log-special');
                drawMap();
            }
            break;
        case 'halve':
            const enemyPlayers = gameState.players.filter((player, index) =>
                index !== gameState.currentPlayer && player.territories.length > 0
            );
            if (enemyPlayers.length > 0) {
                const targetPlayer = enemyPlayers[Math.floor(Math.random() * enemyPlayers.length)];
                targetPlayer.territories.forEach(tId => {
                    const territory = gameState.territories[tId];
                    if (territory) {
                        territory.units = Math.max(1, Math.floor(territory.units / 2));
                    }
                });
                addLogEntry(`🐛 ${card.name}: ${targetPlayer.name} decimati!`, 'log-special');
                drawMap();
            }
            break;
        case 'extra_attacks':
            addLogEntry(`⚡ ${card.name}: Puoi effettuare ${card.power} attacchi extra!`, 'log-special');
            break;
        case 'harvest':
            const bonus = Math.floor(gameState.players[gameState.currentPlayer].territories.length / 2) * card.power;
            gameState.reinforcements += bonus;
            addLogEntry(`🌾 ${card.name}: +${bonus} rinforzi dal raccolto!`, 'log-special');
            break;
    }

    updateDisplay();
}

function updateCardsDisplay() {
    const cardsInHand = gameState.players[gameState.currentPlayer].cards.length;
    document.getElementById('cards-in-hand').textContent = cardsInHand;
    document.getElementById('cards-remaining').textContent = gameState.cardsRemaining;

    // Abilita/disabilita il pulsante visualizza carte
    document.getElementById('view-cards').disabled = cardsInHand === 0;
}

function updatePlayerCardsDisplay() {
    const container = document.getElementById('player-cards');
    const playerCards = gameState.players[gameState.currentPlayer].cards;

    container.innerHTML = '';

    playerCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'player-card';
        cardElement.innerHTML = `
            <div class="player-card-name">${card.icon} ${card.name}</div>
            <div class="player-card-desc">${card.description}</div>
        `;
        cardElement.onclick = () => {
            playEventCard(card);
            playerCards.splice(index, 1);
            updatePlayerCardsDisplay();
        };
        container.appendChild(cardElement);
    });
}

// Controllo vittoria
function checkVictory() {
    const alivePlayers = gameState.players.filter(player => player.territories.length > 0);

    if (alivePlayers.length === 1) {
        showVictory(alivePlayers[0]);
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (currentPlayer.territories.length >= 12) {
        showVictory(currentPlayer);
        return;
    }
}

function showVictory(winner) {
    document.getElementById('victory-title').textContent = `🏆 VITTORIA ${winner.emoji}🏆`;
    document.getElementById('victory-message').textContent =
        `I ${winner.name} hanno conquistato l'orto! ${winner.leader} regna supremo!`;
    document.getElementById('victory-screen').style.display = 'flex';
}

function resetGame() {
    location.reload();
}

// AGGIORNAMENTO DISPLAY

// Aggiorna display principale
function updateDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Aggiorna sezione leader
    document.getElementById('leader-avatar').textContent = currentPlayer.emoji;
    document.getElementById('leader-avatar').style.borderColor = currentPlayer.color;
    document.getElementById('leader-title').textContent = currentPlayer.leader;
    document.getElementById('faction-name').textContent = `Clan dei ${currentPlayer.name}`;

    // Aggiorna colore bordo della sezione leader
    const leaderSection = document.getElementById('leader-section');
    leaderSection.style.borderLeftColor = currentPlayer.color;

    // Statistiche leader
    document.getElementById('territory-count').textContent = currentPlayer.territories.length;
    document.getElementById('reinforcements').textContent = gameState.reinforcements;
    document.getElementById('turn-counter').textContent = gameState.turn;

    // Info abilità
    document.getElementById('ability-name').textContent = currentPlayer.ability;
    document.getElementById('ability-desc').textContent = currentPlayer.abilityDescription;
    document.getElementById('faction-bonus').textContent = currentPlayer.bonus;
    document.getElementById('faction-weakness').textContent = currentPlayer.weakness;

    // Fase corrente
    const phaseNames = {
        'reinforcement': 'Rinforzi',
        'attack': 'Attacco',
        'move': 'Movimento'
    };
    document.getElementById('current-phase').textContent = phaseNames[gameState.phase];

    // Statistiche generali
    document.getElementById('battle-count').textContent = gameState.battleCount;

    // Bottone abilità leader
    const abilityBtn = document.getElementById('leader-ability');
    abilityBtn.disabled = currentPlayer.abilityUsed || gameState.phase !== 'attack';
    abilityBtn.textContent = currentPlayer.abilityUsed ? '✅ Abilità Usata' : '🌟 Usa Abilità Leader';

    // Aggiorna stato bottoni
    document.getElementById('place-reinforcements').disabled =
        gameState.reinforcements === 0 || gameState.phase !== 'reinforcement';

    document.getElementById('attack-btn').disabled = gameState.phase !== 'attack';
    document.getElementById('end-turn').disabled = gameState.phase === 'reinforcement';

    // Aggiorna display carte
    updateCardsDisplay();

    // Abilita fase movimento se in fase attacco e nessun territorio selezionato
    if (gameState.phase === 'attack' && !selectedTerritoryId) {
        const canAttack = gameState.players[gameState.currentPlayer].territories.some(tId => {
            const territory = gameState.territories[tId];
            return territory && territory.units > 1 &&
                adjacencies[tId]?.some(adjId => {
                    const adjTerritory = gameState.territories[adjId];
                    return adjTerritory && adjTerritory.owner !== gameState.currentPlayer;
                });
        });

        if (!canAttack) {
            document.getElementById('end-turn').disabled = false;
        }
    }
}

function addLogEntry(message, className = '') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.textContent = message;
    logContent.appendChild(entry);

    // Mantieni solo ultimi 15 messaggi
    while (logContent.children.length > 15) {
        logContent.removeChild(logContent.firstChild);
    }

    logContent.scrollTop = logContent.scrollHeight;
}

// CONTROLLI DA TASTIERA (solo quelli di gioco e editing base)

function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'r':
            case 'R':
                if (gameState.phase === 'reinforcement' && gameState.reinforcements > 0) {
                    placeReinforcements();
                }
                break;
            case 'e':
            case 'E':
                if (!document.getElementById('end-turn').disabled) {
                    endTurn();
                }
                break;
            case 'a':
            case 'A':
                if (!document.getElementById('attack-btn').disabled) {
                    toggleAttackMode();
                }
                break;
            case 's':
            case 'S':
                if (!document.getElementById('leader-ability').disabled) {
                    useLeaderAbility();
                }
                break;
            case 'c':
            case 'C':
                if (gameState.cardsRemaining > 0) {
                    drawEventCard();
                }
                break;
            case 'v':
            case 'V':
                if (!document.getElementById('view-cards').disabled) {
                    openCardsOverlay();
                }
                break;
            case 'Escape':
                deselectTerritory();
                closeCardsOverlay();
                break;

            // MODALITÀ EDITING BASE
            case 'Tab':
                event.preventDefault();
                editMode = !editMode;
                console.log('Edit Mode:', editMode ? 'ON' : 'OFF');
                if (editMode) {
                    console.log('Clicca territorio, poi usa:');
                    console.log('WASD = sposta, QE = scala X, CV = scala Y');
                    console.log('RF = ruota, ZX = raggio, P = stampa config');
                }
                break;
        }

        // CONTROLLI EDITING (quando editMode è attivo)
        if (editMode && selectedTerritoryForEdit) {
            const transform = territoryTransforms[selectedTerritoryForEdit];
            let changed = false;

            switch (event.key) {
                case 'w': case 'W':
                    transform.y -= 5;
                    changed = true;
                    break;
                case 's': case 'S':
                    transform.y += 5;
                    changed = true;
                    break;
                case 'a': case 'A':
                    transform.x -= 5;
                    changed = true;
                    break;
                case 'd': case 'D':
                    transform.x += 5;
                    changed = true;
                    break;
                case 'q': case 'Q':
                    transform.scaleX *= 1.1;
                    changed = true;
                    break;
                case 'e': case 'E':
                    transform.scaleX *= 0.9;
                    changed = true;
                    break;
                case 'r': case 'R':
                    transform.rotation += 0.1;
                    changed = true;
                    break;
                case 'f': case 'F':
                    transform.rotation -= 0.1;
                    changed = true;
                    break;
                case 'z': case 'Z':
                    transform.radius *= 1.1;
                    changed = true;
                    break;
                case 'x': case 'X':
                    transform.radius *= 0.9;
                    changed = true;
                    break;
                case 'c': case 'C':
                    transform.scaleY *= 1.1;
                    changed = true;
                    break;
                case 'v': case 'V':
                    transform.scaleY *= 0.9;
                    changed = true;
                    break;
                case 'p': case 'P':
                    console.log('=== CONFIGURAZIONE ATTUALE ===');
                    console.log(JSON.stringify(territoryTransforms, null, 2));
                    break;
            }

            if (changed) {
                generateTerritoryShapes();
                drawMap();
                console.log(`${selectedTerritoryForEdit} modificato:`, transform);
            }
        }
    });
}

// INIZIALIZZAZIONE

// Inizializza il gioco quando la pagina è caricata
window.addEventListener('load', () => {
    initGame();
    setupKeyboardControls();

    // Messaggio di benvenuto
    setTimeout(() => {
        addLogEntry('🗺️ Mappa dell\'Orto Globale caricata! Esplorate le 5 regioni principali!', 'log-special');
        addLogEntry('⌨️ Controlli: R=Rinforzi, E=Fine Turno, A=Attacco, S=Abilità, C=Pesca Carta, V=Visualizza Carte', 'log-move');
        addLogEntry('🛠️ Editing: TAB=Modalità Edit, poi clicca territorio e usa WASD, QE, CV, RF, ZX', 'log-move');
    }, 2000);
});

// Funzioni per il brush editing (AGGIUNGI QUESTE)
function handleBrushEdit(x, y) {
    if (!brushEditMode.active || !brushEditMode.selectedTerritory) return;

    const territoryId = brushEditMode.selectedTerritory;
    const points = [...territoryShapes[territoryId]]; // copia

    if (brushEditMode.tool === 'brush') {
        addPointsNearCursor(points, x, y);
    } else if (brushEditMode.tool === 'eraser') {
        removePointsNearCursor(points, x, y);
    }

    // Aggiorna forma temporanea
    territoryShapes[territoryId] = points;
    drawMap();
}

function addPointsNearCursor(points, cursorX, cursorY) {
    // Trova il punto più vicino nella forma esistente
    let closestIndex = 0;
    let closestDistance = Infinity;

    points.forEach((point, index) => {
        const distance = Math.sqrt((point.x - cursorX) ** 2 + (point.y - cursorY) ** 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    // Se il cursore è abbastanza vicino, "espandi" la forma verso di esso
    if (closestDistance < brushEditMode.brushSize) {
        const newPoint = { x: cursorX, y: cursorY };
        points.splice(closestIndex + 1, 0, newPoint);
    }
}

// Conferma le modifiche del pennello
function confirmBrushEdits() {
    const territoryId = brushEditMode.selectedTerritory;

    if (territoryPixelMap[territoryId]) {
        const finalShape = pixelMapToPolygon(territoryPixelMap[territoryId]);

        if (finalShape.length >= 3) {
            territoryShapes[territoryId] = finalShape;

            // SALVA AUTOMATICAMENTE
            saveTerritoryShapes();

            console.log(`✅ Modifiche a ${territoryId} salvate!`);
            exportTerritoryShapes(); // Mostra anche il codice
        }
    }

    // Esci dalla modalità brush
    brushEditMode.active = false;
    brushEditMode.selectedTerritory = null;
    brushEditMode.isDrawing = false;

    drawMap();
}

// Genera codice JavaScript da copiare nel file
function exportTerritoryShapes() {
    console.log('=== COPIA QUESTO CODICE NEL TUO SCRIPT ===');
    console.log('');
    console.log('// Sostituisci la funzione generateTerritoryShapes() con questa:');
    console.log('function generateTerritoryShapes() {');
    console.log('    // Forme personalizzate salvate:');

    Object.entries(territoryShapes).forEach(([territoryId, shape]) => {
        console.log(`    territoryShapes['${territoryId}'] = ${JSON.stringify(shape, null, 8)};`);
    });

    console.log('}');
    console.log('');
    console.log('=== FINE CODICE DA COPIARE ===');
}

function removePointsNearCursor(points, cursorX, cursorY) {
    // Rimuovi tutti i punti dentro il raggio della gomma
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        const distance = Math.sqrt((point.x - cursorX) ** 2 + (point.y - cursorY) ** 2);

        if (distance < brushEditMode.brushSize && points.length > 3) {
            points.splice(i, 1);
        }
    }
}

// Sistema di editing basato su pixel
let territoryPixelMap = {};
let pixelResolution = 2; // Ogni 2 pixel del canvas = 1 pixel della mappa

// Converte territorio in mappa pixel
function territoryToPixelMap(territoryId) {
    const shape = territoryShapes[territoryId];
    const bounds = getTerritoryBounds(shape);
    const map = {};

    // Crea griglia pixel nell'area del territorio
    for (let x = bounds.minX; x <= bounds.maxX; x += pixelResolution) {
        for (let y = bounds.minY; y <= bounds.maxY; y += pixelResolution) {
            if (isPointInPolygon(x, y, shape)) {
                const key = `${Math.floor(x / pixelResolution)},${Math.floor(y / pixelResolution)}`;
                map[key] = true; // pixel è territorio
            }
        }
    }

    return map;
}

// Controlla se punto è dentro poligono
function isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    return inside;
}

// Ottieni bounds del territorio
function getTerritoryBounds(shape) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    shape.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    });

    return { minX, maxX, minY, maxY };
}

// Converte mappa pixel in nuovo poligono
function pixelMapToPolygon(pixelMap) {
    if (Object.keys(pixelMap).length === 0) return [];

    // Trova tutti i pixel di bordo
    const borderPixels = [];

    Object.keys(pixelMap).forEach(key => {
        const [x, y] = key.split(',').map(Number);

        // Controlla se è pixel di bordo (ha almeno un vicino vuoto)
        const neighbors = [
            `${x - 1},${y}`, `${x + 1},${y}`,
            `${x},${y - 1}`, `${x},${y + 1}`
        ];

        const isBorder = neighbors.some(neighbor => !pixelMap[neighbor]);
        if (isBorder) {
            borderPixels.push({ x: x * pixelResolution, y: y * pixelResolution });
        }
    });

    // Ordina i pixel di bordo per creare un poligono
    return orderBorderPixels(borderPixels);
}

// Ordina pixel di bordo in senso orario
function orderBorderPixels(pixels) {
    if (pixels.length < 3) return pixels;

    // Trova centro
    const centerX = pixels.reduce((sum, p) => sum + p.x, 0) / pixels.length;
    const centerY = pixels.reduce((sum, p) => sum + p.y, 0) / pixels.length;

    // Ordina per angolo dal centro
    return pixels.sort((a, b) => {
        const angleA = Math.atan2(a.y - centerY, a.x - centerX);
        const angleB = Math.atan2(b.y - centerY, b.x - centerX);
        return angleA - angleB;
    });
}

// Nuovo sistema brush che lavora sui pixel
function handlePixelBrushEdit(x, y) {
    if (!brushEditMode.active || !brushEditMode.selectedTerritory) return;

    const territoryId = brushEditMode.selectedTerritory;

    // Inizializza mappa pixel se non esiste
    if (!territoryPixelMap[territoryId]) {
        territoryPixelMap[territoryId] = territoryToPixelMap(territoryId);
    }

    const pixelMap = territoryPixelMap[territoryId];
    const brushRadius = brushEditMode.brushSize;

    // Applica pennello/gomma in area circolare
    for (let dx = -brushRadius; dx <= brushRadius; dx += pixelResolution) {
        for (let dy = -brushRadius; dy <= brushRadius; dy += pixelResolution) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= brushRadius) {
                const pixelX = Math.floor((x + dx) / pixelResolution);
                const pixelY = Math.floor((y + dy) / pixelResolution);
                const key = `${pixelX},${pixelY}`;

                if (brushEditMode.tool === 'brush') {
                    pixelMap[key] = true; // Aggiungi pixel
                } else if (brushEditMode.tool === 'eraser') {
                    delete pixelMap[key]; // Rimuovi pixel
                }
            }
        }
    }

    // Ricostruisci il poligono dalla mappa pixel
    const newPolygon = pixelMapToPolygon(pixelMap);
    if (newPolygon.length >= 3) {
        territoryShapes[territoryId] = newPolygon;
        drawMap();
    }
}
