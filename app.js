// GreenBox IoT Dashboard — Application Logic
// Powered by Aurora AI

document.addEventListener('DOMContentLoaded', () => {
    // ==== 1. RECIPE MANAGER ====
    const recipes = [
        { id: 'basil', name: 'Ceneviz Fesleğeni', emoji: '🌿', stage: 'Büyüme', ph: { min: 5.8, max: 6.2, target: 6.0 }, temp: { min: 20, max: 25, target: 22 }, humidity: { min: 45, max: 60, target: 50 }, light: { target: 400, schedule: '16s AÇIK / 8s KAPALI' }, ec: { min: 1.0, max: 1.6, target: 1.3 }, water: { min: 60, max: 100, target: 80 }, progress: 45 },
        { id: 'lettuce', name: 'Göbek Marul', emoji: '🥬', stage: 'Fide', ph: { min: 5.5, max: 6.0, target: 5.8 }, temp: { min: 16, max: 21, target: 18 }, humidity: { min: 50, max: 70, target: 60 }, light: { target: 300, schedule: '14s AÇIK / 10s KAPALI' }, ec: { min: 0.8, max: 1.2, target: 1.0 }, water: { min: 70, max: 100, target: 85 }, progress: 20 },
        { id: 'tomato', name: 'Çeri Domates', emoji: '🍅', stage: 'Çiçeklenme', ph: { min: 5.5, max: 6.5, target: 6.0 }, temp: { min: 21, max: 27, target: 24 }, humidity: { min: 40, max: 60, target: 50 }, light: { target: 600, schedule: '12s AÇIK / 12s KAPALI' }, ec: { min: 2.0, max: 3.5, target: 2.5 }, water: { min: 50, max: 100, target: 70 }, progress: 75 },
        { id: 'strawberry', name: 'Alp Çileği', emoji: '🍓', stage: 'Meyve Verme', ph: { min: 5.8, max: 6.2, target: 6.0 }, temp: { min: 15, max: 26, target: 20 }, humidity: { min: 60, max: 75, target: 65 }, light: { target: 350, schedule: '14s AÇIK / 10s KAPALI' }, ec: { min: 1.0, max: 1.4, target: 1.2 }, water: { min: 60, max: 100, target: 75 }, progress: 85 },
        { id: 'mint', name: 'Nane', emoji: '🌱', stage: 'Büyüme', ph: { min: 5.5, max: 6.0, target: 5.8 }, temp: { min: 18, max: 24, target: 21 }, humidity: { min: 45, max: 60, target: 50 }, light: { target: 400, schedule: '16s AÇIK / 8s KAPALI' }, ec: { min: 1.2, max: 1.8, target: 1.5 }, water: { min: 60, max: 100, target: 80 }, progress: 55 },
        { id: 'pepper', name: 'Dolmalık Biber', emoji: '🫑', stage: 'Büyüme', ph: { min: 5.5, max: 6.5, target: 6.0 }, temp: { min: 21, max: 26, target: 23 }, humidity: { min: 50, max: 65, target: 55 }, light: { target: 500, schedule: '14s AÇIK / 10s KAPALI' }, ec: { min: 1.5, max: 2.2, target: 1.8 }, water: { min: 60, max: 100, target: 75 }, progress: 40 }
    ];
    let activeRecipe = recipes[0];

    // ==== 2. MACHINE CONTROLS ====
    const machineControls = [
        { id: 'light', name: 'Ana Aydınlatma', icon: '💡', value: 50 },
        { id: 'pump', name: 'Su Pompası', icon: '💧', value: 50 },
        { id: 'fan', name: 'Havalandırma Fanı', icon: '💨', value: 50 },
        { id: 'nutrient', name: 'Besin Enjeksiyonu', icon: '🧪', value: 50 },
        { id: 'ph', name: 'pH Dengeleyici', icon: '⚖️', value: 50 }
    ];

    // ==== 3. NOTIFICATIONS ====
    let unreadNotifs = 0;
    const addNotification = (title, msg, type = 'info') => {
        const notifList = document.getElementById('notif-list');
        if(!notifList) return;
        const emptyMsg = document.getElementById('notif-empty');
        if (emptyMsg) emptyMsg.style.display = 'none';

        const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        let icon = 'ℹ️';
        if(type === 'success') icon = '✅';
        if(type === 'warn') icon = '⚠️';
        if(type === 'error') icon = '🚨';
        if(title === 'Aurora AI') icon = '🌿';

        const notifHtml = `
            <div class="notif-item unread">
                <div class="notif-item-title">${icon} ${title}</div>
                <div class="notif-item-msg">${msg}</div>
                <div class="notif-item-time">${time}</div>
            </div>
        `;
        notifList.insertAdjacentHTML('afterbegin', notifHtml);

        unreadNotifs++;
        const badge = document.getElementById('notif-badge');
        if(badge) {
            badge.textContent = unreadNotifs;
            badge.style.display = 'flex';
        }
    };

    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    
    notifBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
        if (notifDropdown.classList.contains('show')) {
            unreadNotifs = 0;
            const badge = document.getElementById('notif-badge');
            if(badge) badge.style.display = 'none';
            document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-wrapper')) {
            notifDropdown?.classList.remove('show');
        }
    });

    document.getElementById('notif-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifList = document.getElementById('notif-list');
        if(notifList) notifList.innerHTML = '<div class="notif-empty" id="notif-empty">Henüz bildirim yok.</div>';
        unreadNotifs = 0;
        const badge = document.getElementById('notif-badge');
        if(badge) badge.style.display = 'none';
    });

    // ==== 4. SENSOR SIMULATOR ====
    const sensors = [
        { id: 'ph', name: 'pH Seviyesi', unit: 'pH', value: 6.1, min: 0, max: 14, color: '#22c55e', history: [], icon: '🧪', getTarget: () => activeRecipe.ph },
        { id: 'temp', name: 'Sıcaklık', unit: '°C', value: 23.5, min: 0, max: 40, color: '#ef4444', history: [], icon: '🌡️', getTarget: () => activeRecipe.temp },
        { id: 'humidity', name: 'Nem', unit: '%', value: 48.2, min: 0, max: 100, color: '#0ea5e9', history: [], icon: '💧', getTarget: () => activeRecipe.humidity },
        { id: 'light', name: 'Işık (PAR)', unit: 'µmol', value: 390, min: 0, max: 1000, color: '#eab308', history: [], icon: '☀️', getTarget: () => ({ min: activeRecipe.light.target - 50, max: activeRecipe.light.target + 50, target: activeRecipe.light.target }) },
        { id: 'ec', name: 'Besin (EC)', unit: 'mS/cm', value: 1.25, min: 0, max: 5, color: '#8b5cf6', history: [], icon: '⚡', getTarget: () => activeRecipe.ec },
        { id: 'water', name: 'Su Seviyesi', unit: '%', value: 82, min: 0, max: 100, color: '#0284c7', history: [], icon: '🌊', getTarget: () => activeRecipe.water }
    ];

    // Initialize history
    sensors.forEach(s => {
        for(let i=0; i<60; i++) { s.history.push(s.value + (Math.random() * 0.4 - 0.2)); }
    });

    const activeWarnings = new Set();

    const updateSensors = () => {
        const getControlVal = (id) => machineControls.find(c => c.id === id).value;
        const cLight = getControlVal('light');
        const cPump = getControlVal('pump');
        const cFan = getControlVal('fan');
        const cNutrient = getControlVal('nutrient');
        const cPh = getControlVal('ph');

        sensors.forEach(s => {
            let force = 0;
            // Apply physics based on controls (50 is neutral)
            if(s.id === 'light') force = (cLight - 50) * 1.5; 
            if(s.id === 'water') force = (cPump - 50) * 0.5; 
            if(s.id === 'temp') force = (50 - cFan) * 0.05; 
            if(s.id === 'humidity') force = (50 - cFan) * 0.15; 
            if(s.id === 'ec') force = (cNutrient - 50) * 0.02; 
            if(s.id === 'ph') force = (cPh - 50) * 0.02; 

            // Natural drift towards target if controls are neutral
            const target = s.getTarget();
            const pullToTarget = (target.target - s.value) * 0.02;
            const randomDrift = (Math.random() - 0.5) * 0.2;
            
            s.value = Math.max(s.min, Math.min(s.max, s.value + pullToTarget + force + randomDrift));
            s.history.shift();
            s.history.push(s.value);
        });

        checkWarnings();
        renderDashboard();
    };

    const checkWarnings = () => {
        machineControls.forEach(c => {
            const warningId = c.id;
            if(c.value < 20 || c.value > 80) {
                if(!activeWarnings.has(warningId)) {
                    activeWarnings.add(warningId);
                    const state = c.value > 80 ? 'aşırı yüksek' : 'çok düşük';
                    const msg = `Dikkat: ${c.name} ${state} kapasitede çalışıyor (%${c.value}). Grafikleri kontrol edin.`;
                    addLog(msg, c.value > 90 || c.value < 10 ? 'error' : 'warn');
                    auroraRespond(`⚠️ Sistem Uyarı: ${c.name} cihazının gücü ${state} seviyede (%${c.value}) tespit edildi. Bu durum ilgili sensörlerde sert dalgalanmalara yol açıyor. Canlı grafikleri yakından izliyorum.`, true);
                }
            } else {
                if(activeWarnings.has(warningId)) {
                    activeWarnings.delete(warningId);
                    addLog(`${c.name} normal çalışma kapasitesine döndü.`, 'success');
                }
            }
        });
    };

    // ==== 5. RENDERERS ====
    const renderSensorGrid = () => {
        const grid = document.getElementById('sensor-grid');
        if(!grid) return;
        grid.innerHTML = sensors.map(s => {
            const target = s.getTarget();
            let status = 'optimal';
            let statusText = 'OPTİMAL';
            if (s.value < target.min - s.value*0.1 || s.value > target.max + s.value*0.1) { status = 'critical'; statusText = 'KRİTİK'; }
            else if (s.value < target.min || s.value > target.max) { status = 'warning'; statusText = 'UYARI'; }

            const avg = (s.history.reduce((a,b)=>a+b,0) / s.history.length).toFixed(1);
            const minV = Math.min(...s.history).toFixed(1);
            const maxV = Math.max(...s.history).toFixed(1);

            return `
            <div class="sensor-card">
                <div class="sensor-header">
                    <div class="sensor-icon-wrap" style="color: ${s.color}; background: ${s.color}20">${s.icon}</div>
                    <div>
                        <div class="sensor-name">${s.name}</div>
                        <div class="sensor-status ${status}">${statusText}</div>
                    </div>
                </div>
                <div class="sensor-value">${s.value.toFixed(1)}<span class="sensor-unit">${s.unit}</span></div>
                <div class="sparkline-wrap">
                    <canvas id="sparkline-${s.id}" class="sparkline-canvas"></canvas>
                </div>
                <div class="sensor-stats">
                    <div class="stat-item"><span class="stat-label">Min</span><span class="stat-value">${minV}</span></div>
                    <div class="stat-item"><span class="stat-label">Maks</span><span class="stat-value">${maxV}</span></div>
                    <div class="stat-item"><span class="stat-label">Ort</span><span class="stat-value">${avg}</span></div>
                </div>
            </div>`;
        }).join('');

        sensors.forEach(s => drawSparkline(`sparkline-${s.id}`, s.history, s.color));
    };

    const drawSparkline = (id, data, color) => {
        const canvas = document.getElementById(id);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        
        ctx.clearRect(0,0,w,h);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((val - min) / range) * (h * 0.8) - (h * 0.1);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke();

        const grad = ctx.createLinearGradient(0,0,0,h);
        grad.addColorStop(0, color + '60');
        grad.addColorStop(1, color + '00');
        
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = grad;
        ctx.fill();
    };

    const renderRecipes = () => {
        const grid = document.getElementById('recipe-grid');
        if(!grid) return;
        grid.innerHTML = recipes.map(r => `
            <div class="recipe-card" onclick="app.setActiveRecipe('${r.id}')">
                <div class="recipe-emoji">${r.emoji}</div>
                <div class="recipe-card-name">${r.name}</div>
                <div class="recipe-stage">${r.stage} Aşaması</div>
                <div class="recipe-progress"><div class="recipe-progress-bar" style="width: ${r.progress}%"></div></div>
                <div class="recipe-params">
                    <div class="recipe-param-row"><span class="recipe-param-label">Hedef pH:</span><span class="recipe-param-value">${r.ph.target}</span></div>
                    <div class="recipe-param-row"><span class="recipe-param-label">Hedef Sıcaklık:</span><span class="recipe-param-value">${r.temp.target}°C</span></div>
                    <div class="recipe-param-row"><span class="recipe-param-label">Besin EC:</span><span class="recipe-param-value">${r.ec.target}</span></div>
                </div>
                <div class="recipe-light-schedule">
                    <span>Işık Döngüsü</span>
                    <span class="recipe-light-value">${r.light.schedule}</span>
                </div>
            </div>
        `).join('');
    };

    const renderActiveRecipeSummary = () => {
        const title = document.getElementById('active-recipe-name');
        const summary = document.getElementById('recipe-summary');
        if(!title || !summary) return;
        
        title.textContent = activeRecipe.emoji + ' ' + activeRecipe.name;
        
        const params = [
            { label: 'pH', sensor: 'ph', unit: '' },
            { label: 'Sıcaklık', sensor: 'temp', unit: '°C' },
            { label: 'EC', sensor: 'ec', unit: ' mS/cm' },
            { label: 'Işık', sensor: 'light', unit: ' µmol' }
        ];

        summary.innerHTML = params.map(p => {
            const s = sensors.find(sen => sen.id === p.sensor);
            const target = s.getTarget();
            const inRange = s.value >= target.min && s.value <= target.max;
            return `
            <div class="recipe-summary-item">
                <span class="recipe-param">${p.label}</span>
                <span class="recipe-target">Hedef: ${target.target}${p.unit}</span>
                <span class="recipe-actual ${inRange ? 'in-range' : 'out-range'}">${s.value.toFixed(1)}${p.unit}</span>
            </div>`;
        }).join('');
    };

    const renderSystemGrid = () => {
        const grid = document.getElementById('system-grid');
        if(!grid) return;
        
        const controlsHtml = machineControls.map(c => {
            let clz = '';
            if(c.value > 80 || c.value < 20) clz = 'warning';
            if(c.value > 90 || c.value < 10) clz = 'critical';
            return `
            <div class="control-slider-wrap">
                <div class="control-header">
                    <div class="control-title-wrap">
                        <span class="control-icon">${c.icon}</span>
                        <span class="control-name">${c.name}</span>
                    </div>
                    <span class="control-val" id="val-${c.id}">${c.value}%</span>
                </div>
                <input type="range" id="range-${c.id}" class="control-range ${clz}" min="0" max="100" value="${c.value}" oninput="app.updateControl('${c.id}', this.value)" />
            </div>`;
        }).join('');

        grid.innerHTML = `
            <div class="system-card" style="grid-column: 1 / -1;">
                <div class="system-card-title">🎛️ Manuel Kontroller (Simülasyona Bağlı)</div>
                <div class="control-grid">
                    ${controlsHtml}
                </div>
            </div>
            <div class="system-card">
                <div class="system-card-title">🛡️ Güvenlik & Ağ</div>
                <div class="sys-row"><span class="sys-label">Uçtan Uca Şifreleme</span><span class="sys-value ok">AES-256-GCM Aktif</span></div>
                <div class="sys-row"><span class="sys-label">TLS Sertifikası</span><span class="sys-value ok">Geçerli (GreenBox CA)</span></div>
                <div class="sys-row"><span class="sys-label">Veri Bütünlüğü</span><span class="sys-value ok">HMAC-SHA256 Doğrulandı</span></div>
                <div class="sys-row"><span class="sys-label">Bağlantı Türü</span><span class="sys-value ok">WSS / MQTT Güvenli</span></div>
            </div>
            <div class="system-card">
                <div class="system-card-title">⚙️ Donanım Durumu</div>
                <div class="sys-row"><span class="sys-label">İşlemci (CPU)</span><span class="sys-value">32°C / %14 Yük</span></div>
                <div class="sys-row"><span class="sys-label">Bellek</span><span class="sys-value">124MB / 512MB</span></div>
                <div class="sys-row"><span class="sys-label">Çalışma Süresi</span><span class="sys-value">42g 18s 05d</span></div>
                <div class="sys-row"><span class="sys-label">Sensör Bağlantısı</span><span class="sys-value ok">6 / 6</span></div>
            </div>
        `;
    };

    // ==== 6. LOGGER & AURORA AI ====
    const logFeed = document.getElementById('log-feed');
    const logs = [];
    const addLog = (msg, type='info') => {
        const time = new Date().toLocaleTimeString('tr-TR', { hour12: false });
        logs.unshift({ time, msg, type });
        if(logs.length > 50) logs.pop();
        if(logFeed) {
            logFeed.innerHTML = logs.slice(0,10).map(l => 
                `<div class="log-entry ${l.type}"><span class="log-time">[${l.time}]</span><span class="log-msg">${l.msg}</span></div>`
            ).join('');
        }
        
        // Broadcast to Notification Center
        let title = 'Sistem Bilgisi';
        if(type === 'success') title = 'İşlem Başarılı';
        if(type === 'warn') title = 'Sistem Uyarısı';
        if(type === 'error') title = 'Kritik Durum';
        addNotification(title, msg, type);
    };

    const auroraMessages = [
        { sender: 'aurora', text: 'İyi akşamlar. Sensör bağlantıları kuruldu. Ortam şu anda stabil ve Ceneviz Fesleğeni tarifi kusursuz bir şekilde ilerliyor.', time: '18:30' }
    ];

    const renderChat = () => {
        const chatContainer = document.getElementById('chat-messages');
        if(!chatContainer) return;
        chatContainer.innerHTML = auroraMessages.map(m => `
            <div class="message ${m.sender}">
                ${m.sender === 'aurora' ? '<div class="msg-avatar">🌿</div>' : ''}
                <div class="message-content" style="max-width: 100%;">
                    <div class="msg-bubble">${m.text}</div>
                    <div class="msg-time">${m.time}</div>
                </div>
            </div>
        `).join('');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const auroraRespond = (userMsg, isAutoWarning = false) => {
        const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        if(!isAutoWarning) {
            auroraMessages.push({ sender: 'user', text: userMsg, time });
            renderChat();
        }

        setTimeout(() => {
            let reply = userMsg;
            if(!isAutoWarning) {
                const inputLower = userMsg.toLowerCase();
                reply = "Şu anda şifreli beslemeyi izliyorum. Her şey en iyi seviyede ilerliyor. Analiz etmemi istediğiniz belirli bir parametre var mı?";
                
                if(inputLower.includes('ph')) reply = `Mevcut pH seviyesi ${sensors.find(s=>s.id==='ph').value.toFixed(1)}. Durumu uçtan uca şifreli izlemeye devam ediyorum.`;
                else if(inputLower.includes('sıcaklık') || inputLower.includes('sicaklik') || inputLower.includes('ısı')) reply = `Sıcaklık grafiği şu an ${sensors.find(s=>s.id==='temp').value.toFixed(1)}°C gösteriyor. Değişimleri anlık izliyorum.`;
                else if(inputLower.includes('güvenlik') || inputLower.includes('guvenlik') || inputLower.includes('şifre')) reply = `Veri gizliliğiniz benim en büyük önceliğim. Tüm veriler AES-256 ile korunmaktadır.`;
                else if(inputLower.includes('tarif')) reply = `Şu anda ${activeRecipe.stage} aşamasında olan ${activeRecipe.name} tarifini uyguluyoruz.`;
                else if(inputLower.includes('su') || inputLower.includes('nem')) reply = `Su seviyesi %${sensors.find(s=>s.id==='water').value.toFixed(0)} ve nem %${sensors.find(s=>s.id==='humidity').value.toFixed(1)}.`;
            }

            auroraMessages.push({ sender: 'aurora', text: reply, time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) });
            renderChat();
            
            // Notify user of Aurora's message
            addNotification('Aurora AI', reply, 'info');

        }, isAutoWarning ? 0 : 1000);
    };

    document.getElementById('chat-send')?.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if(input.value.trim()) {
            auroraRespond(input.value.trim());
            input.value = '';
        }
    });

    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && e.target.value.trim()) {
            auroraRespond(e.target.value.trim());
            e.target.value = '';
        }
    });

    // ==== 7. MAIN CHART ENGINE ====
    const renderMainChart = () => {
        const canvas = document.getElementById('main-chart');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        
        ctx.clearRect(0,0,w,h);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=1; i<4; i++) {
            const y = (h/4) * i;
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Draw temp and humidity
        const temp = sensors.find(s=>s.id==='temp');
        const hum = sensors.find(s=>s.id==='humidity');

        const drawSeries = (data, color, minOffset, maxOffset) => {
            const min = Math.min(...data) - minOffset;
            const max = Math.max(...data) + maxOffset;
            const range = max - min || 1;

            ctx.beginPath();
            data.forEach((val, i) => {
                const x = (i / (data.length - 1)) * w;
                const y = h - ((val - min) / range) * (h * 0.8) - (h * 0.1);
                if(i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.stroke();
        };

        drawSeries(temp.history, temp.color, 5, 5);
        drawSeries(hum.history, hum.color, 10, 10);
    };

    // ==== 8. ROUTING & CORE ENGINE ====
    const setView = (hash) => {
        const viewId = hash.replace('#', '') || 'dashboard';
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        const viewEl = document.getElementById(`view-${viewId}`);
        if(viewEl) viewEl.classList.add('active');
        
        document.querySelectorAll(`.nav-item[data-view="${viewId}"]`).forEach(el => el.classList.add('active'));

        if(viewId === 'dashboard') { renderDashboard(); renderMainChart(); }
        else if(viewId === 'recipes') renderRecipes();
        else if(viewId === 'chat') renderChat();
        else if(viewId === 'system') renderSystemGrid();
    };

    const renderDashboard = () => {
        renderSensorGrid();
        renderActiveRecipeSummary();
        renderMainChart();
    };

    window.app = {
        setActiveRecipe: (id) => {
            activeRecipe = recipes.find(r => r.id === id);
            addLog(`Aktif tarif güncellendi: ${activeRecipe.name}`, 'success');
            setView('#dashboard');
        },
        updateControl: (id, val) => {
            const ctrl = machineControls.find(c => c.id === id);
            if(ctrl) {
                ctrl.value = parseInt(val);
                const valEl = document.getElementById(`val-${id}`);
                if(valEl) valEl.textContent = `${val}%`;
                
                const rangeEl = document.getElementById(`range-${id}`);
                if(rangeEl) {
                    if(val < 20 || val > 80) rangeEl.className = `control-range ${val > 90 || val < 10 ? 'critical' : 'warning'}`;
                    else rangeEl.className = 'control-range';
                }
                
                // Add a notification specifically for manual override
                addNotification('Manuel Müdahale', `${ctrl.name} kapasitesi %${val} olarak ayarlandı.`, 'info');
            }
        }
    };

    window.addEventListener('hashchange', () => setView(window.location.hash));

    // Boot sequence
    addLog('Sistem başlatıldı. Güvenli bağlantı kuruldu.', 'success');
    addLog('Tüm sensör kanallarında AES-256 şifreleme aktif.', 'info');
    
    let progress = 0;
    const bootInterval = setInterval(() => {
        progress += Math.random() * 20;
        if(progress > 100) progress = 100;
        document.getElementById('boot-progress-bar').style.width = `${progress}%`;
        
        const statusMsgs = [
            'Aurora Başlatılıyor...', 
            'Uçtan Uca Şifreleme Kuruluyor...', 
            'Sensörlerle İletişim Sağlanıyor...', 
            'Dinamik Fizik Motoru Yükleniyor...', 
            'Sistem Hazır.'
        ];
        document.getElementById('boot-status').textContent = statusMsgs[Math.floor(progress/25)];

        if(progress === 100) {
            clearInterval(bootInterval);
            setTimeout(() => {
                document.getElementById('boot-overlay').classList.add('done');
                setView(window.location.hash);
                
                // Start live data loop
                setInterval(() => {
                    updateSensors();
                    const now = new Date();
                    document.getElementById('datetime').textContent = now.toLocaleDateString('tr-TR', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour12: false });
                }, 2000);

            }, 500);
        }
    }, 200);

});
