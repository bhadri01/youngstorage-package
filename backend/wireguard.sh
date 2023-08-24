#!/bin/sh
wget https://github.com/just-containers/s6-overlay/releases/download/v3.1.0.1/s6-overlay-noarch.tar.xz -O /tmp/s6-overlay-noarch.tar.xz
tar -Jxpf /tmp/s6-overlay-noarch.tar.xz -C /
wget https://github.com/just-containers/s6-overlay/releases/download/v3.1.0.1/s6-overlay-x86_64.tar.xz -O /tmp/s6-overlay-x86_64.tar.xz
nohup tar -Jxpf /tmp/s6-overlay-x86_64.tar.xz -C /
rm -f /tmp/s6-overlay-noarch.tar.xz
rm -f /tmp/s6-overlay-x86_64.tar.xz
mkdir /tmp
chmod 777 /tmp

if [ -f "/etc/wireguard/wg0.conf" ] && [ -f "/etc/wireguard/private.key" ] && [ -f "/etc/wireguard/public.key" ]; then
    sed -i "s|.*WIREGUARD_PUBLIC_KEY.*|WIREGUARD_PUBLIC_KEY=$(cat /etc/wireguard/public.key)|" /backend/.env
    echo "Configuration files already exist. Skipping setup."
else

    wg genkey | sudo tee /etc/wireguard/private.key
    sudo chmod go= /etc/wireguard/private.key
    sudo cat /etc/wireguard/private.key | wg pubkey | sudo tee /etc/wireguard/public.key
    sed -i "s|.*WIREGUARD_PUBLIC_KEY.*|WIREGUARD_PUBLIC_KEY=$(cat /etc/wireguard/public.key)|" /backend/.env

    echo "[Interface]
Address = 172.20.0.1/16
SaveConfig = true
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth+ -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth+ -j MASQUERADE
ListenPort = 51820
PrivateKey = $(cat /etc/wireguard/private.key)" > /etc/wireguard/wg0.conf

fi

wg-quick up wg0
echo "Initial setup done."
python3 run.py
