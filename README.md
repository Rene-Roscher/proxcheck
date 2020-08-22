# Proxcheck | Proxmox VM-Monitoring

Check your VMs at a desired interval for exceeding their maximum configured workload

If one of the VMs exceeds one of the types, they can either be notified or Proxcheck takes over and performs a desired action.

##### Features
- Telegram Messaging **(A bot is required for this feature)**
- We are already working with the new Proxmox token authorization

##### Checks
- Networking (Outgoing Traffic) **(Incoming traffic would not make sense to monitor)**
- Memory
- CPU

##### Current actions for the VMs:
- STOP
- More actions will be added in the next updates

## Config Example

```javascript 
{
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
```

## Installation

Use the following guide to install [node](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04).

If Node is installed run ```npm i``` and use [forever](https://www.npmjs.com/package/forever) to start the application.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## TODO
What functions are planned for the future:
- Further actions of the VMs *(START,RESTART,NETWORK_LIMITING,NETWORK_DISCONNECT)*
- Disk Checks on the Cluster **(Wearout/Read/Write/IOPS)**
- Pool Checks **(Add individual pools for monitoring )**
 

## License
[MIT](https://choosealicense.com/licenses/mit/)