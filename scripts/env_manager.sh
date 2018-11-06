# $1 expects [dev, staging, prod]
if [ $1 = "dev" ] || [ $1 = "staging" ] || [ $1 = "prod" ] ; then
  echo $1
  cp ./environments/$1/GoogleService-Info.plist ./ios/shayr/GoogleService-Info.plist
  cp ./environments/$1/GoogleService-Info.plist ./ios/ShareExtension/GoogleService-Info.plist
fi
