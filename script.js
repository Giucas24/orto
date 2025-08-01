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
            territories: ['bulbopoli', 'tropea', 'scalogna'],
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
            territories: ['carrot', 'orange', 'root'],
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
            territories: ['greenvalley', 'forest', 'cavolonero'],
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
            territories: ['sanmarzano', 'cherry', 'pachino'],
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

// Tipi di territorio e loro caratteristiche
const territoryTypes = {
    // Territori di montagna (bonus Cavolfiori)
    'snowpeak': { type: 'mountain', name: 'Snow Peak', region: 'cavolfiori' },
    'frostland': { type: 'mountain', name: 'Frost Land', region: 'cavolfiori' },
    'iceberg': { type: 'mountain', name: 'Iceberg', region: 'cavolfiori' },
    'bulbopoli': { type: 'humid', name: 'Bulbopoli', region: 'cipollandia' },

    // Territori fertili (bonus Broccoli)
    'greenvalley': { type: 'fertile', name: 'Green Valley', region: 'broccolandia' },
    'forest': { type: 'fertile', name: 'Broccoli Forest', region: 'broccolandia' },
    'compost': { type: 'fertile', name: 'Compost Works', region: 'mercato' },

    // Territori secchi (debolezza Pomodori)
    'orange': { type: 'dry', name: 'Orange County', region: 'carotegna' },
    'root': { type: 'dry', name: 'Root Deep', region: 'carotegna' },

    // Altri territori
    'tropea': { type: 'humid', name: 'Tropea Fields', region: 'cipollandia' },
    'scalogna': { type: 'normal', name: 'Scalogna Valley', region: 'cipollandia' },
    'carrot': { type: 'normal', name: 'Carrot City', region: 'carotegna' },
    'sanmarzano': { type: 'hot', name: 'San Marzano', region: 'tomatosia' },
    'cherry': { type: 'hot', name: 'Cherry Valley', region: 'tomatosia' },
    'pachino': { type: 'hot', name: 'Pachino Coast', region: 'tomatosia' },
    'cavolonero': { type: 'fertile', name: 'Cavolo Nero', region: 'broccolandia' },
    'bazaar': { type: 'market', name: 'Grand Bazaar', region: 'mercato' },
    'seedbank': { type: 'market', name: 'Seed Bank', region: 'mercato' },
    'greenhouse': { type: 'market', name: 'Greenhouse Labs', region: 'mercato' }
};

// Adiacenze tra territori
const adjacencies = {
    'bulbopoli': ['tropea', 'scalogna', 'bazaar'],
    'tropea': ['bulbopoli', 'scalogna', 'carrot', 'bazaar'],
    'scalogna': ['bulbopoli', 'tropea', 'bazaar', 'compost'],
    'carrot': ['tropea', 'orange', 'root', 'seedbank'],
    'orange': ['carrot', 'root', 'seedbank', 'greenhouse'],
    'root': ['carrot', 'orange', 'seedbank', 'compost'],
    'sanmarzano': ['cherry', 'pachino', 'bazaar', 'compost'],
    'cherry': ['sanmarzano', 'pachino', 'compost', 'greenvalley'],
    'pachino': ['sanmarzano', 'cherry', 'compost', 'greenvalley'],
    'greenvalley': ['cherry', 'pachino', 'forest', 'cavolonero', 'compost', 'greenhouse'],
    'forest': ['greenvalley', 'cavolonero', 'greenhouse'],
    'cavolonero': ['greenvalley', 'forest', 'greenhouse'],
    'snowpeak': ['frostland', 'iceberg', 'seedbank'],
    'frostland': ['snowpeak', 'iceberg', 'orange', 'greenhouse'],
    'iceberg': ['snowpeak', 'frostland', 'greenhouse'],
    'bazaar': ['bulbopoli', 'tropea', 'scalogna', 'sanmarzano', 'seedbank', 'compost'],
    'seedbank': ['carrot', 'orange', 'root', 'snowpeak', 'bazaar', 'compost', 'greenhouse'],
    'compost': ['scalogna', 'root', 'sanmarzano', 'cherry', 'pachino', 'greenvalley', 'bazaar', 'seedbank', 'greenhouse'],
    'greenhouse': ['orange', 'frostland', 'iceberg', 'greenvalley', 'forest', 'cavolonero', 'seedbank', 'compost']
};

// Relazioni tra fazioni
const factionRelations = {
    0: { weakness: [2], aerial: true }, // Cavolfiori vs Carote
    1: { bonus: [0, 2, 3, 4], bulb: true }, // Cipolle vs tutti tranne se stessi
    2: { weakness: [0, 3], root: true }, // Carote vs aeree
    3: { aerial: true }, // Broccoli
    4: { weakness: [] } // Pomodori (territorio-dipendente)
};

// Inizializzazione del gioco
function initGame() {
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
    ['bazaar', 'seedbank', 'compost', 'greenhouse'].forEach(territoryId => {
        gameState.territories[territoryId] = {
            owner: -1, // neutrale
            units: 1
        };
    });

    drawConnections();
    updateDisplay();
    addEventListeners();
    addLogEntry('🎮 Benvenuti all\'Orto Conquista! Che la battaglia vegetale abbia inizio!', 'log-special');

    // Mostra overlay fase iniziale
    showPhaseOverlay('reinforcement');
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

    // Nasconde automaticamente dopo 2 secondi
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2000);
}

// Controllo automatico transizione fasi
function checkPhaseTransition() {
    if (gameState.phase === 'reinforcement' && gameState.reinforcements === 0) {
        setTimeout(() => {
            gameState.phase = 'attack';
            document.getElementById('attack-btn').disabled = false;
            addLogEntry(`⚔️ Fase attacco iniziata automaticamente per i ${gameState.players[gameState.currentPlayer].name}`, 'log-move');
            showPhaseOverlay('attack');
            updateDisplay();
        }, 1000);
    }
}

// Disegna le connessioni tra territori
function drawConnections() {
    const connectionsGroup = document.getElementById('connections');
    connectionsGroup.innerHTML = '';

    Object.entries(adjacencies).forEach(([territoryId, connections]) => {
        const territory1 = document.getElementById(territoryId);
        if (!territory1) return;

        connections.forEach(connectedId => {
            const territory2 = document.getElementById(connectedId);
            if (!territory2) return;

            // Evita linee duplicate
            if (territoryId < connectedId) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', territory1.getAttribute('cx'));
                line.setAttribute('y1', territory1.getAttribute('cy'));
                line.setAttribute('x2', territory2.getAttribute('cx'));
                line.setAttribute('y2', territory2.getAttribute('cy'));
                line.setAttribute('stroke', '#8d6e63');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                line.setAttribute('opacity', '0.6');
                connectionsGroup.appendChild(line);
            }
        });
    });
}

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
            territoryTypes[tId] && territoryTypes[tId].type === 'fertile'
        ).length;
        reinforcements += fertileTerritories * 2;
    }

    // Bonus regioni complete
    reinforcements += calculateRegionBonuses(playerIndex);

    return reinforcements;
}

// Calcola bonus regioni
function calculateRegionBonuses(playerIndex) {
    const player = gameState.players[playerIndex];
    const regions = {};

    player.territories.forEach(tId => {
        const territory = territoryTypes[tId];
        if (territory && territory.region) {
            if (!regions[territory.region]) regions[territory.region] = 0;
            regions[territory.region]++;
        }
    });

    let bonus = 0;
    if (regions.cipollandia === 3) bonus += 3;
    if (regions.carotegna === 3) bonus += 4;
    if (regions.tomatosia === 3) bonus += 3;
    if (regions.broccolandia === 3) bonus += 3;
    if (regions.cavolfiori === 3) bonus += 3;
    if (regions.mercato === 4) bonus += 5;

    return bonus;
}

// Usa abilità leader
function useLeaderAbility() {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    if (currentPlayer.abilityUsed) {
        addLogEntry('❌ Abilità già usata questo turno!', 'log-attack');
        return;
    }

    switch (gameState.currentPlayer) {
        case 0: // Cavolfiori - Resistenza Glaciale
            useResistenzaGlaciale();
            break;
        case 1: // Cipolle - Lacrime Corrosive
            useLacrimeCorrosive();
            break;
        case 2: // Carote - Vista Acuta
            useVistaAcuta();
            break;
        case 3: // Broccoli - Germogli Selvaggi
            useGermogliSelvaggi();
            break;
        case 4: // Pomodori - Polpa Esplosiva
            usePolpaEsplosiva();
            break;
    }

    currentPlayer.abilityUsed = true;
    updateDisplay();
}

// Abilità specifiche
function useResistenzaGlaciale() {
    const player = gameState.players[gameState.currentPlayer];
    const damagedTerritories = player.territories.filter(tId => {
        const territory = gameState.territories[tId];
        return territory && territory.units < 3;
    });

    if (damagedTerritories.length > 0) {
        const randomTerritory = damagedTerritories[Math.floor(Math.random() * damagedTerritories.length)];
        gameState.territories[randomTerritory].units++;
        addLogEntry(`❄️ Resistenza Glaciale: +1 unità rigenerata in ${territoryTypes[randomTerritory].name}!`, 'log-special');
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
        adjacencies[tId].forEach(adjId => {
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
        addLogEntry(`🥦 Germogli Selvaggi: +1 unità evocata in ${territoryTypes[randomTerritory].name}!`, 'log-special');
    }
}

function usePolpaEsplosiva() {
    addLogEntry('🍅 Polpa Esplosiva attiva: il prossimo attacco farà danni collaterali!', 'log-special');
}

// Gestisce il click sui territori
function addEventListeners() {
    document.querySelectorAll('.territory').forEach(territory => {
        territory.addEventListener('click', handleTerritoryClick);
    });
}

function handleTerritoryClick(event) {
    const territoryId = event.target.id;
    const territory = gameState.territories[territoryId];

    if (gameState.phase === 'reinforcement') {
        if (territory && territory.owner === gameState.currentPlayer && gameState.reinforcements > 0) {
            territory.units++;
            gameState.reinforcements--;
            addLogEntry(`➕ +1 unità piazzata in ${territoryTypes[territoryId].name}`, 'log-move');
            updateDisplay();
            checkPhaseTransition(); // Controlla se passare automaticamente alla fase successiva
        }
    } else if (gameState.phase === 'attack') {
        if (!gameState.selectedTerritory) {
            if (territory && territory.owner === gameState.currentPlayer && territory.units > 1) {
                selectTerritory(territoryId);
            }
        } else if (gameState.selectedTerritory === territoryId) {
            deselectTerritory();
        } else {
            if (territory && territory.owner !== gameState.currentPlayer &&
                adjacencies[gameState.selectedTerritory].includes(territoryId)) {
                performBattle(gameState.selectedTerritory, territoryId);
            }
        }
    }
}

function selectTerritory(territoryId) {
    deselectTerritory();
    gameState.selectedTerritory = territoryId;

    // Evidenzia il territorio selezionato
    const territory = document.getElementById(territoryId);
    territory.classList.add('selected');

    // Crea overlay visivo per selezione
    const overlay = document.getElementById('selection-overlay');
    const selectionCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    selectionCircle.setAttribute('id', 'selection-indicator');
    selectionCircle.setAttribute('cx', territory.getAttribute('cx'));
    selectionCircle.setAttribute('cy', territory.getAttribute('cy'));
    selectionCircle.setAttribute('r', '30');
    selectionCircle.setAttribute('fill', 'none');
    selectionCircle.setAttribute('stroke', '#ff4444');
    selectionCircle.setAttribute('stroke-width', '4');
    selectionCircle.setAttribute('stroke-dasharray', '10,5');
    selectionCircle.style.animation = 'pulse 1.5s infinite';
    overlay.appendChild(selectionCircle);

    // Evidenzia territori attaccabili
    adjacencies[territoryId].forEach(adjId => {
        const adjTerritory = gameState.territories[adjId];
        if (adjTerritory && adjTerritory.owner !== gameState.currentPlayer) {
            const adjElement = document.getElementById(adjId);
            adjElement.classList.add('attackable');

            // Crea overlay per territori attaccabili
            const attackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            attackCircle.setAttribute('class', 'attack-indicator');
            attackCircle.setAttribute('cx', adjElement.getAttribute('cx'));
            attackCircle.setAttribute('cy', adjElement.getAttribute('cy'));
            attackCircle.setAttribute('r', '28');
            attackCircle.setAttribute('fill', 'none');
            attackCircle.setAttribute('stroke', '#00ff00');
            attackCircle.setAttribute('stroke-width', '3');
            attackCircle.setAttribute('stroke-dasharray', '8,8');
            attackCircle.style.animation = 'attackGlow 1.5s infinite';
            overlay.appendChild(attackCircle);
        }
    });
}

function deselectTerritory() {
    if (gameState.selectedTerritory) {
        document.getElementById(gameState.selectedTerritory).classList.remove('selected');
        gameState.selectedTerritory = null;
    }

    // Rimuovi tutti gli overlay
    const overlay = document.getElementById('selection-overlay');
    overlay.innerHTML = '';

    // Rimuovi classi attackable
    document.querySelectorAll('.attackable').forEach(el => {
        el.classList.remove('attackable');
    });
}

// Aggiorna display delle unità con stile migliorato
function updateUnitDisplay() {
    const unitCountsGroup = document.getElementById('unit-counts');
    unitCountsGroup.innerHTML = '';

    Object.entries(gameState.territories).forEach(([territoryId, territory]) => {
        const territoryElement = document.getElementById(territoryId);
        if (territoryElement) {
            // Crea sfondo per il numero
            const background = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            background.setAttribute('cx', territoryElement.getAttribute('cx'));
            background.setAttribute('cy', territoryElement.getAttribute('cy'));
            background.setAttribute('r', '12');

            if (territory.owner === gameState.currentPlayer) {
                background.setAttribute('fill', '#ffeb3b');
                background.setAttribute('stroke', '#f57f17');
            } else if (territory.owner === -1) {
                background.setAttribute('fill', '#fff');
                background.setAttribute('stroke', '#666');
            } else {
                background.setAttribute('fill', gameState.players[territory.owner].color);
                background.setAttribute('stroke', '#333');
            }
            background.setAttribute('stroke-width', '2');
            unitCountsGroup.appendChild(background);

            // Crea testo numero unità
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'unit-count');
            text.setAttribute('x', territoryElement.getAttribute('cx'));
            text.setAttribute('y', parseInt(territoryElement.getAttribute('cy')) + 5);
            text.textContent = territory.units;
            text.setAttribute('fill', '#333');
            text.setAttribute('stroke', 'none');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', 'bold');
            unitCountsGroup.appendChild(text);
        }
    });
}

// Battaglia migliorata
function performBattle(fromId, toId) {
    const attacker = gameState.territories[fromId];
    const defender = gameState.territories[toId];
    const attackerPlayer = gameState.players[gameState.currentPlayer];
    const defenderPlayer = defender.owner === -1 ? null : gameState.players[defender.owner];

    gameState.battleCount++;

    // Calcola modificatori
    let attackBonus = 0;
    let defenseBonus = 0;

    // Bonus fazioni
    const relations = factionRelations[gameState.currentPlayer];
    if (defenderPlayer && relations.weakness && relations.weakness.includes(defender.owner)) {
        attackBonus -= 1;
        addLogEntry(`⚠️ ${attackerPlayer.name} subisce malus vs ${defenderPlayer.name}`, 'log-attack');
    }

    if (gameState.currentPlayer === 1 && defenderPlayer && !factionRelations[defender.owner]?.bulb) {
        attackBonus += 1;
        addLogEntry(`🧅 Bonus Cipolle: +1 attacco vs non-bulbo`, 'log-attack');
    }

    if (gameState.currentPlayer === 4 && attacker.units >= 5) {
        attackBonus += 1;
        addLogEntry(`🍅 Bonus Pomodori: +1 attacco per grande esercito`, 'log-attack');
    }

    // Bonus territori
    const defenderTerritoryType = territoryTypes[toId];
    if (defenderTerritoryType && defenderPlayer) {
        if (defender.owner === 0 && defenderTerritoryType.type === 'mountain') {
            defenseBonus += 1;
            addLogEntry(`❄️ Bonus Cavolfiori: +1 difesa in montagna`, 'log-defend');
        }

        if (gameState.currentPlayer === 4 &&
            (defenderTerritoryType.type === 'dry' || defenderTerritoryType.type === 'mountain')) {
            attackBonus -= 1;
            addLogEntry(`🍅 Malus Pomodori: territorio sfavorevole`, 'log-attack');
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

    // Mostra i dadi
    showDiceRoll(attackerDice, defenderDice);

    const fromName = territoryTypes[fromId].name;
    const toName = territoryTypes[toId].name;

    addLogEntry(`⚔️ ${fromName} (${attackerDice}) attacca ${toName} (${defenderDice})`, 'log-attack');

    if (attackerDice > defenderDice) {
        // Attaccante vince
        defender.units--;
        addLogEntry(`💥 ${toName} perde 1 unità!`, 'log-attack');

        // Abilità Polpa Esplosiva
        if (gameState.currentPlayer === 4 && attackerPlayer.abilityUsed) {
            adjacencies[toId].forEach(adjId => {
                const adjTerritory = gameState.territories[adjId];
                if (adjTerritory && adjTerritory.owner !== gameState.currentPlayer &&
                    adjTerritory.owner !== -1 && adjTerritory.units > 1) {
                    adjTerritory.units--;
                    addLogEntry(`💥 Polpa Esplosiva colpisce ${territoryTypes[adjId].name}!`, 'log-attack');
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

            // Cambia colore territorio
            document.getElementById(toId).className = `territory ${getFactionClass(gameState.currentPlayer)}`;

            // Controlla vittoria
            checkVictory();
        }
    } else {
        // Difensore vince
        attacker.units--;
        addLogEntry(`🛡️ ${fromName} perde 1 unità nell'attacco fallito!`, 'log-defend');
    }

    deselectTerritory();
    updateDisplay();
}

function showDiceRoll(attackerDice, defenderDice) {
    // Rimuovi dadi precedenti
    document.querySelectorAll('.dice').forEach(dice => dice.remove());

    // Crea contenitore dadi
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

function getFactionClass(playerIndex) {
    const classes = ['cavolfiori', 'cipolle', 'carote', 'broccoli', 'pomodori'];
    return classes[playerIndex] || 'neutrale';
}

// Piazza rinforzi automaticamente
function placeReinforcements() {
    const playerTerritories = gameState.players[gameState.currentPlayer].territories
        .filter(tId => gameState.territories[tId]);

    while (gameState.reinforcements > 0 && playerTerritories.length > 0) {
        const borderTerritories = playerTerritories.filter(tId => {
            return adjacencies[tId].some(adjId => {
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
    checkPhaseTransition(); // Controlla transizione automatica
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

    // Abilità passive fine turno
    if (gameState.currentPlayer === 3) { // Broccoli - Crescita Rapida
        const player = gameState.players[3];
        player.territories.forEach(tId => {
            const territory = gameState.territories[tId];
            if (territory && territory.units === 1) {
                territory.units++;
                addLogEntry(`🌱 Crescita Rapida: +1 unità in ${territoryTypes[tId].name}`, 'log-special');
            }
        });
    }

    deselectTerritory();

    // Reset bottoni
    document.getElementById('attack-btn').disabled = true;
    document.getElementById('end-turn').disabled = true;
    document.getElementById('attack-btn').textContent = '⚔️ Modalità Attacco';
    document.getElementById('attack-btn').style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';

    const currentPlayer = gameState.players[gameState.currentPlayer];
    addLogEntry(`🔄 Turno ${gameState.turn}: ${currentPlayer.emoji} ${currentPlayer.name} inizia!`, 'log-move');

    // Mostra overlay nuova fase
    showPhaseOverlay('reinforcement');
    updateDisplay();
}

// Sistema carte evento migliorato
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

    // Mostra la carta pescata
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

    // Aggiungi la carta alla mano del giocatore se non utilizzata
    if (gameState.drawnCard) {
        gameState.players[gameState.currentPlayer].cards.push(gameState.drawnCard);
        gameState.drawnCard = null;
        updatePlayerCardsDisplay();
    }
}

function useDrawnCard() {
    if (gameState.drawnCard) {
        playEventCard(gameState.drawnCard);
        gameState.drawnCard = null;
        document.getElementById('card-drawn-overlay').style.display = 'none';
    }
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
            break;
        case 'destroy':
            // Implementazione semplificata - colpisce territorio nemico casuale
            const enemyTerritories = [];
            Object.entries(gameState.territories).forEach(([tId, territory]) => {
                if (territory.owner !== gameState.currentPlayer && territory.owner !== -1) {
                    enemyTerritories.push(tId);
                }
            });
            if (enemyTerritories.length > 0) {
                const target = enemyTerritories[Math.floor(Math.random() * enemyTerritories.length)];
                gameState.territories[target].units = Math.max(1, gameState.territories[target].units - card.power);
                addLogEntry(`💥 ${card.name}: ${territoryTypes[target].name} devastato!`, 'log-special');
            }
            break;
        case 'extra_attacks':
            addLogEntry(`⚡ ${card.name}: Puoi effettuare ${card.power} attacchi extra!`, 'log-special');
            // Logica per attacchi extra qui
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
            }
            break;
    }

    updateDisplay();
}

function updateCardsDisplay() {
    document.getElementById('cards-remaining').textContent = gameState.cardsRemaining;
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

    // Controllo dominazione territorio
    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (currentPlayer.territories.length >= 12) {
        showVictory(currentPlayer);
        return;
    }

    // Controllo regioni complete
    const regionCount = calculateCompleteRegions(gameState.currentPlayer);
    if (regionCount >= 2) {
        showVictory(currentPlayer);
        return;
    }
}

function calculateCompleteRegions(playerIndex) {
    const player = gameState.players[playerIndex];
    const regions = {};

    player.territories.forEach(tId => {
        const territory = territoryTypes[tId];
        if (territory && territory.region) {
            if (!regions[territory.region]) regions[territory.region] = 0;
            regions[territory.region]++;
        }
    });

    let completeRegions = 0;
    if (regions.cipollandia === 3) completeRegions++;
    if (regions.carotegna === 3) completeRegions++;
    if (regions.tomatosia === 3) completeRegions++;
    if (regions.broccolandia === 3) completeRegions++;
    if (regions.cavolfiori === 3) completeRegions++;
    if (regions.mercato === 4) completeRegions++;

    return completeRegions;
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

// Aggiorna display principale
function updateDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Info giocatore corrente
    document.getElementById('player-name').textContent = currentPlayer.name;
    document.getElementById('player-emoji').textContent = currentPlayer.emoji;
    document.getElementById('player-color').style.background = currentPlayer.color;
    document.getElementById('turn-counter').textContent = gameState.turn;

    // Fase corrente
    const phaseNames = {
        'reinforcement': 'Rinforzi',
        'attack': 'Attacco',
        'move': 'Movimento'
    };
    document.getElementById('current-phase').textContent = phaseNames[gameState.phase];

    // Info fazione dettagliate
    document.getElementById('faction-name').textContent = `${currentPlayer.emoji} Clan dei ${currentPlayer.name}`;
    document.getElementById('leader-name').textContent = currentPlayer.leader;
    document.getElementById('ability-name').textContent = currentPlayer.ability;
    document.getElementById('ability-desc').textContent = currentPlayer.abilityDescription;
    document.getElementById('faction-bonus').textContent = currentPlayer.bonus;
    document.getElementById('faction-weakness').textContent = currentPlayer.weakness;

    document.getElementById('territory-count').textContent = currentPlayer.territories.length;
    document.getElementById('reinforcements').textContent = gameState.reinforcements;
    document.getElementById('battle-count').textContent = gameState.battleCount;

    // Bottone abilità leader
    const abilityBtn = document.getElementById('leader-ability');
    abilityBtn.disabled = currentPlayer.abilityUsed || gameState.phase !== 'attack';
    abilityBtn.textContent = currentPlayer.abilityUsed ? '✅ Abilità Usata' : '🌟 Usa Abilità Leader';

    // Aggiorna colore bordo info fazione
    const factionInfo = document.getElementById('faction-info');
    factionInfo.style.borderLeftColor = currentPlayer.color;

    // Aggiorna visualizzazione unità
    updateUnitDisplay();

    // Aggiorna stato bottoni
    document.getElementById('place-reinforcements').disabled =
        gameState.reinforcements === 0 || gameState.phase !== 'reinforcement';

    // Rimuovi il bottone "Prossima Fase" dato che ora è automatico
    // document.getElementById('next-phase').disabled = ...

    // Bottone fine turno abilitato solo in fase movimento
    document.getElementById('end-turn').disabled = gameState.phase !== 'move';

    // Aggiorna display carte
    updateCardsDisplay();
    updatePlayerCardsDisplay();

    // Abilita fase movimento automatica se necessario
    if (gameState.phase === 'move') {
        enableMovementPhase();
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

// Funzioni di movimento (fase 3)
function enableMovementPhase() {
    if (gameState.phase !== 'move') return;

    addLogEntry('🚶 Clicca un territorio per spostare unità (opzionale)', 'log-move');

    // Auto-consolidamento suggerito
    setTimeout(() => {
        autoConsolidateDefenses();
        // Passa automaticamente al turno successivo dopo movimento
        setTimeout(() => {
            endTurn();
        }, 2000);
    }, 1000);
}

function autoConsolidateDefenses() {
    const player = gameState.players[gameState.currentPlayer];
    let movementsMade = 0;

    player.territories.forEach(fromId => {
        const fromTerritory = gameState.territories[fromId];
        if (fromTerritory && fromTerritory.units > 3) {
            // Cerca territori adiacenti del giocatore che hanno solo 1 unità
            const weakAdjacent = adjacencies[fromId].filter(adjId => {
                const adjTerritory = gameState.territories[adjId];
                return adjTerritory && adjTerritory.owner === gameState.currentPlayer && adjTerritory.units === 1;
            });

            if (weakAdjacent.length > 0 && movementsMade < 2) {
                const targetId = weakAdjacent[0];
                const unitsToMove = Math.floor(fromTerritory.units / 2);

                fromTerritory.units -= unitsToMove;
                gameState.territories[targetId].units += unitsToMove;

                addLogEntry(`🚚 Auto-consolidamento: ${unitsToMove} unità da ${territoryTypes[fromId].name} a ${territoryTypes[targetId].name}`, 'log-move');
                movementsMade++;
            }
        }
    });

    if (movementsMade === 0) {
        addLogEntry('🛡️ Posizioni difensive ottimali mantenute', 'log-move');
    }

    updateDisplay();
}

// Easter eggs e animazioni
function addVegetableEasterEgg() {
    const messages = [
        '🥕 Una carota sussurra: "La vittoria è a portata di radice!"',
        '🧅 Una cipolla piange: "Lacrime di gioia per questa battaglia!"',
        '🥦 Un broccolo medita: "La crescita richiede pazienza..."',
        '🍅 Un pomodoro esplode: "Tutto rosso di passione!"',
        '❄️ Un cavolfiore trema: "Il freddo non ferma la determinazione!"'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    addLogEntry(randomMessage, 'log-special');
}

// Sistema di suggerimenti per nuovi giocatori
function showHints() {
    if (gameState.turn === 1) {
        setTimeout(() => {
            addLogEntry('💡 Suggerimento: Rinforza i territori di confine per difenderti meglio!', 'log-move');
        }, 3000);
    }

    if (gameState.turn === 2 && gameState.currentPlayer === 0) {
        setTimeout(() => {
            addLogEntry('💡 Suggerimento: Usa l\'abilità del leader per ottenere vantaggi speciali!', 'log-special');
        }, 2000);
    }

    if (gameState.battleCount === 1) {
        setTimeout(() => {
            addLogEntry('💡 Suggerimento: Conquista il Mercato Centrale per bonus potenti!', 'log-move');
        }, 4000);
    }
}

// Meccaniche avanzate per bilanciamento
function applyEndGameBoosts() {
    if (gameState.turn >= 15) {
        // Dopo turno 15, tutti ricevono +2 rinforzi (escalation)
        gameState.reinforcements += 2;
        addLogEntry('⚡ Escalation bellica: +2 rinforzi bonus per l\'intensificarsi della battaglia!', 'log-special');
    }

    if (gameState.turn >= 18) {
        // Turno 18: Carte evento hanno effetto doppio
        addLogEntry('🔥 Battaglia finale: Gli eventi sono ora DEVASTANTI!', 'log-special');
    }
}

// Controllo stati di stallo
function checkStalemate() {
    if (gameState.turn >= 20) {
        // Sudden death - chi ha più territori vince
        const playerScores = gameState.players.map((player, index) => ({
            index,
            territories: player.territories.length,
            name: player.name,
            emoji: player.emoji
        })).filter(p => p.territories > 0);

        playerScores.sort((a, b) => b.territories - a.territories);

        if (playerScores[0].territories > playerScores[1]?.territories || playerScores.length === 1) {
            const winner = gameState.players[playerScores[0].index];
            addLogEntry('⏰ SUDDEN DEATH! Tempo scaduto!', 'log-special');
            showVictory(winner);
        }
    }
}

// Controlli da tastiera
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
            case 'Escape':
                deselectTerritory();
                break;
        }
    });
}

// Inizializza il gioco quando la pagina è caricata
window.addEventListener('load', () => {
    initGame();
    setupKeyboardControls();
    showHints();

    // Aggiungi easter egg casuali
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% di probabilità ogni 5 secondi
            addVegetableEasterEgg();
        }
    }, 5000);

    // Aggiungi messaggio di benvenuto con descrizione della mappa
    setTimeout(() => {
        addLogEntry('🗺️ Mappa dell\'Orto Globale caricata! Esplorate le 6 regioni:', 'log-special');
        addLogEntry('🧅 Cipollandia, 🥕 Carotegna, 🍅 San Marzano, 🥦 Broccolandia, ❄️ Regno Cavolfiori, 🏪 Mercato Centrale', 'log-move');
    }, 2000);

    // Informazioni sui controlli
    setTimeout(() => {
        addLogEntry('⌨️ Controlli: R=Rinforzi, E=Fine Turno, A=Attacco, S=Abilità, C=Pesca Carta, ESC=Deseleziona', 'log-move');
    }, 8000);

    // Aggiungi controllo stallo ogni turno
    const originalEndTurn = endTurn;
    endTurn = function () {
        originalEndTurn();
        applyEndGameBoosts();
        checkStalemate();
    };
});