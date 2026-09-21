// achievements.js - 獨立成就系統模組

const ALL_BADGES_CONFIG = [
    // 🌍 基本環保與省錢
    { id: 'eco', name: '環保先鋒', icon: '🌍', desc: '累積減少 500kg CO₂', target: 500, unit: 'kg', getValue: (stats) => Number(stats.co2Savings) || 0, check: (stats) => (Number(stats.co2Savings) || 0) >= 500 },
    { id: 'eco_god', name: '森林守護神', icon: '🌲', desc: '累積減少 1,000kg CO₂', target: 1000, unit: 'kg', getValue: (stats) => Number(stats.co2Savings) || 0, check: (stats) => (Number(stats.co2Savings) || 0) >= 1000 },
    { id: 'money', name: '省錢大師', icon: '💰', desc: '省下超過 5,000 元油錢', target: 5000, unit: '元', getValue: (stats) => Number(stats.fuelSavings) || 0, check: (stats) => (Number(stats.fuelSavings) || 0) >= 5000 },
    { id: 'money_10k', name: '萬元俱樂部', icon: '🪙', desc: '省下超過 10,000 元油錢', target: 10000, unit: '元', getValue: (stats) => Number(stats.fuelSavings) || 0, check: (stats) => (Number(stats.fuelSavings) || 0) >= 10000 },

    // 🛣️ 里程與終極目標
    { id: 'range', name: '高速巡航者', icon: '🚀', desc: '單趟行駛超過 200 公里', target: 200, unit: 'km', getValue: (stats) => Number(stats.maxDist) || 0, check: (stats) => (Number(stats.maxDist) || 0) >= 200 },
    { id: 'range_challenger', name: '續航挑戰者', icon: '🏔️', desc: '單趟行駛超過 400 公里', target: 400, unit: 'km', getValue: (stats) => Number(stats.maxDist) || 0, check: (stats) => (Number(stats.maxDist) || 0) >= 400 },
    { id: 'intercity_stride', name: '長途跋涉', icon: '🚀', desc: '兩次充電區間行駛里程突破 250 公里', target: 250, unit: 'km', getValue: (stats) => Number(stats.maxChargeIntervalDist) || 0, check: (stats) => (Number(stats.maxChargeIntervalDist) || 0) >= 250 },
    { id: 'island', name: '環島旅行家', icon: '🌐', desc: '總里程達到 1,000 公里', target: 1000, unit: 'km', getValue: (stats) => Number(stats.totalKm) || 0, check: (stats) => (Number(stats.totalKm) || 0) >= 1000 },
    { id: '10k_club', name: '萬里達人', icon: '🌌', desc: '總里程達到 10,000 公里', target: 10000, unit: 'km', getValue: (stats) => Number(stats.totalKm) || 0, check: (stats) => (Number(stats.totalKm) || 0) >= 10000 },
    { id: 'earth_globe', name: '環遊世界', icon: '🌍', desc: '總里程突破 40,000 公里', target: 40000, unit: 'km', getValue: (stats) => Number(stats.totalKm) || 0, check: (stats) => (Number(stats.totalKm) || 0) >= 40000 },

    // ⚡ 電耗、花費與極限
    { id: 'foot', name: '黃金右腳', icon: '👑', desc: '單趟電耗達 6.5 km/度以上', target: 6.5, unit: 'km/度', getValue: (stats) => Number(stats.maxEff) || 0, check: (stats) => (Number(stats.maxEff) || 0) >= 6.5 },
    { id: 'diamond_foot', name: '鑽石右腳', icon: '💎', desc: '單趟電耗達 8.0 km/度以上', target: 8.0, unit: 'km/度', getValue: (stats) => Number(stats.maxEff) || 0, check: (stats) => (Number(stats.maxEff) || 0) >= 8.0 },
    { id: 'god_foot', name: '神級右腳', icon: '👼', desc: '單趟電耗突破 9.5 km/度', target: 9.5, unit: 'km/度', getValue: (stats) => Number(stats.godEffCount) || 0, check: (stats) => (Number(stats.godEffCount) || 0) >= 1 },
    { id: 'heavy_foot', name: '貼地飛行', icon: '🏎️', desc: '單趟電耗低於 4.5 km/度', target: 1, unit: '次', getValue: (stats) => Number(stats.heavyFootCount) || 0, check: (stats) => (Number(stats.heavyFootCount) || 0) >= 1 },
    { id: 'monster_eff', name: '吃電怪獸', icon: '🦖', desc: '單趟電耗低於 3.5 km/度', target: 1, unit: '次', getValue: (stats) => Number(stats.monsterEffCount) || 0, check: (stats) => (Number(stats.monsterEffCount) || 0) >= 1 },
    { id: 'cheap_drive', name: '銅板經濟', icon: '🧮', desc: '每公里花費 < 0.5元 (單趟≥50km)', target: 1, unit: '次', getValue: (stats) => Number(stats.cheapDriveCount) || 0, check: (stats) => (Number(stats.cheapDriveCount) || 0) >= 1 },
    { id: 'expensive_drive', name: '尊榮出行', icon: '🦅', desc: '每公里花費 > 2.5元 (單趟≥50km)', target: 1, unit: '次', getValue: (stats) => Number(stats.expensiveDriveCount) || 0, check: (stats) => (Number(stats.expensiveDriveCount) || 0) >= 1 },
    { id: 'super_bargain', name: '電價神操作', icon: '🏷️', desc: '單次外充平均每度電 < 6.5 元', target: 1, unit: '次', getValue: (stats) => Number(stats.cheapKwhChargeCount) || 0, check: (stats) => (Number(stats.cheapKwhChargeCount) || 0) >= 1 },
    { id: 'global_eff_master', name: '神級操盤手', icon: '📈', desc: '歷史平均電耗 ≥ 7.0 (總里程≥1000km)', target: 1, unit: '次', getValue: (stats) => Number(stats.isGlobalEffHigh) || 0, check: (stats) => (Number(stats.isGlobalEffHigh) || 0) >= 1 },

    // 🔋 充電次數里程碑
    { id: 'first_charge', name: '初次充電', icon: '🐣', desc: '完成第 1 次充電紀錄', target: 1, unit: '次', getValue: (stats) => Number(stats.chargeCount) || 0, check: (stats) => (Number(stats.chargeCount) || 0) >= 1 },
    { id: 'charge_rookie', name: '充電新手', icon: '🔌', desc: '累積完成 10 次充電', target: 10, unit: '次', getValue: (stats) => Number(stats.chargeCount) || 0, check: (stats) => (Number(stats.chargeCount) || 0) >= 10 },
    { id: 'charge_master', name: '充電達人', icon: '🔋', desc: '累積完成 100 次充電', target: 100, unit: '次', getValue: (stats) => Number(stats.chargeCount) || 0, check: (stats) => (Number(stats.chargeCount) || 0) >= 100 },
    
    // ⚡ 趣味、極限與電池控制
    { id: 'lucky_7', name: '幸運 n7', icon: '🎰', desc: '里程、電量或花費包含特定 7 字尾', target: 1, unit: '次', getValue: (stats) => Number(stats.lucky7Count) || 0, check: (stats) => (Number(stats.lucky7Count) || 0) >= 1 },
    { id: 'dc_lover', name: '急速補給', icon: '⚡', desc: '累積使用 DC 快充達 20 次', target: 20, unit: '次', getValue: (stats) => Number(stats.dcChargeCount) || 0, check: (stats) => (Number(stats.dcChargeCount) || 0) >= 20 },
    { id: 'ac_lover', name: '慢充養生學', icon: '🔌', desc: '累積使用 AC 慢充達 20 次', target: 20, unit: '次', getValue: (stats) => Number(stats.acChargeCount) || 0, check: (stats) => (Number(stats.acChargeCount) || 0) >= 20 },
    { id: 'dual_wielder', name: '純電雙槍俠', icon: '⚔️', desc: 'DC 快充與 AC 慢充各達 10 次', target: 20, unit: '次', getValue: (stats) => Number((stats.dcChargeCount>10?10:stats.dcChargeCount) + (stats.acChargeCount>10?10:stats.acChargeCount)) || 0, check: (stats) => stats.dcChargeCount >= 10 && stats.acChargeCount >= 10 },
    { id: 'road_trip_day', name: '特快急行軍', icon: '🏎️', desc: '同一天內進行 2 次以上快充（長途）', target: 1, unit: '次', getValue: (stats) => Number(stats.multiChargeSameDayCount) || 0, check: (stats) => (Number(stats.multiChargeSameDayCount) || 0) >= 1 },
    { id: 'low_soc', name: '黃金心臟', icon: '🪫', desc: '曾於電量 ≤ 10% 順利抵達充電', target: 1, unit: '次', getValue: (stats) => Number(stats.lowSocCount) || 0, check: (stats) => (Number(stats.lowSocCount) || 0) >= 1 },
    { id: 'extreme_survival', name: '心臟超大顆', icon: '🫀', desc: '電量 ≤ 5% 壓線抵達充電站', target: 1, unit: '次', getValue: (stats) => Number(stats.extremeSurvivalCount) || 0, check: (stats) => (Number(stats.extremeSurvivalCount) || 0) >= 1 },
    { id: 'soc_keeper', name: '電量守門員', icon: '🛡️', desc: '低於 10% 才充電，累積達 10 次', target: 10, unit: '次', getValue: (stats) => Number(stats.extremeLowSocCount) || 0, check: (stats) => (Number(stats.extremeLowSocCount) || 0) >= 10 },
    { id: 'max_drain', name: '榨乾極限', icon: '🧃', desc: '單趟一口氣消耗 80% 以上電量', target: 80, unit: '%', getValue: (stats) => Number(stats.maxSocDrain) || 0, check: (stats) => (Number(stats.maxSocDrain) || 0) >= 80 },
    { id: 'big_eater', name: '大胃王', icon: '🤤', desc: '單次充電充入超過 50 度電', target: 1, unit: '次', getValue: (stats) => Number(stats.hugeChargeKwhCount) || 0, check: (stats) => (Number(stats.hugeChargeKwhCount) || 0) >= 1 },
    { id: 'anxiety', name: '電量焦慮', icon: '😰', desc: '曾於電量 ≥ 80% 時進行充電', target: 1, unit: '次', getValue: (stats) => Number(stats.anxietyCount) || 0, check: (stats) => (Number(stats.anxietyCount) || 0) >= 1 },
    { id: 'health_80', name: '80%俱樂部', icon: '💚', desc: '充電只充到 80% 以下，達 30 次', target: 30, unit: '次', getValue: (stats) => Number(stats.health80Count) || 0, check: (stats) => (Number(stats.health80Count) || 0) >= 30 },
    { id: 'full_power_strike', name: '滿電出擊', icon: '🔋', desc: '出發電量為 100% 達 5 次', target: 5, unit: '次', getValue: (stats) => Number(stats.fullPowerStrikeCount) || 0, check: (stats) => (Number(stats.fullPowerStrikeCount) || 0) >= 5 },
    { id: 'full_charge', name: '滿電強迫症', icon: '💯', desc: '累積 5 次將電量充至 99% 以上', target: 5, unit: '次', getValue: (stats) => Number(stats.fullChargeCount) || 0, check: (stats) => (Number(stats.fullChargeCount) || 0) >= 5 },
    { id: 'freeloader', name: '蹭電達人', icon: '🆓', desc: '達成 5 次 0 元充電', target: 5, unit: '次', getValue: (stats) => Number(stats.freeChargeCount) || 0, check: (stats) => (Number(stats.freeChargeCount) || 0) >= 5 },
    { id: 'pro_freeloader', name: '真・蹭電王', icon: '🥷', desc: '0 元充電且單次充入大於 30%', target: 1, unit: '次', getValue: (stats) => Number(stats.proFreeloaderCount) || 0, check: (stats) => (Number(stats.proFreeloaderCount) || 0) >= 1 },
    { id: 'ultimate_freeloader', name: '免費仔的極致', icon: '🎭', desc: '單趟破 100 公里且該次充電 0 元', target: 1, unit: '次', getValue: (stats) => Number(stats.zeroCostLongDriveCount) || 0, check: (stats) => (Number(stats.zeroCostLongDriveCount) || 0) >= 1 },
    { id: 'quick_pitstop', name: '快充快閃', icon: '⏱️', desc: '單次充電增加不到 10% 電量', target: 1, unit: '次', getValue: (stats) => Number(stats.quickPitstopCount) || 0, check: (stats) => (Number(stats.quickPitstopCount) || 0) >= 1 },
    { id: 'perfect_half', name: '精準控制', icon: '🎯', desc: '單次充電剛好充入整整 50%', target: 1, unit: '次', getValue: (stats) => Number(stats.perfectHalfCount) || 0, check: (stats) => (Number(stats.perfectHalfCount) || 0) >= 1 },
    { id: 'lucky_soc', name: '精準停損', icon: '🛑', desc: '充電結束電量剛好落在 66% 或 88%', target: 1, unit: '次', getValue: (stats) => Number(stats.luckySocCount) || 0, check: (stats) => (Number(stats.luckySocCount) || 0) >= 1 },
    { id: 'round_ocd', name: '湊整數強迫症', icon: '🔢', desc: '充前充後電量皆為整數十位數達 5 次', target: 5, unit: '次', getValue: (stats) => Number(stats.roundOcdCount) || 0, check: (stats) => (Number(stats.roundOcdCount) || 0) >= 5 },
    { id: 'battery_zen', name: '淺充淺放', icon: '🧘', desc: '電量 30%~80% 區間充電達 10 次', target: 10, unit: '次', getValue: (stats) => Number(stats.shallowChargeCount) || 0, check: (stats) => (Number(stats.shallowChargeCount) || 0) >= 10 },
    { id: 'deep_cycle', name: '深度大循環', icon: '♻️', desc: '單次從 <20% 充至 >80% 達 5 次', target: 5, unit: '次', getValue: (stats) => Number(stats.deepCycleCount) || 0, check: (stats) => (Number(stats.deepCycleCount) || 0) >= 5 },
    { id: 'full_resurrection', name: '滿血復活', icon: '💖', desc: '單次充電補給超過 85% 電量', target: 1, unit: '次', getValue: (stats) => Number(stats.fullResurrectionCount) || 0, check: (stats) => (Number(stats.fullResurrectionCount) || 0) >= 1 },

    // 💸 費用極限
    { id: 'big_spender', name: '超充大戶', icon: '💸', desc: '曾單次充電花費超過 500 元', target: 1, unit: '次', getValue: (stats) => Number(stats.highCostChargeCount) || 0, check: (stats) => (Number(stats.highCostChargeCount) || 0) >= 1 },
    { id: 'mega_watt', name: '兆瓦級買家', icon: '⚡', desc: '累計消耗超過 1,000 度電', target: 1000, unit: '度', getValue: (stats) => Number(stats.globalPower) || 0, check: (stats) => (Number(stats.globalPower) || 0) >= 1000 },
    { id: 'expensive_fees', name: '本末倒置', icon: '😭', desc: '總停車+通行費大於總電費 (里程>1000)', target: 1, unit: '次', getValue: (stats) => Number(stats.isFeesMoreThanPower) || 0, check: (stats) => (Number(stats.isFeesMoreThanPower) || 0) >= 1 },

    // 🌡️ 氣候與環境
    { id: 'hot_walker', name: '烈日行者', icon: '☀️', desc: '在 35°C 以上高溫行駛超過 10km', target: 1, unit: '次', getValue: (stats) => Number(stats.hotTempCount) || 0, check: (stats) => (Number(stats.hotTempCount) || 0) >= 1 },
    { id: 'cold_warrior', name: '寒冬戰士', icon: '❄️', desc: '在 12°C 以下低溫行駛超過 10km', target: 1, unit: '次', getValue: (stats) => Number(stats.coldTempCount) || 0, check: (stats) => (Number(stats.coldTempCount) || 0) >= 1 },
    { id: 'ice_and_fire', name: '冰火雙重天', icon: '🌋', desc: '紀錄裡同時集齊 35°C 以上與 12°C 以下', target: 1, unit: '次', getValue: (stats) => (stats.hotTempCount > 0 && stats.coldTempCount > 0) ? 1 : 0, check: (stats) => stats.hotTempCount >= 1 && stats.coldTempCount >= 1 },

    // 🗺️ 探索與忠誠
    { id: 'city_hopper', name: '跨城漫遊者', icon: '🏙️', desc: '在 3 個不同縣市進行過紀錄', target: 3, unit: '市', getValue: (stats) => Number(stats.uniqueCities) || 0, check: (stats) => (Number(stats.uniqueCities) || 0) >= 3 },
    { id: 'six_capitals', name: '六都大滿貫', icon: '🗺️', desc: '足跡涵蓋台灣六都 (北中南高桃新)', target: 6, unit: '都', getValue: (stats) => Number(stats.sixCapitalsCount) || 0, check: (stats) => (Number(stats.sixCapitalsCount) || 0) >= 6 },
    { id: 'east_coast', name: '東部拓荒者', icon: '🌊', desc: '定位包含宜蘭、花蓮或台東', target: 1, unit: '次', getValue: (stats) => Number(stats.eastCoastCount) || 0, check: (stats) => (Number(stats.eastCoastCount) || 0) >= 1 },
    { id: 'south_bound', name: '一路向南', icon: '🌴', desc: '定位包含屏東、恆春或墾丁', target: 1, unit: '次', getValue: (stats) => Number(stats.southboundCount) || 0, check: (stats) => (Number(stats.southboundCount) || 0) >= 1 },
    { id: 'island_hero', name: '離島勇者', icon: '⛴️', desc: '定位包含澎湖、金門等外島地區', target: 1, unit: '次', getValue: (stats) => Number(stats.offshoreIslandCount) || 0, check: (stats) => (Number(stats.offshoreIslandCount) || 0) >= 1 },
    { id: 'station_hunter', name: '站點獵人', icon: '📍', desc: '造訪並充電過 5 個不同的充電站', target: 5, unit: '站', getValue: (stats) => Number(stats.uniqueStations) || 0, check: (stats) => (Number(stats.uniqueStations) || 0) >= 5 },
    { id: 'station_master', name: '百站巡禮', icon: '🏆', desc: '造訪並充電過 100 個不同的充電站', target: 100, unit: '站', getValue: (stats) => Number(stats.uniqueStations) || 0, check: (stats) => (Number(stats.uniqueStations) || 0) >= 100 },
    { id: 'highway_oasis', name: '國道綠洲', icon: '⛽', desc: '在國道服務區/休息站快充達 3 次', target: 3, unit: '次', getValue: (stats) => Number(stats.serviceAreaChargeCount) || 0, check: (stats) => (Number(stats.serviceAreaChargeCount) || 0) >= 3 },
    { id: 'brand_loyal', name: '品牌鐵粉', icon: '🏢', desc: '在同一外站品牌充電達 10 次', target: 10, unit: '次', getValue: (stats) => Number(stats.maxBrandCharge) || 0, check: (stats) => (Number(stats.maxBrandCharge) || 0) >= 10 },

    // 📅 時間與作息
    { id: 'weekend_driver', name: '假日車手', icon: '🎉', desc: '在週末(六/日)完成 10 趟行駛', target: 10, unit: '趟', getValue: (stats) => Number(stats.weekendDriveCount) || 0, check: (stats) => (Number(stats.weekendDriveCount) || 0) >= 10 },
    { id: 'full_year', name: '歲月如梭', icon: '🗓️', desc: '持之以恆，紀錄橫跨 12 個不同的月份', target: 12, unit: '月', getValue: (stats) => Number(stats.uniqueMonths) || 0, check: (stats) => (Number(stats.uniqueMonths) || 0) >= 12 },

    // 🛠️ 養車、費用與紀錄
    { id: 'grand_slam', name: '紀錄大滿貫', icon: '🏅', desc: '收集全部 6 種用車與花費紀錄類型', target: 6, unit: '種', getValue: (stats) => Number(stats.uniqueRecordTypes) || 0, check: (stats) => (Number(stats.uniqueRecordTypes) || 0) >= 6 },
    { id: 'toll_parking', name: '過路財神', icon: '🅿️', desc: '停車與通行費累積超過 1,000 元', target: 1000, unit: '元', getValue: (stats) => Number(stats.nonDriveCost) || 0, check: (stats) => (Number(stats.nonDriveCost) || 0) >= 1000 },
    { id: 'highway_cruiser', name: '國道常客', icon: '🛣️', desc: '紀錄 5 次通行費支出', target: 5, unit: '次', getValue: (stats) => Number(stats.tollCount) || 0, check: (stats) => (Number(stats.tollCount) || 0) >= 5 },
    { id: 'parking_tycoon', name: '停車大亨', icon: '🅿️', desc: '紀錄 10 次停車費支出', target: 10, unit: '次', getValue: (stats) => Number(stats.parkingCount) || 0, check: (stats) => (Number(stats.parkingCount) || 0) >= 10 },
    { id: 'vip_parking', name: '天龍國停車', icon: '💸', desc: '單次停車費達 300 元以上', target: 1, unit: '次', getValue: (stats) => Number(stats.vipParkingCount) || 0, check: (stats) => (Number(stats.vipParkingCount) || 0) >= 1 },
    { id: 'insurance', name: '安全第一', icon: '🛡️', desc: '紀錄 1 次保險費支出', target: 1, unit: '次', getValue: (stats) => Number(stats.insuranceCount) || 0, check: (stats) => (Number(stats.insuranceCount) || 0) >= 1 },
    
    // 🚙 駕駛里程趣味
    { id: 'perfect_100', name: '完美百公里', icon: '💯', desc: '單趟行駛里程剛好為 100 km', target: 1, unit: '次', getValue: (stats) => Number(stats.perfect100Count) || 0, check: (stats) => (Number(stats.perfect100Count) || 0) >= 1 },
    { id: 'data_nerd', name: '數據控', icon: '📊', desc: '累積新增 50 筆行駛紀錄', target: 50, unit: '筆', getValue: (stats) => Number(stats.recordCount) || 0, check: (stats) => (Number(stats.recordCount) || 0) >= 50 }
];

let currentBadgeTab = 'unlocked';

// 🔹 儲存與取得解鎖日期的功能
function getUnlockedBadgeDates(stats) {
    const STORAGE_KEY = 'ev_life_badge_dates';
    let badgeDates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let hasNew = false;
    
    const app = window.AppState || {};
    const records = app.records || [];
    const activeRecords = records.filter(r => r.id !== "SYSTEM_METADATA" && r.id !== "CONFIG_METADATA" && r.date);
    activeRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const latestDate = activeRecords.length > 0 ? activeRecords[activeRecords.length - 1].date : new Date().toISOString().split('T')[0];

    ALL_BADGES_CONFIG.forEach(b => {
        if (b.check(stats)) {
            if (!badgeDates[b.id]) {
                badgeDates[b.id] = latestDate;
                hasNew = true;
            }
        } else {
            if (badgeDates[b.id]) {
                delete badgeDates[b.id];
                hasNew = true;
            }
        }
    });

    if (hasNew) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(badgeDates));
    }
    return badgeDates;
}

// 🔹 核心數據統計函式
function getAchievementStats() {
    const app = window.AppState || {};
    const records = app.records || [];
    const batteryCapacity = Number(app.batteryCapacity) || 57.7;
    const initialOdo = Number(app.initialOdometer) || 0;
    const iceEff = Number(app.iceEfficiency) || 15.0;
    const gasPrice = Number(app.gasPrice) || 30.0;
    const co2Rate = 0.095;

    let globalKm = 0, totalEnergyCost = 0, globalPower = 0;
    let maxDist = 0, maxEff = 0, lowSocCount = 0;
    let freeChargeCount = 0, anxietyCount = 0, validDriveCount = 0;
    let heavyFootCount = 0, maxSocDrain = 0;
    let fullChargeCount = 0, highCostChargeCount = 0;
    let nonDriveCost = 0, maintenanceCount = 0;
    let insuranceCount = 0, cheapDriveCount = 0, expensiveDriveCount = 0, quickPitstopCount = 0;
    let chargeCount = 0, health80Count = 0, extremeLowSocCount = 0;
    
    let hotTempCount = 0, coldTempCount = 0;
    let perfectHalfCount = 0;
    let weekendDriveCount = 0, shallowChargeCount = 0, tollCount = 0, parkingCount = 0;
    let dcChargeCount = 0, acChargeCount = 0, deepCycleCount = 0;

    // 💡 依賴純數據的新變數
    let serviceAreaChargeCount = 0, cheapKwhChargeCount = 0, maxChargeIntervalDist = 0;
    let extremeSurvivalCount = 0, godEffCount = 0, monsterEffCount = 0;
    let lucky7Count = 0, vipParkingCount = 0, microChargeCount = 0;
    let eastCoastCount = 0, roundOcdCount = 0;
    let perfect100Count = 0, fullPowerStrikeCount = 0, proFreeloaderCount = 0, fullResurrectionCount = 0;
    
    // 加碼全新純數據成就
    let zeroCostLongDriveCount = 0, hugeChargeKwhCount = 0, luckySocCount = 0;
    let southboundCount = 0, offshoreIslandCount = 0;

    const citySet = new Set();
    const stationSet = new Set();
    const chargeDateMap = {};
    const districtSet = new Set();
    const tagCountMap = {};
    const recordTypesSet = new Set();
    const recordMonthsSet = new Set();
    const sixCapitalsSet = new Set();

    const activeRecords = records.filter(r => r.id !== "SYSTEM_METADATA" && r.id !== "CONFIG_METADATA" && r.date);

    activeRecords.forEach(rec => {
        if (rec.chargeType && rec.chargeType !== '未充電') {
            recordTypesSet.add(rec.chargeType.replace('DC-', '').replace('AC-', ''));
        }
        if (rec.date && rec.date.length >= 7) {
            recordMonthsSet.add(rec.date.substring(0, 7));
        }

        // 處理非充電/駕駛的雜項花費
        if (['維修保養', '停車費', '通行費', '保險費'].includes(rec.chargeType)) {
            const extraCost = parseFloat(rec.cost) || 0;
            if (rec.chargeType === '維修保養') maintenanceCount++;
            if (rec.chargeType === '停車費') { 
                nonDriveCost += extraCost; 
                parkingCount++; 
                if (extraCost >= 300) vipParkingCount++;
            }
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

            if (rec.chargeType === 'DC-快充') dcChargeCount++;
            if (rec.chargeType === 'AC-慢充') acChargeCount++;

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

            if (dist > maxDist) maxDist = dist;

            // 完美百公里
            if (dist === 100) perfect100Count++;
            
            // 滿電出擊 (出發電量 100%)
            if (rec.chargeType === '未充電' && startSoc === 100 && dist > 0) {
                fullPowerStrikeCount++;
            }

            // 幸運 n7：距離、SOC或花費包含特定 7 字尾
            if (dist === 77.7 || dist === 77 || endSoc === 77 || cost === 777 || cost === 77) {
                lucky7Count++;
            }

            // 定位地區相關成就
            if (rec.district && rec.district.trim() !== '') {
                const safeDist = rec.district.trim();
                districtSet.add(safeDist);
                // 東海岸
                if (safeDist.match(/宜蘭|花蓮|台東|臺東/)) eastCoastCount++;
                // 一路向南
                if (safeDist.match(/屏東|恆春|墾丁/)) southboundCount++;
                // 離島勇者
                if (safeDist.match(/澎湖|金門|連江|馬祖|小琉球|綠島|蘭嶼/)) offshoreIslandCount++;
                
                // 六都判定
                if (safeDist.match(/台北|臺北/)) sixCapitalsSet.add('TPE');
                if (safeDist.match(/新北/)) sixCapitalsSet.add('NTPC');
                if (safeDist.match(/桃園/)) sixCapitalsSet.add('TY');
                if (safeDist.match(/台中|臺中/)) sixCapitalsSet.add('TC');
                if (safeDist.match(/台南|臺南/)) sixCapitalsSet.add('TN');
                if (safeDist.match(/高雄/)) sixCapitalsSet.add('KH');
            }

            if (!isNaN(temp) && dist > 10) {
                if (temp >= 35) hotTempCount++;
                if (temp <= 12) coldTempCount++;
            }
            
            if (dist >= 50 && cost > 0) {
                const costPerKm = cost / dist;
                if (costPerKm <= 0.5) cheapDriveCount++;
                if (costPerKm >= 2.5) expensiveDriveCount++;
            }

            if (pwr > 0 && dist > 5) {
                const eff = dist / pwr;
                if (eff > maxEff) maxEff = eff; 
                if (eff >= 9.5) godEffCount++; // 神級右腳
                if (eff <= 3.5) monsterEffCount++; // 吃電怪獸
                if (eff < 4.5) heavyFootCount++;
            }

            if (socDelta > maxSocDrain && dist > 0) maxSocDrain = socDelta;

            if ((!isNaN(startSoc) && startSoc <= 10) || (!isNaN(endSoc) && endSoc <= 10)) {
                lowSocCount++;
            }

            if (!isNaN(startSoc) && startSoc <= 5) extremeSurvivalCount++; // 5% 極限心臟

            // ⚡ 充電行為判定 (補進電量：結束 > 起始)
            if (!isNaN(startSoc) && !isNaN(endSoc) && endSoc > startSoc) {
                chargeCount++; 
                const delta = endSoc - startSoc;

                // 兩次充電區間的行駛里程
                if (dist > maxChargeIntervalDist) maxChargeIntervalDist = dist;

                // 滿血復活：單次補給超過 85%
                if (delta >= 85) fullResurrectionCount++;
                
                // 大胃王：單次充入超過 50 度電
                const chargedKwh = batteryCapacity * (delta / 100);
                if (chargedKwh >= 50) hugeChargeKwhCount++;

                // 精準停損：結束剛好落在 66 或 88
                if (endSoc === 66 || endSoc === 88) luckySocCount++;

                // 充電地點所屬縣市
                if (rec.district && rec.district.trim() !== '') {
                    const matchCity = rec.district.trim().match(/^[^\d\s]{2}[縣市]/);
                    if (matchCity) citySet.add(matchCity[0]);
                }

                // 站點不重複統計 & 國道服務區/休息站 快充判定
                if (rec.tag && rec.tag.trim() !== '') {
                    const safeTag = rec.tag.trim();
                    stationSet.add(safeTag);
                    if (/服務區|休息站|高公局/i.test(safeTag)) serviceAreaChargeCount++;
                }

                // 單次外充平均每度電 < 6.5 元
                if (cost > 0 && chargedKwh > 0) {
                    const pricePerKwh = cost / chargedKwh;
                    if (pricePerKwh < 6.5) cheapKwhChargeCount++;
                }

                // 同一天快充次數統計
                if (rec.date && rec.chargeType === 'DC-快充') {
                    chargeDateMap[rec.date] = (chargeDateMap[rec.date] || 0) + 1;
                }

                if (endSoc <= 80) health80Count++;
                if (startSoc <= 10) extremeLowSocCount++;
                if (delta < 10) quickPitstopCount++;
                if (delta > 0 && delta <= 5) microChargeCount++;
                if (delta === 50) perfectHalfCount++;
                
                // 湊整數強迫症
                if (startSoc % 10 === 0 && endSoc % 10 === 0) roundOcdCount++;
                
                if (startSoc >= 30 && endSoc <= 80) shallowChargeCount++;
                if (startSoc <= 20 && endSoc >= 80) deepCycleCount++;
                if (endSoc >= 99) fullChargeCount++;
                
                if (cost === 0) {
                    freeChargeCount++;
                    if (delta >= 30) proFreeloaderCount++; // 真・蹭電王
                    if (dist >= 100) zeroCostLongDriveCount++; // 免費仔的極致
                }

                if (rec.tag && rec.tag.trim() !== '' && !rec.tag.includes('住家')) {
                    const cleanTag = rec.tag.trim();
                    tagCountMap[cleanTag] = (tagCountMap[cleanTag] || 0) + 1;
                }
            }

            if (!isNaN(startSoc) && startSoc >= 80) anxietyCount++;
            if (cost >= 500) highCostChargeCount++;
        }
    });

    const maxBrandCharge = Object.values(tagCountMap).length > 0 ? Math.max(...Object.values(tagCountMap)) : 0;
    const multiChargeSameDayCount = Object.values(chargeDateMap).filter(cnt => cnt >= 2).length;

    const hypotheticalGasCost = (globalKm / iceEff) * gasPrice;
    const fuelSavings = Math.max(0, hypotheticalGasCost - totalEnergyCost);
    const co2Savings = globalKm * co2Rate;
    const totalKm = initialOdo + globalKm;

    // 計算本末倒置與神級操盤手
    const isFeesMoreThanPower = (globalKm >= 1000 && nonDriveCost > totalEnergyCost) ? 1 : 0;
    const globalAvgEff = globalPower > 0 ? (globalKm / globalPower) : 0;
    const isGlobalEffHigh = (globalKm >= 1000 && globalAvgEff >= 7.0) ? 1 : 0;

    return { 
        globalKm, totalKm, fuelSavings, co2Savings, maxDist, maxEff, lowSocCount,
        freeChargeCount, anxietyCount, recordCount: validDriveCount,
        heavyFootCount, maxSocDrain, fullChargeCount, 
        highCostChargeCount, globalPower, nonDriveCost, maintenanceCount,
        insuranceCount, cheapDriveCount, expensiveDriveCount, quickPitstopCount,
        chargeCount, health80Count, extremeLowSocCount,
        hotTempCount, coldTempCount, uniqueDistricts: districtSet.size, 
        maxBrandCharge, perfectHalfCount,
        weekendDriveCount, shallowChargeCount, tollCount, parkingCount,
        dcChargeCount, acChargeCount, deepCycleCount,
        uniqueCities: citySet.size,
        uniqueStations: stationSet.size,
        serviceAreaChargeCount,
        maxChargeIntervalDist,
        cheapKwhChargeCount,
        multiChargeSameDayCount,
        extremeSurvivalCount,
        godEffCount,
        monsterEffCount,
        lucky7Count,
        vipParkingCount,
        microChargeCount,
        eastCoastCount,
        roundOcdCount,
        uniqueRecordTypes: recordTypesSet.size,
        uniqueMonths: recordMonthsSet.size,
        sixCapitalsCount: sixCapitalsSet.size,
        perfect100Count,
        fullPowerStrikeCount,
        proFreeloaderCount,
        fullResurrectionCount,
        zeroCostLongDriveCount,
        hugeChargeKwhCount,
        luckySocCount,
        isFeesMoreThanPower,
        isGlobalEffHigh,
        southboundCount,
        offshoreIslandCount
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

// 🔹 渲染彈窗清單內容 (包含解鎖日期)
function renderBadgeModalContent() {
    const stats = getAchievementStats();
    const badgeDates = getUnlockedBadgeDates(stats);
    const unlocked = [];
    const locked = [];

    ALL_BADGES_CONFIG.forEach(b => {
        const isDone = b.check(stats);
        const curVal = b.getValue(stats) || 0;
        const unlockDate = badgeDates[b.id] || '';
        const item = { ...b, isDone, curVal, unlockDate };
        
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
        const dateHtml = (item.isDone && item.unlockDate) 
            ? `<div class="text-[8px] md:text-[9px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">${item.unlockDate}</div>` 
            : '';

        return `
        <div class="p-3.5 rounded-2xl border ${item.isDone ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'} flex items-center gap-3.5">
            <span class="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex-shrink-0">${item.icon}</span>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-0.5">
                    <h4 class="text-xs md:text-sm font-black ${item.isDone ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}">${item.name}</h4>
                    <div class="text-right">
                        <span class="text-[10px] font-mono font-bold ${item.isDone ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}">
                            ${item.isDone ? '✅ 已解鎖' : `${item.curVal.toFixed(1)} / ${item.target}${item.unit}`}
                        </span>
                        ${dateHtml}
                    </div>
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
