# $1 expects [dev, staging, prod]
if [ $1 = "dev" ] || [ $1 = "alpha" ] || [ $1 = "staging" ] || [ $1 = "prod" ] ; then
  echo $1
  cp ./environments/$1/GoogleService-Info-shayr.plist ./ios/shayr/GoogleService-Info.plist
  cp ./environments/$1/GoogleService-Info-ShareExtension.plist ./ios/ShareExtension/GoogleService-Info.plist
  cp ./environments/$1/google-services.json ./android/app/google-services.json
fi
