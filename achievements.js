window.AchievementSystem = (function() {
    const TW_CITIES = ['基隆', '台北', '臺北', '新北', '桃園', '新竹', '苗栗', '台中', '臺中', '彰化', '南投', '雲林', '嘉義', '台南', '臺南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '臺東', '澎湖', '金門', '連江'];
    const MOUNTAIN_REGEX = /(武嶺|合歡山|清境|阿里山)/;

    let currentBadgeTab = 'unlocked';

    const BADGES_CONFIG = [
        {
            id: 'free_wool',
            name: '薅羊毛大師',
            icon: '⚡',
            desc: '充電度數 > 15 度且費用為 $0 元',
            target: 1,
            unit: '次',
            getValue: (s) => s.freeChargeOver15Kwh,
            check: (s) => s.freeChargeOver15Kwh >= 1
        },
        {
            id: 'sweet_spot_80',
            name: '甜甜圈充能',
            icon: '🔋',
            desc: '快充結束電量恰好在 80% ~ 82% 之間',
            target: 1,
            unit: '次',
            getValue: (s) => s.sweetSpotSocCount,
            check: (s) => s.sweetSpotSocCount >= 1
        },
        {
            id: 'budget_marathon',
            name: '百元長征',
            icon: '🪙',
            desc: '單趟花費 ≤ $100 元且里程超過 150 km',
            target: 1,
            unit: '次',
            getValue: (s) => s.sub100Over150Count,
            check: (s) => s.sub100Over150Count >= 1
        },
        {
            id: 'night_charger',
            name: '離峰守護者',
            icon: '🌙',
            desc: '備註包含「夜充」或累積 AC 慢充達 200 度',
            target: 200,
            unit: '度',
            getValue: (s) => s.hasNightChargeNote ? 200 : Math.min(200, s.acSlowKwhTotal),
            check: (s) => s.hasNightChargeNote || s.acSlowKwhTotal >= 200
        },
        {
            id: 'island_explorer',
            name: '環島巡航者',
            icon: '🗺️',
            desc: '紀錄地區涵蓋超過 5 個不同縣市',
            target: 5,
            unit: '縣市',
            getValue: (s) => s.cityCount,
            check: (s) => s.cityCount >= 5
        },
        {
            id: 'ten_thousand_club',
            name: '破萬俱樂部',
            icon: '🏁',
            desc: '總里程累計達 10,000 km',
            target: 10000,
            unit: 'km',
            getValue: (s) => s.totalKm,
            check: (s) => s.totalKm >= 10000
        },
        {
            id: 'highway_cruiser',
            name: '國道巡航艦',
            icon: '🛣️',
            desc: '單趟行程行駛里程超過 300 km',
            target: 300,
            unit: 'km',
            getValue: (s) => s.maxDist,
            check: (s) => s.maxDist >= 300
        },
        {
            id: 'ice_point',
            name: '冰點出擊',
            icon: '❄️',
            desc: '氣溫 ≤ 10°C 且單趟行駛 > 30 km',
            target: 1,
            unit: '次',
            getValue: (s) => s.extremeColdDriveCount,
            check: (s) => s.extremeColdDriveCount >= 1
        },
        {
            id: 'sun_walker',
            name: '烈日行者',
            icon: '🔥',
            desc: '氣溫 ≥ 35°C 且行駛 > 50 km',
            target: 1,
            unit: '次',
            getValue: (s) => s.hotDriveCount,
            check: (s) => s.hotDriveCount >= 1
        },
        {
            id: 'wuling_conqueror',
            name: '武嶺征服者',
            icon: '🏔️',
            desc: '站點或備註包含武嶺、合歡山、清境或阿里山',
            target: 1,
            unit: '次',
            getValue: (s) => s.mountainVisitCount,
            check: (s) => s.mountainVisitCount >= 1
        },
        {
            id: 'detail_logger',
            name: '細心記錄狂',
            icon: '📝',
            desc: '累計紀錄達 50 筆或連續紀錄 30 天',
            target: 50,
            unit: '筆',
            getValue: (s) => Math.max(s.totalRecordsCount, s.maxConsecutiveDays),
            check: (s) => s.totalRecordsCount >= 50 || s.maxConsecutiveDays >= 30
        },
        {
            id: 'maintenance_star',
            name: '定保優等生',
            icon: '🛡️',
            desc: '保養紀錄里程剛好在大保養間距 ±500 km 內',
            target: 1,
            unit: '次',
            getValue: (s) => s.maintenanceExactCount,
            check: (s) => s.maintenanceExactCount >= 1
        }
    ];

    function calculateStats(records, appState) {
        let globalKm = 0, totalEnergyCost = 0, maxDist = 0;
        let freeChargeOver15Kwh = 0, sweetSpotSocCount = 0, sub100Over150Count = 0;
        let acSlowKwhTotal = 0, hasNightChargeNote = false;
        let extremeColdDriveCount = 0, hotDriveCount = 0, mountainVisitCount = 0, maintenanceExactCount = 0;

        const activeRecords = (records || []).filter(r => r.id !== "SYSTEM_METADATA" && r.id !== "CONFIG_METADATA" && r.date);
        const distinctCities = new Set();
        const recordDates = new Set();

        activeRecords.forEach(rec => {
            const note = rec.note || '';
            const tag = rec.tag || '';
            const district = rec.district || '';
            const cost = parseFloat(rec.cost) || 0;
            const dist = parseFloat(rec.distance) || 0;
            const temp = (rec.temp !== null && rec.temp !== undefined) ? parseFloat(rec.temp) : null;

            if (rec.date) {
                const dStr = rec.date.includes('T') ? rec.date.split('T')[0] : rec.date;
                recordDates.add(dStr);
            }

            TW_CITIES.forEach(c => {
                if (district.includes(c)) distinctCities.add(c.replace('臺', '台'));
            });

            if (MOUNTAIN_REGEX.test(tag) || MOUNTAIN_REGEX.test(note)) {
                mountainVisitCount++;
            }

            if (!['維修保養', '停車費', '通行費', '保險費'].includes(rec.chargeType)) {
                globalKm += dist;
                totalEnergyCost += cost;
                if (dist > maxDist) maxDist = dist;

                if (rec.chargeType.includes('充')) {
                    const chargeKwh = appState.batteryCapacity * (Math.abs((rec.endSoc || 0) - (rec.startSoc || 0)) / 100);
                    if (chargeKwh > 15 && cost === 0) freeChargeOver15Kwh++;
                }

                if (rec.chargeType.includes('快充') && rec.endSoc >= 80 && rec.endSoc <= 82) {
                    sweetSpotSocCount++;
                }

                if (cost <= 100 && dist > 150) sub100Over150Count++;

                if (rec.chargeType.includes('慢充')) {
                    const acKwh = appState.batteryCapacity * (Math.abs((rec.endSoc || 0) - (rec.startSoc || 0)) / 100);
                    acSlowKwhTotal += acKwh;
                }
                if (note.includes('夜充')) hasNightChargeNote = true;

                if (temp !== null && temp <= 10 && dist > 30) extremeColdDriveCount++;
                if (temp !== null && temp >= 35 && dist > 50) hotDriveCount++;
            }

            if (rec.chargeType === '維修保養') {
                const currentKmAtRecord = appState.initialOdometer + (rec.rollingOdo || globalKm);
                const interval = appState.maintInterval || 20000;
                const rem = currentKmAtRecord % interval;
                if (rem <= 500 || rem >= (interval - 500)) maintenanceExactCount++;
            }
        });

        let maxConsecutiveDays = 0;
        if (recordDates.size > 0) {
            const sorted = Array.from(recordDates).sort().map(d => new Date(d).getTime());
            let streak = 1;
            maxConsecutiveDays = 1;
            for (let i = 1; i < sorted.length; i++) {
                const diff = Math.round((sorted[i] - sorted[i - 1]) / 86400000);
                if (diff === 1) {
                    streak++;
                    if (streak > maxConsecutiveDays) maxConsecutiveDays = streak;
                } else if (diff > 1) {
                    streak = 1;
                }
            }
        }

        return {
            totalKm: appState.initialOdometer + globalKm,
            maxDist,
            freeChargeOver15Kwh,
            sweetSpotSocCount,
            sub100Over150Count,
            acSlowKwhTotal,
            hasNightChargeNote,
            cityCount: distinctCities.size,
            totalRecordsCount: activeRecords.length,
            maxConsecutiveDays,
            extremeColdDriveCount,
            hotDriveCount,
            mountainVisitCount,
            maintenanceExactCount
        };
    }

    return {
        renderBadgesList: function(containerEl, records, appState) {
            if (!containerEl) return;
            const stats = calculateStats(records, appState);
            const unlocked = BADGES_CONFIG.filter(b => b.check(stats));
            const baseClass = "px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0 whitespace-nowrap border cursor-pointer hover:scale-105 transition-transform";

            if (unlocked.length > 0) {
                containerEl.innerHTML = unlocked.map(b =>
                    `<div onclick="AchievementSystem.openModal()" class="${baseClass} bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400">${b.icon} ${b.name}</div>`
                ).join('');
            } else {
                containerEl.innerHTML = `<div class="text-[10px] md:text-xs text-slate-400 font-bold px-2 py-1">持續紀錄旅程來解鎖專屬成就！點擊「成就大廳」看挑戰清單</div>`;
            }
        },

        renderModal: function(records, appState) {
            const stats = calculateStats(records, appState);
            const unlocked = [];
            const locked = [];

            BADGES_CONFIG.forEach(b => {
                const isDone = b.check(stats);
                const curVal = b.getValue(stats);
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
        },

        switchTab: function(tab, records, appState) {
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
            this.renderModal(records, appState);
        },

        openModal: function() {
            const modal = document.getElementById('badgeModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
            }, 10);
            this.renderModal(window.AppState.records, window.AppState);
        },

        closeModal: function() {
            const modal = document.getElementById('badgeModal');
            if (!modal) return;
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    };
})();