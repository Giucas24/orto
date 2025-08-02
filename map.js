// Ottieni il canvas e il contesto
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Colori per i territori
const colors = {
    onion: {
        light: '#e6d3f7',
        medium: '#d4b5e8',
        dark: '#a87cc8',
        border: '#6b4e71'
    },
    carrot: {
        light: '#f5d5a8',
        medium: '#e8b977',
        dark: '#c8934a',
        border: '#8b5a2b'
    },
    tomato: {
        light: '#f2c5c5',
        medium: '#e89999',
        dark: '#c46666',
        border: '#8b2635'
    },
    broccoli: {
        light: '#c8e6c9',
        medium: '#a5d6a7',
        dark: '#7cb342',
        border: '#2d5016'
    },
    market: {
        light: '#f5e6a3',
        medium: '#e6d174',
        dark: '#c5a632',
        border: '#8b6914'
    }
};

// Funzione per creare texture di pergamena
function createParchmentTexture() {
    const gradient = ctx.createRadialGradient(500, 350, 50, 500, 350, 600);
    gradient.addColorStop(0, '#f4e8d0');
    gradient.addColorStop(0.3, '#e8dcc0');
    gradient.addColorStop(0.7, '#d4c4a8');
    gradient.addColorStop(1, '#c8b99c');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 700);

    // Aggiungi macchie di invecchiamento
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `hsl(${30 + Math.random() * 20}, 40%, ${20 + Math.random() * 20}%)`;
        ctx.beginPath();
        ctx.arc(
            Math.random() * 1000,
            Math.random() * 700,
            Math.random() * 30 + 10,
            0, Math.PI * 2
        );
        ctx.fill();
    }

    // Texture granulosa
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#8b4513' : '#654321';
        ctx.fillRect(
            Math.random() * 1000,
            Math.random() * 700,
            1, 1
        );
    }

    ctx.globalAlpha = 1;
}

// Funzione per disegnare acqua antica (solo bordi esterni)
function drawAncientSea() {
    ctx.fillStyle = '#6b8db5';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, 1000, 700);

    // Onde decorative sui bordi
    ctx.strokeStyle = '#4a6b8a';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;

    for (let y = 50; y < 700; y += 60) {
        ctx.beginPath();
        for (let x = 0; x < 1000; x += 20) {
            const waveHeight = Math.sin(x * 0.02) * 8;
            if (x === 0) {
                ctx.moveTo(x, y + waveHeight);
            } else {
                ctx.lineTo(x, y + waveHeight);
            }
        }
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}

// Funzione per generare forma organica
function generateOrganicShape(centerX, centerY, baseRadius) {
    const points = [];
    const numPoints = 12 + Math.floor(Math.random() * 8);

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        let variance = 0.6 + Math.random() * 0.8;

        const roughness = Math.sin(angle * 4) * 0.2 + Math.cos(angle * 7) * 0.15;
        variance += roughness;

        const radius = baseRadius * variance;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        points.push({ x, y });
    }

    return points;
}

// Funzione per disegnare territorio organico
function drawOrganicTerritory(centerX, centerY, radius, color, name) {
    const points = generateOrganicShape(centerX, centerY, radius);

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

    // Gradiente per profondità
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.7, color.medium);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;
    ctx.fill();

    // Bordo
    ctx.strokeStyle = color.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texture interna
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = color.dark;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.7;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }

    ctx.globalAlpha = 1;
    ctx.restore();

    // Nome del territorio
    ctx.fillStyle = '#2c1810';
    ctx.font = 'bold 11px serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, centerY + 5);

    return { x: centerX, y: centerY };
}

// Funzione per disegnare il lago centrale che circonda i territori centrali
function drawCentralLake() {
    ctx.save();

    const lakeGradient = ctx.createRadialGradient(500, 350, 60, 500, 350, 120);
    lakeGradient.addColorStop(0, '#7bb3d9');
    lakeGradient.addColorStop(0.7, '#5a9bc4');
    lakeGradient.addColorStop(1, '#4682b4');

    ctx.fillStyle = lakeGradient;
    ctx.globalAlpha = 0.8;

    // Forma esterna del lago (irregolare)
    ctx.beginPath();
    const outerPoints = 16;
    const centerX = 500;
    const centerY = 350;
    const outerRadius = 120;

    for (let i = 0; i < outerPoints; i++) {
        const angle = (i / outerPoints) * Math.PI * 2;
        const variance = 0.8 + Math.random() * 0.4;
        const radius = outerRadius * variance;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();

    // Buco interno per i territori centrali
    const innerPoints = 12;
    const innerRadius = 50;

    for (let i = 0; i < innerPoints; i++) {
        const angle = (i / innerPoints) * Math.PI * 2;
        const variance = 0.9 + Math.random() * 0.2;
        const radius = innerRadius * variance;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();

    ctx.fill('evenodd');

    // Onde del lago
    ctx.strokeStyle = '#4a6b8a';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;

    for (let r = 70; r < 110; r += 15) {
        ctx.beginPath();
        for (let i = 0; i < outerPoints; i++) {
            const angle = (i / outerPoints) * Math.PI * 2;
            const variance = 0.9 + Math.random() * 0.2;
            const radius = r * variance;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

// Funzione per disegnare edifici
function drawBuilding(x, y, type = 'house') {
    ctx.save();

    if (type === 'house') {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x - 4, y - 3, 8, 6);

        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 3);
        ctx.lineTo(x, y - 8);
        ctx.lineTo(x + 5, y - 3);
        ctx.fill();

    } else if (type === 'tower') {
        ctx.fillStyle = '#696969';
        ctx.fillRect(x - 3, y - 10, 6, 12);

        ctx.fillStyle = '#2f4f4f';
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 10);
        ctx.lineTo(x, y - 15);
        ctx.lineTo(x + 4, y - 10);
        ctx.fill();

    } else if (type === 'market') {
        ctx.fillStyle = '#daa520';
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x, y - 8);
        ctx.lineTo(x + 6, y);
        ctx.fill();

        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}

// Funzione per disegnare vegetazione
function drawVegetation(x, y, type = 'tree') {
    ctx.save();

    if (type === 'tree') {
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 1, y - 2, 2, 4);

        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.arc(x, y - 4, 4, 0, Math.PI * 2);
        ctx.fill();

    } else if (type === 'crop') {
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(x - 2, y - 1, 4, 2);

    } else if (type === 'tomato') {
        ctx.fillStyle = '#dc143c';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Funzione per disegnare strade
function drawRoad(startX, startY, endX, endY) {
    ctx.save();
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.globalAlpha = 0.7;

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 50;
    const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 50;
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();

    ctx.restore();
}

// Funzione per disegnare ponti
function drawBridge(startX, startY, endX, endY) {
    ctx.save();

    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = '#5d4e37';
    ctx.lineWidth = 1;

    const numPlanks = 3;
    for (let i = 1; i <= numPlanks; i++) {
        const ratio = i / (numPlanks + 1);
        const plankX = startX + (endX - startX) * ratio;
        const plankY = startY + (endY - startY) * ratio;

        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / length * 3;
        const perpY = dx / length * 3;

        ctx.beginPath();
        ctx.moveTo(plankX + perpX, plankY + perpY);
        ctx.lineTo(plankX - perpX, plankY - perpY);
        ctx.stroke();
    }

    ctx.restore();
}

// Funzione per disegnare confini condivisi tra territori
function drawTerritoryBorder(center1, center2) {
    ctx.save();
    ctx.strokeStyle = '#5d4e37';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.globalAlpha = 0.3;

    ctx.beginPath();
    ctx.moveTo(center1.x, center1.y);
    ctx.lineTo(center2.x, center2.y);
    ctx.stroke();

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

    // Nord
    ctx.beginPath();
    ctx.moveTo(x, y - 25);
    ctx.lineTo(x - 3, y - 10);
    ctx.lineTo(x + 3, y - 10);
    ctx.fill();

    // Sud
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x - 3, y + 10);
    ctx.lineTo(x + 3, y + 10);
    ctx.fill();

    // Est
    ctx.beginPath();
    ctx.moveTo(x + 25, y);
    ctx.lineTo(x + 10, y - 3);
    ctx.lineTo(x + 10, y + 3);
    ctx.fill();

    // Ovest
    ctx.beginPath();
    ctx.moveTo(x - 25, y);
    ctx.lineTo(x - 10, y - 3);
    ctx.lineTo(x - 10, y + 3);
    ctx.fill();

    // Lettere
    ctx.fillStyle = '#8b5a2b';
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', x, y - 35);
    ctx.fillText('S', x, y + 45);
    ctx.fillText('E', x + 35, y + 4);
    ctx.fillText('O', x - 35, y + 4);

    ctx.restore();
}

// Veliero
function drawShip(x, y) {
    ctx.save();

    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 5, y - 20);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y - 15);
    ctx.stroke();

    ctx.fillStyle = '#f5deb3';

    ctx.beginPath();
    ctx.moveTo(x - 5, y - 20);
    ctx.quadraticCurveTo(x + 2, y - 25, x + 8, y - 18);
    ctx.quadraticCurveTo(x + 2, y - 8, x - 5, y - 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 5, y - 15);
    ctx.quadraticCurveTo(x + 10, y - 18, x + 12, y - 12);
    ctx.quadraticCurveTo(x + 10, y - 6, x + 5, y - 3);
    ctx.fill();

    ctx.restore();
}

// Legenda
function drawLegend() {
    const legendX = 700;
    const legendY = 450;

    ctx.fillStyle = '#f4e8d0';
    ctx.fillRect(legendX, legendY, 280, 200);
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY, 280, 200);

    ctx.fillStyle = '#8b5a2b';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('LEGENDA DELLE TERRE', legendX + 140, legendY + 25);

    ctx.font = '11px serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4a4a4a';

    const legendItems = [
        { color: '#6b4e71', text: 'Lacrime - Bonus Attacco', y: 55 },
        { color: '#8b5a2b', text: 'Vista - Rivela Carte', y: 75 },
        { color: '#8b2635', text: 'Polpa - Doppio Danno', y: 95 },
        { color: '#2d5016', text: 'Crescita - Evoca Unità', y: 115 },
        { color: '#8b6914', text: 'Mercato - Centro Commercio', y: 135 }
    ];

    legendItems.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(legendX + 20, legendY + item.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#4a4a4a';
        ctx.fillText(item.text, legendX + 35, legendY + item.y + 4);
    });

    ctx.fillStyle = '#8b5a2b';
    ctx.font = 'italic 10px serif';
    ctx.textAlign = 'center';
    ctx.fillText('"Hic sunt dracones agricolae"', legendX + 140, legendY + 175);
}

// Funzione principale per disegnare la mappa
function drawMap() {
    // Sfondo pergamena
    createParchmentTexture();

    // Mare esterno
    drawAncientSea();

    // Crea i centri dei territori
    const centers = {};

    // CIPOLLANDIA (Nord-Ovest)
    centers.bulbopoli = drawOrganicTerritory(240, 180, 55, colors.onion, 'Bulbopoli');
    centers.tropeaFields = drawOrganicTerritory(360, 150, 60, colors.onion, 'Tropea Fields');
    centers.scalognaValley = drawOrganicTerritory(200, 300, 50, colors.onion, 'Scalogna Valley');

    // CAROTEGNA (Nord-Est)
    centers.carrotCity = drawOrganicTerritory(550, 160, 65, colors.carrot, 'Carrot City');
    centers.orangeCounty = drawOrganicTerritory(720, 200, 55, colors.carrot, 'Orange County');
    centers.rootDeep = drawOrganicTerritory(620, 280, 58, colors.carrot, 'Root Deep');

    // TOMATOSIA (Sud-Ovest)
    centers.sanMarzano = drawOrganicTerritory(220, 450, 52, colors.tomato, 'San Marzano');
    centers.cherryValley = drawOrganicTerritory(320, 530, 48, colors.tomato, 'Cherry Valley');
    centers.pachinoCoast = drawOrganicTerritory(320, 420, 50, colors.tomato, 'Pachino Coast');

    // BROCCOLANDIA (Sud-Est)
    centers.greenValley = drawOrganicTerritory(620, 480, 55, colors.broccoli, 'Green Valley');
    centers.broccoliForest = drawOrganicTerritory(740, 420, 60, colors.broccoli, 'Broccoli Forest');
    centers.cavoloNero = drawOrganicTerritory(680, 580, 52, colors.broccoli, 'Cavolo Nero');

    // Lago centrale
    drawCentralLake();

    // MERCATO CENTRALE (su piccola isola nel lago)
    centers.grandBazaar = drawOrganicTerritory(470, 330, 25, colors.market, 'Grand Bazaar');
    centers.seedBank = drawOrganicTerritory(530, 330, 25, colors.market, 'Seed Bank');
    centers.compostWorks = drawOrganicTerritory(470, 380, 25, colors.market, 'Compost Works');
    centers.greenhouseLabs = drawOrganicTerritory(530, 380, 25, colors.market, 'Greenhouse Labs');

    // Aggiungi edifici e vegetazione
    drawBuilding(centers.bulbopoli.x, centers.bulbopoli.y, 'house');
    drawVegetation(centers.bulbopoli.x - 15, centers.bulbopoli.y - 15, 'crop');

    drawBuilding(centers.tropeaFields.x, centers.tropeaFields.y, 'house');
    drawVegetation(centers.tropeaFields.x - 10, centers.tropeaFields.y - 15, 'crop');
    drawVegetation(centers.tropeaFields.x + 10, centers.tropeaFields.y - 15, 'crop');

    drawVegetation(centers.scalognaValley.x, centers.scalognaValley.y - 10, 'tree');
    drawVegetation(centers.scalognaValley.x + 15, centers.scalognaValley.y + 15, 'tree');

    drawBuilding(centers.carrotCity.x, centers.carrotCity.y, 'tower');
    drawBuilding(centers.carrotCity.x - 15, centers.carrotCity.y - 15, 'house');
    drawBuilding(centers.carrotCity.x + 15, centers.carrotCity.y - 15, 'house');

    drawBuilding(centers.orangeCounty.x, centers.orangeCounty.y, 'house');
    drawVegetation(centers.orangeCounty.x - 15, centers.orangeCounty.y - 15, 'crop');

    drawVegetation(centers.rootDeep.x - 10, centers.rootDeep.y - 15, 'crop');
    drawVegetation(centers.rootDeep.x + 10, centers.rootDeep.y - 15, 'crop');

    drawVegetation(centers.sanMarzano.x - 10, centers.sanMarzano.y - 10, 'tomato');
    drawVegetation(centers.sanMarzano.x + 5, centers.sanMarzano.y - 5, 'tomato');
    drawVegetation(centers.sanMarzano.x + 10, centers.sanMarzano.y + 5, 'tomato');

    drawVegetation(centers.cherryValley.x - 10, centers.cherryValley.y - 10, 'tomato');
    drawVegetation(centers.cherryValley.x + 10, centers.cherryValley.y - 10, 'tomato');

    drawVegetation(centers.pachinoCoast.x, centers.pachinoCoast.y - 10, 'tomato');

    drawVegetation(centers.greenValley.x - 10, centers.greenValley.y - 15, 'tree');
    drawVegetation(centers.greenValley.x + 10, centers.greenValley.y - 15, 'tree');
    drawVegetation(centers.greenValley.x, centers.greenValley.y + 15, 'tree');

    drawVegetation(centers.broccoliForest.x - 10, centers.broccoliForest.y - 15, 'tree');
    drawVegetation(centers.broccoliForest.x + 10, centers.broccoliForest.y - 15, 'tree');
    drawVegetation(centers.broccoliForest.x, centers.broccoliForest.y + 15, 'tree');
    drawVegetation(centers.broccoliForest.x - 5, centers.broccoliForest.y + 5, 'tree');

    drawVegetation(centers.cavoloNero.x - 10, centers.cavoloNero.y - 15, 'crop');
    drawVegetation(centers.cavoloNero.x + 10, centers.cavoloNero.y - 15, 'crop');

    drawBuilding(centers.grandBazaar.x, centers.grandBazaar.y, 'market');
    drawBuilding(centers.seedBank.x, centers.seedBank.y, 'tower');
    drawBuilding(centers.compostWorks.x, centers.compostWorks.y, 'house');
    drawBuilding(centers.greenhouseLabs.x, centers.greenhouseLabs.y, 'house');

    // Ponti che collegano l'isola centrale alla terraferma
    drawBridge(420, 350, 370, 370);  // Verso ovest (Tomatosia)
    drawBridge(580, 350, 630, 360);  // Verso est (Broccolandia)
    drawBridge(500, 300, 500, 250);  // Verso nord (Carotegna)
    drawBridge(500, 410, 480, 460);  // Verso sud (collegamento)

    // Strade organiche che seguono i confini naturali
    drawRoad(300, 200, 520, 220);  // Cipollandia-Carotegna
    drawRoad(250, 350, 370, 370);  // Verso ponte ovest
    drawRoad(630, 360, 680, 430);  // Dal ponte est verso Broccolandia
    drawRoad(350, 480, 580, 500);  // Tomatosia-Broccolandia

    // Nomi delle regioni con posizionamento migliore
    ctx.font = 'bold 18px serif';
    ctx.fillStyle = '#6b4e71';
    ctx.globalAlpha = 0.8;
    ctx.textAlign = 'center';
    ctx.fillText('CIPOLLANDIA', 290, 100);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillText('CAROTEGNA', 640, 100);

    ctx.fillStyle = '#8b2635';
    ctx.fillText('TOMATOSIA', 270, 380);

    ctx.fillStyle = '#2d5016';
    ctx.fillText('BROCCOLANDIA', 700, 380);

    ctx.fillStyle = '#8b6914';
    ctx.font = 'bold 14px serif';
    ctx.fillText('MERCATO CENTRALE', 500, 280);
    ctx.font = 'italic 12px serif';
    ctx.fillText('(Territori Neutrali)', 500, 295);

    ctx.globalAlpha = 1;

    // Aggiungi connessioni visive tra territori che si toccano
    drawTerritoryBorder(centers.bulbopoli, centers.tropeaFields);
    drawTerritoryBorder(centers.tropeaFields, centers.carrotCity);
    drawTerritoryBorder(centers.scalognaValley, centers.pachinoCoast);
    drawTerritoryBorder(centers.pachinoCoast, centers.sanMarzano);
    drawTerritoryBorder(centers.rootDeep, centers.greenValley);
    drawTerritoryBorder(centers.greenValley, centers.broccoliForest);
    drawTerritoryBorder(centers.broccoliForest, centers.cavoloNero);

    // Rosa dei venti
    drawCompass(850, 120);

    // Velieri nel mare esterno
    drawShip(150, 150);
    drawShip(850, 600);

    // Legenda
    drawLegend();
}

// Avvia il disegno quando la pagina è caricata
window.addEventListener('load', function () {
    drawMap();
}); azaar.x, centers.grandB