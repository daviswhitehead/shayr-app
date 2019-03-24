# $1 expects [dev, alpha, staging, prod]
if [ $1 = "dev" ] || [ $1 = "alpha" ] || [ $1 = "staging" ] || [ $1 = "prod" ] ; then
  echo $1
  ### Firebase Credentials
  # ios
  cp ./environments/$1/GoogleService-Info-shayr.plist ./ios/shayr/GoogleService-Info.plist
  cp ./environments/$1/GoogleService-Info-shareextension.plist ./ios/ShareExtension/GoogleService-Info.plist
  
  # android
  cp ./environments/$1/google-services.json ./android/app/google-services.json
  
  ### App Assets
  # ios
  cp -r ./environments/$1/assets/iOS/AppIcon.appiconset/ ./ios/shayr/Images.xcassets/AppIcon.appiconset/
  
  # android
  cp -r ./environments/$1/assets/android/mipmap-hdpi/ ./android/app/src/main/res/mipmap-hdpi/
  cp -r ./environments/$1/assets/android/mipmap-mdpi/ ./android/app/src/main/res/mipmap-mdpi/
  cp -r ./environments/$1/assets/android/mipmap-xhdpi/ ./android/app/src/main/res/mipmap-xhdpi/
  cp -r ./environments/$1/assets/android/mipmap-xxhdpi/ ./android/app/src/main/res/mipmap-xxhdpi/
  cp -r ./environments/$1/assets/android/mipmap-xxhdpi/ ./android/app/src/main/res/mipmap-xxhdpi/
  cp -r ./environments/$1/assets/android/mipmap-xxxhdpi/ ./android/app/src/main/res/mipmap-xxxhdpi/

  ### Fastlane Env File
  cp ./environments/$1/.env.$1 ./fastlane/.env.default
fi
