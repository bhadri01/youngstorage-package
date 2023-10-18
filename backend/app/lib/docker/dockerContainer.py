import os
import yaml


def GetComposeFile(username, dockerip, trafikLabels):
    try:
        # Define the named volume
        volumes_definition = {
            'volumes': {
                f'{username}':None
            }
        }

        # Define the networks section with the 'services' network
        networks_definition = {
            'networks': {
                'services': {
                    'name': 'services',
                    'external' : True
                }
            }
        }

        # Define the service using a dictionary
        service_definition = {
            'version': '3.8',
            'services': {
                username: {
                    'image': username,
                    'container_name': username,
                    'networks': {
                        'services': {
                            'ipv4_address': dockerip
                        }
                    },
                    'hostname': 'youngstorage',
                    'cpus': '1',
                    'mem_limit': '2g',
                    'restart': 'always',
                    'cap_add': ['NET_ADMIN'],
                    'volumes': [f'{username}:/home/{username}'],
                    'labels': trafikLabels
                }
            }
        }

        source = os.path.join(os.getcwd(), "source")

        # Write the network definition to a YAML file
        with open(os.path.join(source, 'docker-compose.yml'), 'w') as file:
            yaml.dump(service_definition, file)
            yaml.dump(volumes_definition, file)
            yaml.dump(networks_definition, file,default_flow_style=False)

        return True
    except:
        return False
