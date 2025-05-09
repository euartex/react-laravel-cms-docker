#!/bin/bash

# import configuration variables
source "$(dirname "$0")/config.sh"
php artisan l5-swagger:generate

# -------------------------------------------------
# apply permissions
find "$APP_FOLDER"/ -type d -exec chmod 755 {} ;
find "$APP_FOLDER"/ -type d -exec chmod ug+s {} ;
find "$APP_FOLDER"/ -type f -exec chmod 644 {} ;
chown -R www-data:www-data "$APP_FOLDER"
chmod -R 777 "$APP_FOLDER"/storage
chmod -R 777 "$APP_FOLDER"/bootstrap/cache/

rm -rf "$APP_FOLDER/public/storage"

UPLOADS_FOLDER="/var/www/html/uploads-adm"

# create an uploads folder if does not exist
mkdir -p "$UPLOADS_FOLDER"

# apply apache rights to the uploads folder
chown www-data:www-data "$UPLOADS_FOLDER"

# create new uploads symlink
ln -s "$UPLOADS_FOLDER" "$APP_FOLDER/public/storage"


cd "$APP_FOLDER"

#restart supevisor
supervisorctl restart all

#php artisan db:seed

#Temporarily
#composer require idimsh/php-inotify-monitor

# clear Redis cache
#redis-cli flushall

php artisan storage:link

#Generate keys for laravel passport
php artisan passport:keys --force

#Clear cache
php artisan optimize:clear

# Run migration with reset all data and seeds
#php artisan migrate:fresh --seed

# Run new migrations
php artisan migrate

#Clean telescope tables
php artisan db:seed --class=TelescopeCleaner

#Laravel queues flush
#php artisan queue:flush

#Laravel queues reset
php artisan queue:restart

#Fix permission after commands
chown -R www-data:www-data "$APP_FOLDER"

chmod -R 777 "storage"

sh "$APP_FOLDER/deploy_hooks/add_virtual_host.sh" "$APP_DOMAIN" "$APP_FOLDER/public"
