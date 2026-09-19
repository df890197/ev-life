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
        id: 'low_soc',
        name: '黃金心臟',
        icon: '🪫',
        desc: '曾於電量 ≤ 10% 順利抵達充電',
        target: 1,
        unit: '次',
        getValue: (stats) => Number(stats.lowSocCount) || 0,
        check: (stats) => (Number(stats.lowSocCount) || 0) >= 1
    }
];
