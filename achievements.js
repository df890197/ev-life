// achievements.js - 獨立成就系統模組

const ALL_BADGES_CONFIG = [
    // 🌍 基本環保與省錢
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

    // 🛣️ 里程與終極目標
    {
        id: 'range',
        name: '高速巡航者',
        icon: '🚀',
        desc: '單趟行駛超過 200 公里',
        target: 200,
        unit: 'km',
        getValue: (stats) => Number(stats.maxDist) || 0,
        check: (stats) => (Number(stats.maxDist) || 0) >= 200
    },
    {
        id: 'range_challenger',
        name: '續航挑戰者',
        icon: '🏔️',
        desc: '單趟行駛超過 400 公里',
        target: 400,
        unit: 'km',
        getValue: (stats) => Number(stats.maxDist) || 0,
        check: (stats) => (Number(stats.maxDist) || 0) >= 400
    },
    {
        id: 'island',
        name: '環島旅行家',
        icon: '🌐',
        desc: '總里程達到 1,000 公里',
        target: 1000,
        unit: 'km',
        getValue: (stats) => Number(stats.totalKm) || 0,
        check: (stats) => (Number(stats.totalKm) || 0) >= 1000
    },
    {
        id: '10k_club',
        name: '萬里達人',
        icon: '🌌',
        desc: '總里程達到 10,000 公里',
        target: 10000,
        unit: 'km',
        getValue: (stats) => Number(stats.totalKm) || 0,
        check: (stats) => (Number(stats.totalKm) || 0) >= 10000
    },
    {
        id: 'earth_globe',
        name: '環遊世界',
        icon: '🌍',
        desc: '總里程突破 40,000 公里',
        target: 40000,
        unit: 'km',
        getValue: (stats) => Number(stats.totalKm) || 0,
        check: (stats) => (Number(stats.totalKm) || 0) >= 40000
    },
    {
        id: 'short_trip',
        name: '巷口買便當',
        icon: '🍱',
        desc: '單趟行駛小於 3 公里',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.shortTripCount) || 0,
        check: (stats) => (Number(stats.shortTripCount) || 0) >= 1
    },

    // ⚡ 電耗、花費與極限
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
        id: 'heavy_foot',
        name: '貼地飛行',
        icon: '🏎️',
        desc: '單趟電耗低於 4.5 km/度',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.heavyFootCount) || 0,
        check: (stats) => (Number(stats.heavyFootCount) || 0) >= 1
    },
    {
        id: 'cheap_drive',
        name: '銅板經濟',
        icon: '🧮',
        desc: '每公里花費 < 0.5元 (單趟≥50km)',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.cheapDriveCount) || 0,
        check: (stats) => (Number(stats.cheapDriveCount) || 0) >= 1
    },
    {
        id: 'expensive_drive',
        name: '尊榮出行',
        icon: '🦅',
        desc: '每公里花費 > 2.5元 (單趟≥50km)',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.expensiveDriveCount) || 0,
        check: (stats) => (Number(stats.expensiveDriveCount) || 0) >= 1
    },

    // 🔋 充電次數里程碑
    {
        id: 'first_charge',
        name: '初次充電',
        icon: '🐣',
        desc: '完成第 1 次充電紀錄',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.chargeCount) || 0,
        check: (stats) => (Number(stats.chargeCount) || 0) >= 1
    },
    {
        id: 'charge_rookie',
        name: '充電新手',
        icon: '🔌',
        desc: '累積完成 10 次充電',
        target: 10,
        unit: '次',
        getValue: (stats) => Number(stats.chargeCount) || 0,
        check: (stats) => (Number(stats.chargeCount) || 0) >= 10
    },
    {
        id: 'charge_master',
        name: '充電達人',
        icon: '🔋',
        desc: '累積完成 100 次充電',
        target: 100,
        unit: '次',
        getValue: (stats) => Number(stats.chargeCount) || 0,
        check: (stats) => (Number(stats.chargeCount) || 0) >= 100
    },

    // 🔋 充電習慣與電池控制
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
        id: 'soc_keeper',
        name: '電量守門員',
        icon: '🛡️',
        desc: '低於 10% 才充電，累積達 10 次',
        target: 10,
        unit: '次',
        getValue: (stats) => Number(stats.extremeLowSocCount) || 0,
        check: (stats) => (Number(stats.extremeLowSocCount) || 0) >= 10
    },
    {
        id: 'max_drain',
        name: '榨乾極限',
        icon: '🧃',
        desc: '單趟一口氣消耗 80% 以上電量',
        target: 80,
        unit: '%',
        getValue: (stats) => Number(stats.maxSocDrain) || 0,
        check: (stats) => (Number(stats.maxSocDrain) || 0) >= 80
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
        id: 'health_80',
        name: '80%俱樂部',
        icon: '💚',
        desc: '充電只充到 80% 以下，達 30 次',
        target: 30,
        unit: '次',
        getValue: (stats) => Number(stats.health80Count) || 0,
        check: (stats) => (Number(stats.health80Count) || 0) >= 30
    },
    {
        id: 'full_charge',
        name: '滿電強迫症',
        icon: '💯',
        desc: '累積 5 次將電量充至 99% 以上',
        target: 5,
        unit: '次',
        getValue: (stats) => Number(stats.fullChargeCount) || 0,
        check: (stats) => (Number(stats.fullChargeCount) || 0) >= 5
    },
    {
        id: 'freeloader',
        name: '蹭電達人',
        icon: '🆓',
        desc: '達成 5 次 0 元充電',
        target: 5,
        unit: '次',
        getValue: (stats) => Number(stats.freeChargeCount) || 0,
        check: (stats) => (Number(stats.freeChargeCount) || 0) >= 5
    },
    {
        id: 'quick_pitstop',
        name: '快充快閃',
        icon: '⏱️',
        desc: '單次充電增加不到 10% 電量',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.quickPitstopCount) || 0,
        check: (stats) => (Number(stats.quickPitstopCount) || 0) >= 1
    },
    {
        id: 'big_spender',
        name: '超充大戶',
        icon: '💸',
        desc: '曾單次充電花費超過 500 元',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.highCostChargeCount) || 0,
        check: (stats) => (Number(stats.highCostChargeCount) || 0) >= 1
    },
    {
        id: 'mega_watt',
        name: '兆瓦級買家',
        icon: '⚡',
        desc: '累計消耗超過 1,000 度電',
        target: 1000,
        unit: '度',
        getValue: (stats) => Number(stats.globalPower) || 0,
        check: (stats) => (Number(stats.globalPower) || 0) >= 1000
    },
    {
        id: 'perfect_half',
        name: '精準控制',
        icon: '🎯',
        desc: '單次充電剛好充入整整 50%',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.perfectHalfCount) || 0,
        check: (stats) => (Number(stats.perfectHalfCount) || 0) >= 1
    },
    {
        id: 'battery_zen',
        name: '淺充淺放',
        icon: '🧘',
        desc: '電量 30%~80% 區間充電達 10 次',
        target: 10,
        unit: '次',
        getValue: (stats) => Number(stats.shallowChargeCount) || 0,
        check: (stats) => (Number(stats.shallowChargeCount) || 0) >= 10
    },

    // 🌡️ 氣候與環境
    {
        id: 'hot_walker',
        name: '烈日行者',
        icon: '☀️',
        desc: '在 35°C 以上高溫行駛超過 10km',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.hotTempCount) || 0,
        check: (stats) => (Number(stats.hotTempCount) || 0) >= 1
    },
    {
        id: 'cold_warrior',
        name: '寒冬戰士',
        icon: '❄️',
        desc: '在 12°C 以下低溫行駛超過 10km',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.coldTempCount) || 0,
        check: (stats) => (Number(stats.coldTempCount) || 0) >= 1
    },

    // 🗺️ 探索與忠誠
    {
        id: 'explorer',
        name: '鄉鎮探索家',
        icon: '🗺️',
        desc: '累積造訪 5 個不同鄉鎮市區',
        target: 5,
        unit: '區',
        getValue: (stats) => Number(stats.uniqueDistricts) || 0,
        check: (stats) => (Number(stats.uniqueDistricts) || 0) >= 5
    },
    {
        id: 'brand_loyal',
        name: '品牌鐵粉',
        icon: '🏢',
        desc: '在同一外站品牌充電達 10 次',
        target: 10,
        unit: '次',
        getValue: (stats) => Number(stats.maxBrandCharge) || 0,
        check: (stats) => (Number(stats.maxBrandCharge) || 0) >= 10
    },

    // 📅 時間與作息
    {
        id: 'weekend_driver',
        name: '假日車手',
        icon: '🎉',
        desc: '在週末(六/日)完成 10 趟行駛',
        target: 10,
        unit: '趟',
        getValue: (stats) => Number(stats.weekendDriveCount) || 0,
        check: (stats) => (Number(stats.weekendDriveCount) || 0) >= 10
    },

    // 🛠️ 養車、費用與紀錄
    {
        id: 'toll_parking',
        name: '過路財神',
        icon: '🅿️',
        desc: '停車與通行費累積超過 1,000 元',
        target: 1000,
        unit: '元',
        getValue: (stats) => Number(stats.nonDriveCost) || 0,
        check: (stats) => (Number(stats.nonDriveCost) || 0) >= 1000
    },
    {
        id: 'highway_cruiser',
        name: '國道常客',
        icon: '🛣️',
        desc: '紀錄 5 次通行費支出',
        target: 5,
        unit: '次',
        getValue: (stats) => Number(stats.tollCount) || 0,
        check: (stats) => (Number(stats.tollCount) || 0) >= 5
    },
    {
        id: 'parking_tycoon',
        name: '停車大亨',
        icon: '🅿️',
        desc: '紀錄 10 次停車費支出',
        target: 10,
        unit: '次',
        getValue: (stats) => Number(stats.parkingCount) || 0,
        check: (stats) => (Number(stats.parkingCount) || 0) >= 10
    },
    {
        id: 'car_lover',
        name: '愛車如命',
        icon: '🛠️',
        desc: '紀錄 3 次維修保養',
        target: 3,
        unit: '次',
        getValue: (stats) => Number(stats.maintenanceCount) || 0,
        check: (stats) => (Number(stats.maintenanceCount) || 0) >= 3
    },
    {
        id: 'insurance',
        name: '安全第一',
        icon: '🛡️',
        desc: '紀錄 1 次保險費支出',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.insuranceCount) || 0,
        check: (stats) => (Number(stats.insuranceCount) || 0) >= 1
    },
    {
        id: 'journalist',
        name: '汽車日記',
        icon: '📓',
        desc: '填寫旅程備註達 20 筆',
        target: 20,
        unit: '筆',
        getValue: (stats) => Number(stats.noteCount) || 0,
        check: (stats) => (Number(stats.noteCount) || 0) >= 20
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

    // 初始化所有統計變數
    let globalKm = 0, totalEnergyCost = 0, globalPower = 0;
    let maxDist = 0, maxEff = 0, lowSocCount = 0;
    let freeChargeCount = 0, anxietyCount = 0, validDriveCount = 0;
    let shortTripCount = 0, heavyFootCount = 0, maxSocDrain = 0;
    let fullChargeCount = 0, highCostChargeCount = 0;
    let nonDriveCost = 0, maintenanceCount = 0;
    let insuranceCount = 0, cheapDriveCount = 0, expensiveDriveCount = 0, quickPitstopCount = 0;
    let chargeCount = 0, health80Count = 0, extremeLowSocCount = 0;
    
    let hotTempCount = 0, coldTempCount = 0;
    let noteCount = 0, perfectHalfCount = 0;
    
    // 新增的統計變數
    let weekendDriveCount = 0, shallowChargeCount = 0, tollCount = 0, parkingCount = 0;

    const districtSet = new Set();
    const tagCountMap = {};

    const activeRecords = records.filter(r => r.id !== "SYSTEM_METADATA" && r.id !== "CONFIG_METADATA" && r.date);

    activeRecords.forEach(rec => {
        // 📓 汽車日記：有填寫備註
        if (rec.note && rec.note.trim() !== '') noteCount++;

        // 處理非充電/駕駛的雜項花費
        if (['維修保養', '停車費', '通行費', '保險費'].includes(rec.chargeType)) {
            const extraCost = parseFloat(rec.cost) || 0;
            if (rec.chargeType === '維修保養') maintenanceCount++;
            if (rec.chargeType === '停車費') { nonDriveCost += extraCost; parkingCount++; }
            if (rec.chargeType === '通行費') { nonDriveCost += extraCost; tollCount++; }
            if (rec.chargeType === '保險費') insuranceCount++;
        } 
        // 處理正常的駕駛與充電紀錄
        else {
            validDriveCount++;
            const dist = parseFloat(rec.distance) || 0;
            const cost = parseFloat(rec.cost) || 0;
            const startSoc = parseFloat(rec.startSoc);
            const endSoc = parseFloat(rec.endSoc);
            const temp = parseFloat(rec.temp);

            // 📅 假日車手：判斷是否為星期六 (6) 或星期日 (0)
            if (rec.date && dist > 0) {
                const dayOfWeek = new Date(rec.date).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) weekendDriveCount++;
            }
            
            let socDelta = rec.consumedSocPercent;
            if (socDelta === undefined || isNaN(socDelta)) {
                socDelta = Math.abs((endSoc || 0) - (startSoc || 0));
            }

            const pwr = batteryCapacity * (socDelta / 100);
            globalKm += dist;
            totalEnergyCost += cost;
            globalPower += pwr;

            // 基礎紀錄：最遠距離
            if (dist > maxDist) maxDist = dist;

            // 🗺️ 鄉鎮探索家：收集不重複的地點
            if (rec.district && rec.district.trim() !== '') {
                districtSet.add(rec.district.trim());
            }

            // 🌡️ 氣候成就：大於 10 公里的高低溫挑戰
            if (!isNaN(temp) && dist > 10) {
                if (temp >= 35) hotTempCount++;
                if (temp <= 12) coldTempCount++;
            }
            
            // 單位花費計算 (銅板經濟 / 尊榮出行)
            if (dist >= 50 && cost > 0) {
                const costPerKm = cost / dist;
                if (costPerKm <= 0.5) cheapDriveCount++;
                if (costPerKm >= 2.5) expensiveDriveCount++;
            }

            // 電耗計算 (排除距離過短的誤差)
            if (pwr > 0 && dist > 5) {
                const eff = dist / pwr;
                if (eff > maxEff) maxEff = eff; 
                if (eff < 4.5) heavyFootCount++;
            }

            // 里程小於 3km (巷口買便當)
            if (dist > 0 && dist <= 3) shortTripCount++;

            // 消耗最多趴數 (榨乾極限)
            if (socDelta > maxSocDrain && dist > 0) maxSocDrain = socDelta;

            // 黃金心臟 (任一時刻低於 10%)
            if ((!isNaN(startSoc) && startSoc <= 10) || (!isNaN(endSoc) && endSoc <= 10)) {
                lowSocCount++;
            }

            // ⚡ 所有與「充電行為」有關的判斷 (結束電量 > 起始電量)
            if (!isNaN(startSoc) && !isNaN(endSoc) && endSoc > startSoc) {
                chargeCount++; 
                
                if (endSoc <= 80) health80Count++; // 80%俱樂部
                if (startSoc <= 10) extremeLowSocCount++; // 電量守門員
                if ((endSoc - startSoc) < 10) quickPitstopCount++; // 快充快閃
                if ((endSoc - startSoc) === 50) perfectHalfCount++; // 🎯 精準控制
                
                // 🧘 淺充淺放：30% 以上才充，80% 以下就拔槍
                if (startSoc >= 30 && endSoc <= 80) shallowChargeCount++;

                // 🏢 品牌鐵粉：統計各站點充電次數 (排除住家)
                if (rec.tag && rec.tag.trim() !== '' && !rec.tag.includes('住家')) {
                    const cleanTag = rec.tag.trim();
                    tagCountMap[cleanTag] = (tagCountMap[cleanTag] || 0) + 1;
                }
            }

            // 電量焦慮 (80% 以上就充電)
            if (!isNaN(startSoc) && startSoc >= 80) anxietyCount++;

            // 蹭電達人 (0元充到電)
            if (cost === 0 && socDelta > 0 && dist === 0) freeChargeCount++;

            // 滿電強迫症 (充到 99% 以上)
            if (!isNaN(endSoc) && endSoc >= 99 && dist === 0) fullChargeCount++;

            // 超充大戶 (單次花費 > 500)
            if (cost >= 500) highCostChargeCount++;
        }
    });

    // 計算品牌忠誠度的最大值
    const maxBrandCharge = Object.values(tagCountMap).length > 0 ? Math.max(...Object.values(tagCountMap)) : 0;

    const hypotheticalGasCost = (globalKm / iceEff) * gasPrice;
    const fuelSavings = Math.max(0, hypotheticalGasCost - totalEnergyCost);
    const co2Savings = globalKm * co2Rate;
    const totalKm = initialOdo + globalKm;

    return { 
        globalKm, totalKm, fuelSavings, co2Savings, maxDist, maxEff, lowSocCount,
        freeChargeCount, anxietyCount, recordCount: validDriveCount,
        shortTripCount, heavyFootCount, maxSocDrain, fullChargeCount, 
        highCostChargeCount, globalPower, nonDriveCost, maintenanceCount,
        insuranceCount, cheapDriveCount, expensiveDriveCount, quickPitstopCount,
        chargeCount, health80Count, extremeLowSocCount,
        hotTempCount, coldTempCount, uniqueDistricts: districtSet.size, 
        maxBrandCharge, noteCount, perfectHalfCount,
        weekendDriveCount, shallowChargeCount, tollCount, parkingCount
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
        const percent = Math.min(100, Math.max(0, Math.round((item.curVal / item.target) * 100)));
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
