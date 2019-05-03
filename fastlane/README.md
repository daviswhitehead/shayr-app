fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios release_certificates
```
fastlane ios release_certificates
```
release certificates and provisioning profiles
### ios development_certificates
```
fastlane ios development_certificates
```
development certificates and provisioning profiles
### ios update_bundle_ids
```
fastlane ios update_bundle_ids
```
update bundle ids per environment
### ios update_codepush_builds
```
fastlane ios update_codepush_builds
```
update codepush builds
### ios beta
```
fastlane ios beta
```
ship a beta
### ios release
```
fastlane ios release
```
ship a release

----

## Android
### android update_codepush_builds
```
fastlane android update_codepush_builds
```
update codepush builds
### android beta
```
fastlane android beta
```
ship a beta

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
