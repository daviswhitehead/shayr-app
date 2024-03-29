# Description

Shayr is an app for sharing, discovering, and discussing content with your communities.

# Use Cases

- Just listened to this awesome Startup podcast episode and I want to share it with my friends. I especially want Davis to listen to it and want to know what he thinks of it.
- I'm about to go on vacation and am going to download a book before my flight but need a recommendation.
- I'm always getting good recommendations from my friends for stuff to watch and read, I want an easy place to keep track of them and find new ones to add.
- There are some amazing This American Life episodes but a lot of mediocre ones I don't want to sit through. I want a good way of finding out which are the good ones.

# Tech

- [React Native](https://facebook.github.io/react-native/)
  - [React Native Share Extension](https://github.com/alinz/react-native-share-extension)
- Firebase

# Getting Started

- Clone the repo
- Follow [Facebook's instructions](https://facebook.github.io/react-native/docs/getting-started.html) for installing React Native and its dependencies. Shayr is for iOS and Android so you'll want to setup both options under 'Building Projects with Native Code'.
- Once you're all setup, run `react-native run-ios` or `react-native run-android` in the root directory

# Git Flow

## Branch Strategy

### master

The **master** branch should always be able to build and run a production version of the app. **develop** should only be merged into master after thorough production testing.

### develop

The **develop** branch is where multiple features can be merged into a single branch in preparation for a new release. The purpose of the **develop** branch is to test how all the new functionality works together and other quality assurance testing.

### feature/feature-name

For each new feature we build, we should open a new feature branch from the **develop** branch. The naming should follow the convention **feature/feature-name**.
