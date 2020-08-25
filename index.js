require('dotenv').config();
const proxmox = require('proxmox-client');
const config = require('./conf');
const TelegramBot = require('slimbot');
const telegramEnabled = process.env.TELEGRAM_ENABLED;
if (telegramEnabled) const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

proxmox.auth(process.env.PROXMOX_HOSTNAME, process.env.PROXMOX_TOKEN_NAME, process.env.PROXMOX_TOKEN);

setInterval(() => proxmox.get('/cluster/resources').then((res) => {
    if(!proxmox.authorized)
        return;
    Object.entries(JSON.parse(res.text).data).forEach(entry => {
        const [key, value] = entry;
        if (value.type === 'qemu' || value.type === 'lxc' && value.status === 'running') {
            let vmid = value.id.split('/')[1];
            proxmox.get(`/nodes/${value.node}/${value.id}/rrddata?timeframe=${config.proxmox.vm.timeframe}&cf=${config.proxmox.vm.cf}`).then((res) => {
                let cpuScore = 0, memScore = 0, netScore = 0;
                JSON.parse(res.text).data.forEach(data => {
                    if (Object.keys(data).length > 5) {
                        if (Math.round(data.cpu) > config.proxmox.vm.cpu.reactAt) cpuScore++;
                        if (Math.round(((100 / data.maxmem) * data.mem)) > config.proxmox.vm.mem.reactAt) memScore++;
                        if (Math.round((data.netout / 124000)) > config.proxmox.vm.network.reactAt) netScore++;
                    }
                });
                if (netScore >= config.proxmox.vm.network.maxPermits) {
                    sendVMUsageNotify(vmid, `${config.proxmox.vm.network.identifier}`);
                    if (config.proxmox.vm.network.reactWith) proxmox.post(`/nodes/${value.node}/${value.id}/${config.proxmox.vm.network.reactWith}`);
                }
                if (cpuScore >= config.proxmox.vm.cpu.maxPermits) {
                    sendVMUsageNotify(vmid, `${config.proxmox.vm.cpu.identifier}`);
                    if (config.proxmox.vm.cpu.reactWith) proxmox.post(`/nodes/${value.node}/${value.id}/${config.proxmox.vm.cpu.reactWith}`);
                }
                if (memScore >= config.proxmox.vm.mem.maxPermits) {
                    sendVMUsageNotify(vmid, `${config.proxmox.vm.mem.identifier}`);
                    if (config.proxmox.vm.mem.reactWith) proxmox.post(`/nodes/${value.node}/${value.id}/${config.proxmox.vm.mem.reactWith}`);
                }
            });
        }
    });
}), 1000);

function sendVMUsageNotify(vmid, type) {
    if (telegramEnabled)
        config.telegram.chats.forEach(chatId => bot.sendMessage(chatId, `Die VM ${vmid} hat eine hohe '${type}' Auslastung.`))
}
