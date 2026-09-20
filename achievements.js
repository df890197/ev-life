// achievements.js - 獨立成就系統模組

const ALL_BADGES_CONFIG = [
    {
        id: 'eco',
        name: '環保先鋒',
        icon: '🌍',
        desc: '累積減少 500kg CO₂',
        target: 500,
        unit: 'kg',
        getValue: (stats) => Number(stats.co2Savings) || 0,
        check: (stats) => (Number(stats.co2Savings) || 0) >= 500
    },
    {
        id: 'money',
        name: '省錢大師',
        icon: '💰',
        desc: '省下超過 5,000 元油錢',
        target: 5000,
        unit: '元',
        getValue: (stats) => Number(stats.fuelSavings) || 0,
        check: (stats) => (Number(stats.fuelSavings) || 0) >= 5000
    },
    {
        id: 'money_10k',
        name: '萬元俱樂部',
        icon: '🪙',
        desc: '省下超過 10,000 元油錢',
        target: 10000,
        unit: '元',
        getValue: (stats) => Number(stats.fuelSavings) || 0,
        check: (stats) => (Number(stats.fuelSavings) || 0) >= 10000
    },
    {
        id: 'range',
        name: '高速巡航者',
        icon: '🚀',
        desc: '單次行駛超過 200 公里',
        target: 200,
        unit: 'km',
        getValue: (stats) => Number(stats.maxDist) || 0,
        check: (stats) => (Number(stats.maxDist) || 0) >= 200
    },
    {
        id: 'foot',
        name: '黃金右腳',
        icon: '👑',
        desc: '單趟電耗達 6.5 km/度以上',
        target: 6.5,
        unit: 'km/度',
        getValue: (stats) => Number(stats.maxEff) || 0,
        check: (stats) => (Number(stats.maxEff) || 0) >= 6.5
    },
    {
        id: 'diamond_foot',
        name: '鑽石右腳',
        icon: '💎',
        desc: '單趟電耗達 8.0 km/度以上',
        target: 8.0,
        unit: 'km/度',
        getValue: (stats) => Number(stats.maxEff) || 0,
        check: (stats) => (Number(stats.maxEff) || 0) >= 8.0
    },
    {
        id: 'island',
        name: '環島旅行家',
        icon: '🌐',
        desc: '總行駛里程達到 1,000 公里',
        target: 1000,
        unit: 'km',
        getValue: (stats) => Number(stats.totalKm) || 0,
        check: (stats) => (Number(stats.totalKm) || 0) >= 1000
    },
    {
        id: '10k_club',
        name: '萬里達人',
        icon: '🌌',
        desc: '總行駛里程達到 10,000 公里',
        target: 10000,
        unit: 'km',
        getValue: (stats) => Number(stats.totalKm) || 0,
        check: (stats) => (Number(stats.totalKm) || 0) >= 10000
    },
    {
        id: 'low_soc',
        name: '黃金心臟',
        icon: '🪫',
        desc: '曾於電量 ≤ 10% 順利抵達充電',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.lowSocCount) || 0,
        check: (stats) => (Number(stats.lowSocCount) || 0) >= 1
    },
    {
        id: 'anxiety',
        name: '電量焦慮',
        icon: '😰',
        desc: '曾於電量 ≥ 80% 時進行充電',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.anxietyCount) || 0,
        check: (stats) => (Number(stats.anxietyCount) || 0) >= 1
    },
    {
        id: 'freeloader',
        name: '蹭電達人',
        icon: '🔌',
        desc: '達成 5 次 0 元充電',
        target: 5,
        unit: '次',
        getValue: (stats) => Number(stats.freeChargeCount) || 0,
        check: (stats) => (Number(stats.freeChargeCount) || 0) >= 5
    },
    {
        id: 'data_nerd',
        name: '數據控',
        icon: '📊',
        desc: '累積新增 50 筆行駛紀錄',
        target: 50,
        unit: '筆',
        getValue: (stats) => Number(stats.recordCount) || 0,
        check: (stats) => (Number(stats.recordCount) || 0) >= 50
    }
];

let currentBadgeTab = 'unlocked';

// 🔹 核心數據統計函式
function getAchievementStats() {
    const app = window.AppState || {};
    const records = app.records || [];
    const batteryCapacity = Number(app.batteryCapacity) || 57.7;
    const initialOdo = Number(app.initialOdometer) || 0;
    const iceEff = Number(app.iceEfficiency) || 15.0;
    const gasPrice = Number(app.gasPrice) || 30.0;
    const co2Rate = 0.095; // 0.173 - 0.078

    let globalKm = 0, totalEnergyCost = 0, globalPower = 0, maxDist = 0, maxEff = 0, lowSocCount = 0;
    let freeChargeCount = 0, anxietyCount = 0, validDriveCount = 0;

    const activeRecords = records.filter(r => r.id !== "SYSTEM_METADATA" && r.id !== "CONFIG_METADATA" && r.date);

    activeRecords.forEach(rec => {
        if (!['維修保養', '停車費', '通行費', '保險費'].includes(rec.chargeType)) {
            validDriveCount++; // 計算有效紀錄
            const dist = parseFloat(rec.distance) || 0;
            const cost = parseFloat(rec.cost) || 0;
            
            let socDelta = rec.consumedSocPercent;
            if (socDelta === undefined || isNaN(socDelta)) {
                const sSoc = parseFloat(rec.startSoc) || 0;
                const eSoc = parseFloat(rec.endSoc) || 0;
                socDelta = Math.abs(eSoc - sSoc);
            }

            const pwr = batteryCapacity * (socDelta / 100);
            globalKm += dist;
            totalEnergyCost += cost;
            globalPower += pwr;

            if (dist > maxDist) maxDist = dist;
            if (pwr > 0 && dist > 5) {
                const eff = dist / pwr;
                if (eff > maxEff) maxEff = eff;
            }

            const startSoc = parseFloat(rec.startSoc);
            const endSoc = parseFloat(rec.endSoc);
            
            // 黃金心臟 (電量 ≤ 10%)
            if ((!isNaN(startSoc) && startSoc <= 10) || (!isNaN(endSoc) && endSoc <= 10)) {
                lowSocCount++;
            }

            // 電量焦慮 (電量 ≥ 80% 進行充電)
            if (!isNaN(startSoc) && startSoc >= 80) {
                anxietyCount++;
            }

            // 蹭電達人 (花費為0且有充進電量)
            if (cost === 0 && socDelta > 0) {
                freeChargeCount++;
            }
        }
    });

    const hypotheticalGasCost = (globalKm / iceEff) * gasPrice;
    const fuelSavings = Math.max(0, hypotheticalGasCost - totalEnergyCost);
    const co2Savings = globalKm * co2Rate;
    const totalKm = initialOdo + globalKm;

    return { 
        globalKm, 
        totalKm, 
        fuelSavings, 
        co2Savings, 
        maxDist, 
        maxEff, 
        lowSocCount,
        freeChargeCount, 
        anxietyCount, 
        recordCount: validDriveCount
    };
}

// 🔹 開啟成就榮譽榜彈窗
window.openBadgeModal = function() {
    const modal = document.getElementById('badgeModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        if (modal.firstElementChild) modal.firstElementChild.classList.remove('scale-95');
    }, 10);
    renderBadgeModalContent();
};

// 🔹 關閉成就榮譽榜彈窗
window.closeBadgeModal = function() {
    const modal = document.getElementById('badgeModal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (modal.firstElementChild) modal.firstElementChild.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

// 🔹 切換「已解鎖」/「待挑戰」分頁
window.switchBadgeTab = function(tab) {
    currentBadgeTab = tab;
    const btnUnlocked = document.getElementById('tabBadgeUnlocked');
    const btnLocked = document.getElementById('tabBadgeLocked');
    if (btnUnlocked && btnLocked) {
        btnUnlocked.className = tab === 'unlocked'
            ? "flex-1 py-2 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow transition-all"
            : "flex-1 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all";
        btnLocked.className = tab === 'locked'
            ? "flex-1 py-2 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow transition-all"
            : "flex-1 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all";
    }
    renderBadgeModalContent();
};

// 🔹 渲染彈窗清單內容
function renderBadgeModalContent() {
    const stats = getAchievementStats();
    const unlocked = [];
    const locked = [];

    ALL_BADGES_CONFIG.forEach(b => {
        const isDone = b.check(stats);
        const curVal = b.getValue(stats) || 0;
        const item = { ...b, isDone, curVal };
        if (isDone) unlocked.push(item);
        else locked.push(item);
    });

    const countUnlockedEl = document.getElementById('unlockedBadgeCount');
    const countLockedEl = document.getElementById('lockedBadgeCount');
    if (countUnlockedEl) countUnlockedEl.textContent = unlocked.length;
    if (countLockedEl) countLockedEl.textContent = locked.length;

    const list = currentBadgeTab === 'unlocked' ? unlocked : locked;
    const container = document.getElementById('badgeModalContent');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400 text-xs font-bold">${currentBadgeTab === 'unlocked' ? '尚未解鎖任何成就，出門跑一趟吧！🚗' : '太厲害了！所有成就已全部達成 🎉'}</div>`;
        return;
    }

    container.innerHTML = list.map(item => {
        const percent = Math.min(100, Math.round((item.curVal / item.target) * 100));
        return `
        <div class="p-3.5 rounded-2xl border ${item.isDone ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'} flex items-center gap-3.5">
            <span class="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex-shrink-0">${item.icon}</span>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-0.5">
                    <h4 class="text-xs md:text-sm font-black ${item.isDone ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}">${item.name}</h4>
                    <span class="text-[10px] font-mono font-bold ${item.isDone ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}">${item.isDone ? '✅ 已解鎖' : `${item.curVal.toFixed(1)} / ${item.target}${item.unit}`}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-tight mb-2">${item.desc}</p>
                <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${item.isDone ? 'bg-amber-500' : 'bg-teal-500'}" style="width: ${item.isDone ? 100 : percent}%"></div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// 🔹 首頁駕駛成就橫條渲染
window.renderBadgesContainer = function(containerEl) {
    if (!containerEl) return;
    const stats = getAchievementStats();
    const unlocked = ALL_BADGES_CONFIG.filter(b => b.check(stats));
    const baseClass = "px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0 whitespace-nowrap border cursor-pointer hover:scale-105 transition-transform";
    
    if (unlocked.length > 0) {
        containerEl.innerHTML = unlocked.map(b => 
            `<div onclick="openBadgeModal()" class="${baseClass} bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400">${b.icon} ${b.name}</div>`
        ).join('');
    } else {
        containerEl.innerHTML = `<div class="text-[10px] md:text-xs text-slate-400 font-bold px-2 py-1">持續紀錄旅程來解鎖專屬成就！點擊「成就大廳」看挑戰清單</div>`;
    }
};
