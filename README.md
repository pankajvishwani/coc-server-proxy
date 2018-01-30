# coc-server-proxy
To use Clash of Clans API, developers need to have a server with static IP Address. This package helps developers to quickly setup a VM(proxy server) on Google Compute Engine with static external IP Address and run a nodejs server that will then make calls to Clash of Clans API server. Developers can make calls this VM for localhost/production.

# Google Compute Engine Setup
Go to: https://console.cloud.google.com/compute/instances and create a new instance.
Go to: https://console.cloud.google.com/networking/addresses/list
Change type from "Ephemeral" to "Static"
Copy "External Address" of your VM and create a new key using this IP Address within your Clash of Clans account: https://developer.clashofclans.com/#/account

SSH in your instance and run the following commands:
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install git nodejs
git clone https://github.com/pankajvishwani/coc-server-proxy.git
cd coc-server-proxy; npm install
```
Now open config.js file and update "coc_token" value with your token value for this VM. You should also update "compute_access_token" to some secret value that only you know, so that other developers don't try to get access to your proxy server.

# Running your proxy server
Type the following, to start your server:
```
cd coc-server-proxy
npm start
```

# Sending request to your proxy server

http://your-vm-ip/?token=my-compute-private-token&url=/clans/{clanTag}
