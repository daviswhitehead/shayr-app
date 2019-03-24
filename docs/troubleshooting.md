# Building a Release

### iOS

- For Share Extension provisioning errors, make sure that the bundle id matches the provisionining profile app id perfectly (case sensitive!)

- Whenever you change anything, make sure to redownload provisioning profiles by running `fastlane match (development|appstore)` https://docs.fastlane.tools/actions/match/
