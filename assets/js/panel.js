document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const titleElement = document.getElementById('section-title');
    const notificationBell = document.getElementById('notification-bell');
    const alertsContainer = document.getElementById('alerts-container');

    // ** Lógica para la navegación del menú **
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
            });

            document.getElementById(targetId).classList.add('active');
            titleElement.textContent = e.currentTarget.textContent.trim();
        });
    });

    // ** Lógica para la simulación de datos **
    async function loadPanelData() {
        try {
            const [playersRes, detectionsRes, statsRes] = await Promise.all([
                fetch('data/players.json'),
                fetch('data/detections.json'),
                fetch('data/stats.json')
            ]);
            const players = await playersRes.json();
            const detections = await detectionsRes.json();
            const stats = await statsRes.json();

            updateDashboard(players, detections);
            populatePlayersList(players);
            populateLogs(detections);
            createCharts(detections, stats);
        } catch (error) {
            console.error('Error al cargar datos del panel:', error);
        }
    }

    function updateDashboard(players, detections) {
        document.getElementById('total-players-stat').textContent = players.length;
        const onlinePlayers = players.filter(p => p.status === 'online').length;
        document.getElementById('online-players-stat').textContent = onlinePlayers;
        document.getElementById('daily-detections-stat').textContent = detections.length;
        const avgRisk = players.reduce((sum, p) => sum + p.risk_score, 0) / players.length;
        document.getElementById('avg-risk-stat').textContent = avgRisk.toFixed(2);
    }

    function populatePlayersList(players) {
        const tbody = document.getElementById('player-list-body');
        tbody.innerHTML = '';
        players.forEach(player => {
            const row = `
                <tr>
                    <td>${player.id}</td>
                    <td>${player.name}</td>
                    <td class="status-${player.status}">${player.status}</td>
                    <td>${player.device}</td>
                    <td>${player.risk_score}</td>
                    <td>${player.last_login}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    function populateLogs(detections) {
        const logEntries = document.getElementById('log-entries');
        logEntries.innerHTML = '';
        detections.forEach(det => {
            const entry = `
                <div class="log-entry">
                    <p><strong>Jugador:</strong> ${det.player_name}</p>
                    <p><strong>Tipo:</strong> ${det.type}</p>
                    <p><strong>Acción:</strong> ${det.action}</p>
                    <p><strong>Evidencia:</strong> ${det.evidence}</p>
                </div>
            `;
            logEntries.innerHTML += entry;
        });
    }

    function createCharts(detections, stats) {
        const ctxDetections = document.getElementById('detectionsChart').getContext('2d');
        const detectionTypes = {};
        detections.forEach(det => {
            detectionTypes[det.type] = (detectionTypes[det.type] || 0) + 1;
        });
        new Chart(ctxDetections, {
            type: 'bar',
            data: {
                labels: Object.keys(detectionTypes),
                datasets: [{
                    label: 'Detecciones',
                    data: Object.values(detectionTypes),
                    backgroundColor: 'rgba(0, 174, 239, 0.6)',
                }]
            }
        });

        const ctxSanctions = document.getElementById('sanctionsChart').getContext('2d');
        new Chart(ctxSanctions, {
            type: 'line',
            data: {
                labels: stats.sanctions.map(s => s.date),
                datasets: [{
                    label: 'Sanciones Diarias',
                    data: stats.sanctions.map(s => s.count),
                    borderColor: 'rgba(102, 204, 255, 1)',
                    borderWidth: 2,
                }]
            }
        });
    }

    // ** Lógica para APIs y archivos .lua **
    const apiSection = document.getElementById('api');
    const apiKeyDisplay = document.getElementById('api-key-display');
    const copyBtn = document.getElementById('copy-btn');
    const configFilesContainer = document.getElementById('config-files');
    const fileContentEditor = document.getElementById('file-content-editor');
    const fileContent = document.getElementById('file-content');
    
    // Generación de API key aleatoria
    function generateApiKey() {
        const length = 32;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return `chronos-shield-${result}`;
    }

    // Carga y muestra la API key
    if (apiSection) {
        apiKeyDisplay.textContent = generateApiKey();
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(apiKeyDisplay.textContent);
            alert('API Key copiada al portapapeles!');
        });
    }

    // Cargar y mostrar contenido de archivos .lua
    if (configFilesContainer) {
        configFilesContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('file-item')) {
                const fileName = e.target.getAttribute('data-file');
                try {
                    const response = await fetch(`data/configs/${fileName}`);
                    const content = await response.text();
                    fileContent.textContent = content;
                    fileContentEditor.style.display = 'block';
                } catch (error) {
                    fileContent.textContent = `Error al cargar el archivo ${fileName}.`;
                    fileContentEditor.style.display = 'block';
                }
            }
        });
    }

    // ** Simulación de alertas en tiempo real **
    const alerts = [
        { message: 'Jugador `xX_Cheater_Xx` detectado usando Speed Hack. Acción: Kick', type: 'warning' },
        { message: 'Conexión sospechosa de IP: `192.168.1.1` detectada.', type: 'info' },
        { message: '¡Alerta! `HackerKing` ha sido detectado con múltiples exploits. Acción: Ban automático.', type: 'critical' },
    ];
    let alertIndex = 0;

    notificationBell.addEventListener('click', () => {
        alertsContainer.style.display = alertsContainer.style.display === 'block' ? 'none' : 'block';
    });

    setInterval(() => {
        if (alertIndex < alerts.length) {
            const alert = alerts[alertIndex];
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${alert.type}`;
            alertDiv.textContent = alert.message;
            alertsContainer.prepend(alertDiv);
            alertIndex++;
        }
    }, 5000); // Muestra una nueva alerta cada 5 segundos

    // Carga inicial de datos
    loadPanelData();
});