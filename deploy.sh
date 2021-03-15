FOLDER_PATH="dist"
BUCKET="vtaugment"
BUCKET_FOLDER="dev"
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Get arguments
while getopts "nv:p" opt; do
  case $opt in
    v)
      BUCKET_FOLDER=$OPTARG
      ;;
    p)
      BUCKET_FOLDER=$PACKAGE_VERSION
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Upload to the bucket with no cache
gsutil -m -h "Cache-Control:no-cache" cp -r ./$FOLDER_PATH/* gs://$BUCKET/$BUCKET_FOLDER/
