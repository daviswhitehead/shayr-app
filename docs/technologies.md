# Technologies
### Core
- [React Native](#react-native)  
  - Xcode  
  - Android Studio  
- [Firebase](#firebase)  
  - React-Native-Firebase  
  - Firestore  
  - Cloud Functions  
  - Authentication  
- [Redux](#redux)  
- [Node](#node)
  - Node Version Manager
- [Fastlane](#fastlane)  
- [Fabric](#fabric)  
- [Facebook SDK](#facebook-sdk)

# [React Native](https://facebook.github.io/react-native/)
### Description
The frontend UI and UX of shayr are built using React Native. The main benefit is more or less one codebase for two platforms iOS and Android, and potentially Web in the future.

### Installation
Follow Building Projects with Native Code section on the [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) page.

You need to setup your development environment for both iOS and Android.

### Learning
##### Tutorials
Facebook has their [Learn the Basics](https://facebook.github.io/react-native/docs/tutorial) tutorial aimed at complete beginners. After that, I'd recommend [React Native Express](http://www.reactnativeexpress.com/). If you can do the Todo List exercise, you're ready to start contributing to shayr.
##### Resources
I've found it really helpful to start by searching google for what you want to do or implement. Learning about existing solutions at a high level. Then searching for those solutions on github for real world examples.
Also, [Awesome React Native](http://www.awesome-react-native.com/).

# [Firebase](https://firebase.google.com/?authuser=0)
### Description
Firebase is a suite of products and services for building apps. We use Firebase as our backend, data store, and more.
- Firestore is our database. It's [NoSQL](https://firebase.google.com/docs/firestore/data-model?authuser=0) which is kinda tricky.
- Cloud Functions are used to trigger actions after app events, such as a write to the database. For example, we use Cloud Functions to trigger scraping content metadata after a user posts a new shayr.
- Authentication is also done by Firebase (and Facebook).

### Installation
We've added Firebase to shayr through the [React Native Firebase](https://rnfirebase.io/) third party library. Linking Firebase to the app in this way allows our javascript layer to access the native Firebase SDKs for iOS and Android which affords us extra functionality over the Web SDK.

To access our Firebase console, you'll need to request permissions from me.

### Learning
##### Tutorials
If you prefer learning through tutorials, Firebase has a number of [samples](https://firebase.google.com/docs/samples/?authuser=0) where you can familiarize yourself with their different products.

##### Resources
The [Firebase documentation](https://firebase.google.com/docs/guides/?authuser=0) for each product is generally pretty solid. You can find more technical details on their [API Reference](https://firebase.google.com/docs/reference/?authuser=0) page. Finally, you'll also want to reference [React Native Firebase](https://rnfirebase.io/docs/v4.3.x/getting-started) for the correct React Native syntax (usually the same as what's on the Firebase documentation).

# [Redux](https://redux.js.org/)
### Description
Redux is used to manage state -- all the data the app needs to present content and variables required to implement a UI.

### Installation
No additional installation is needed, but I used [the following resources](https://github.com/daviswhitehead/shayr/issues/48) in addition to heavy heavy googling to figure out how to add Redux to shayr.

If you're curious, checkout the [pull request](https://github.com/daviswhitehead/shayr/pull/96) where I integrated Redux.

### Learning
##### Tutorials
The [React Native Express - Redux](http://www.reactnativeexpress.com/redux) was pretty helpful, as well as the [Todo List](http://www.reactnativeexpress.com/todo_list) exercise.

##### Resources
I found the [Redux documentation](https://redux.js.org/basics) pretty helpful in addition to a lot of googling.

# [Node](https://nodejs.org/en/)
### Description
Node is a JavaScript runtime required by React Native to bundle and run the app. Node is also the environment in which our Cloud Functions are built and run.  

IMPORTANT: the app and Cloud Functions require different versions of Node. To manage the installation and automatic switching between the two versions, we use Node Version Manager.

Additional open-source JavaScript packages for both the app and Cloud Functions can be found on [npm](https://www.npmjs.com/). Be sure to check the version of Node required for the package and make sure that's compatible with the app and Cloud Functions versions.

### Installation
Follow the [Node Version Manager](https://github.com/creationix/nvm) installation steps.

# [Fastlane](https://fastlane.tools/)
### Description
Fastlane automates app store and beta deployment.

### Installation
This is not really required to contribute, only if you're going to be pushing builds to beta testers or the app store.  

You'll need to reach out to me to get fully setup.

# [Fabric](https://fabric.io/home)
### Description
Fabric manages our beta testers and adds crash reporting.

# [Facebook SDK](https://developers.facebook.com/docs/)
### Description
Authentication is set up through Facebook Login.

### Troubleshooting
If you run into issues with a missing FBSDK file, add the FacebookSDK folder to `~/Documents/`
