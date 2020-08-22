module.exports = {
    telegram: {
        chats: [
            476688503, // (INT)
        ],
    },
    proxmox: {
        interval: 5 * 60 * 1000, // 5 Minutes (5[minutes] * 60[seconds] * 1000[milliseconds])
        vm: {
            timeframe: 'hour', // ONLY: hour, day, week, month and year, (Default: hour) [lowercased]
            cf: 'AVERAGE', // (Consolidation function) ONLY: MAX and AVERAGE (Default: AVERAGE) [uppercased]
            cpu: {
                identifier: 'CPU', // Only for Messaging
                reactAt: 1, // 1 percent in usage [figures in percent]
                reactWith: null, // Currently available types: STOP | for nothing using null (Default: null)
                maxPermits: 5, // Score (Default: 5)
            },
            mem: {
                identifier: 'Memory', // Only for Messaging
                reactAt: 10, // 10 percent in usage
                reactWith: null, // Currently available types: STOP | for nothing using null (Default: null)
                maxPermits: 5, // Score (Default: 5)
            },
            network: {
                identifier: 'Network', // Only for Messaging
                reactAt: 50, // 50 MBit/s [figures in mbit/s]
                reactWith: null, // Currently available types: STOP | for nothing using null (Default: STOP)
                maxPermits: 1, // Score (Default: 3)
            }
        },
    },
};