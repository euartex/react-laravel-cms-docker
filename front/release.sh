#creating release json file
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git show --format="%h" --no-patch)
AUTHOR=$(git config user.name)
DATE=$(date)
template='{"branch":"%s","commit":"%s","author":"%s","date":"%s"}'
json_string=$(printf "$template" "$BRANCH" "$COMMIT" "$AUTHOR" "$DATE")
echo "$json_string" > ./src/release.json