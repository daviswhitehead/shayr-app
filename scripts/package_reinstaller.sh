# https://facebook.github.io/react-native/docs/troubleshooting
# fix any node_modules issues
rm -rf node_modules/ && yarn

# fix any pods issues
cd ./ios
rm -rf Pods/ && pod update
cd ..

# clear out builds
rm -rf ios/build
rm -rf android/build

# link
# react-native link
