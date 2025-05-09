#!/bin/bash

#npm run build

service apache2 restart

#!/bin/bash


if mount | grep /opt/p1media/ > /dev/null; then
	sudo umount /opt/p1media/
    sudo sshfs -p 2224 -o reconnect,allow_other,default_permissions,IdentityFile=/home/ubuntu/.ssh/id_rsa ubuntu@storage.p1.media:/p1ml-ftp/  /opt/p1media/
fi

#sudo umount /opt/p1media/
#sudo sshfs -p 2224 -o reconnect,allow_other,default_permissions,IdentityFile=/home/ubuntu/.ssh/id_rsa ubuntu@storage.p1.media:/p1ml-ftp/  /opt/p1media/