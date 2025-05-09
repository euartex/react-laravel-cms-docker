#!/bin/bash

APP_DOMAIN=$1
WEB_ROOT_DIR=$2

EMAIL=${3-"webmaster@localhost"}
VHOST_FILE="/etc/apache2/sites-available/$APP_DOMAIN.conf"

### create virtual host rules file
echo "
    <VirtualHost *:80>
      ServerAdmin $EMAIL
      ServerName $APP_DOMAIN
      DocumentRoot $WEB_ROOT_DIR
      <Directory $WEB_ROOT_DIR/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
      </Directory>
      ErrorLog \${APACHE_LOG_DIR}/$APP_DOMAIN.error.log
      CustomLog \${APACHE_LOG_DIR}/$APP_DOMAIN.access.log combined
    </VirtualHost>" > $VHOST_FILE

# enable new
a2ensite "$APP_DOMAIN"