import os


def labelGenerator(imageid: str):
    return ["traefik.enable=true",
            f"traefik.http.routers.{imageid}.rule=Host(`{imageid}.{os.getenv('DOMAIN_NAME_CLOUD')}`)",
            f"traefik.http.routers.{imageid}.service={imageid}",
            f"traefik.http.routers.{imageid}.tls=true",
            f"traefik.http.routers.{imageid}.entrypoints=websecure",
            f"traefik.http.services.{imageid}.loadbalancer.server.port=1111",
            f"traefik.http.routers.{imageid}.tls.certresolver=custom_resolver",
    ]


def domainLableGenerator(username: str, domains: list):
    txt = ""

    for i, data in enumerate(domains):
        if i == 0:
            txt += f"Host(`{data['domainName']}`)"  
        elif i > 0:
            txt += f" || Host(`{data['domainName']}`)"
    
    Traefikname = "".join(username.split("."))
    return [
        f"traefik.http.routers.{Traefikname}.rule={txt}",
        f"traefik.http.routers.{Traefikname}.service={Traefikname}",
        f"traefik.http.services.{Traefikname}.loadbalancer.server.port=80",
        f"traefik.http.routers.{Traefikname}.tls=true",
        f"traefik.http.routers.{Traefikname}.tls.certresolver=custom_resolver",
        f"traefik.http.routers.{Traefikname}.entrypoints=websecure",
    ]
