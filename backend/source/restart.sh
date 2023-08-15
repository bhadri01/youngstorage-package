#!/bin/bash
wg syncconf wg0 <(wg-quick strip wg0)
echo "VPN activated"
