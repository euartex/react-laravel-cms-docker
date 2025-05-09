## CMS Admin API

This project uses Laravel framework (version 7)

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Requirements

| Prerequisite    | How to check | How to install
| --------------- | ------------ | ------------- |
| PHP >= 7.2.5 | `php -v` | Depends on OS |
| MySQL >= 5.0 | `mysql -v` | Depends on OS |
| Web Server | `-` | Depends on OS |
| Composer >= 1.0 | `composer -v` | [getcomposer.org](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx) |
| Bash >= 4.3  | `bash --version`    | Depends on OS |
| Redis server >= 3.0  | `redis-server --version`    | Depends on OS |
| awscli >= 1.11 | `aws --version`   | [Install](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)|

##Requirements PHP extensions
* BCMath PHP Extension
* Ctype PHP Extension
* Fileinfo PHP extension
* JSON PHP Extension
* Mbstring PHP Extension
* OpenSSL PHP Extension
* PDO PHP Extension
* Tokenizer PHP Extension
* XML PHP Extension

## Installation
1. Install all required dependencies
2. Clone this repo `git clone [git-repo-url] project-folder-name`
3. Go to project folder in command line `cd /project-folder-name`
4. Create a new file `.env` from file `.env.example`
5. Modify `.env` file for your needs (Replace all `NEED_TO_MODIFY` lines)
6. Run `composer install` to install all dependencies
7. Run `php artisan migrate` to create a structure database
8. Run `php artisan db:seed` to seed default data into database (it may take some time up to 10 minutes because images will be loaded in s3)
9. Run `php artisan passport:keys --force` to generate new passport keys
10. Configure a virtual host url to match `APP_URL` from `.env` file and point it to `public` folder
11. Run `php artisan horizon` for working jobs (redis must be enabled)
12. Go to `APP_URL` url from your `.env` file in the Browser
13. Use `POST /api/v1/users/login` for Authorization. Local default credentials are: email (admin@domain.com), password (admin)

## Useful commands
* `php artisan migrate:fresh --seed` - Delete all tables, run migrations, and run seeds again
* `php artisan optimize:clear` - Delete all cache in application

## Deployment
Currently, we use [AWS Code Deploy](https://aws.amazon.com/ru/codedeploy/)

### Presetting
**Important!** This is needed to be done once.
1. Run `aws configure` in your terminal
2. Set AWS Access Key ID, AWS Secret Access Key, Default region name from .env file
3. Default output format - leave it empty
4. Check you configuration, run `aws s3 ls`, if you see a list of s3 buckets - everything is okay

### Deploy 
**Important!** Before deployment, you need to have actual file in the root directory for this environment. For example: `.env.staging`

1. See the file `deploy-from-localhost.sh`
2. Currently, we have two environments `staging` and `production`

* Run `ENV=staging bash deploy-from-localhost.sh` to deploy on Staging
* Run `ENV=production bash deploy-from-localhost.sh` to deploy on Production
