FROM ubuntu:latest
WORKDIR /backend
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pip wireguard \
    nano htop lsof net-tools netcat curl inetutils-ping iproute2 git openssh-server \
    docker.io

RUN apt-get install -y qrencode

RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose
    
ARG S6_OVERLAY_VERSION=3.1.0.1

RUN service ssh start
RUN echo 'root:admin' | chpasswd
COPY wireguard /etc/init.d/
COPY requirements.txt /backend/
RUN pip3 install --no-cache-dir -r requirements.txt
COPY . /backend/
RUN chmod +x wireguard.sh
EXPOSE 8000
EXPOSE 51820
CMD ["./wireguard.sh"]