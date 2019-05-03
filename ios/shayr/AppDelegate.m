/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <RNFirebaseNotifications.h>
#import "RNFirebaseMessaging.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "ReactNativeConfig.h"
#import "RNFirebaseLinks.h"
#import <React/RCTLinkingManager.h>
#import <CodePush/CodePush.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Facebook SDK
  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];
  
  // Firebase Deeplinking URL Scheme
  NSString *dynamicLinkScheme = [ReactNativeConfig envFor:@"APP_BUNDLE_ID_IOS"];
  [FIROptions defaultOptions].deepLinkURLScheme = dynamicLinkScheme;
  
  // Firebase App Configuration
  [FIRApp configure];
  
  // React Native Firebase Notifications
  [RNFirebaseNotifications configure];
  
  // Fabric
  [Fabric with:@[[Crashlytics class]]];
  
  // JavaScript Code Location
  NSURL *jsCodeLocation;
  NSString *envName = [ReactNativeConfig envFor:@"ENV_NAME"];
  if ([envName isEqualToString:@"prod"] || [envName isEqualToString:@"alpha"])
  {
    jsCodeLocation = [CodePush bundleURL];
    // Uncomment for console output in Xcode console for release mode on device:
    // RCTSetLogThreshold(RCTLogLevelInfo - 1);
  }
  else
  {
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  }

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"shayr"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = nil;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Launch Screen
  UIView* launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
  launchScreenView.frame = self.window.bounds;
  rootView.loadingView = launchScreenView;
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  // Link Handling
  // https://rnfirebase.io/docs/v5.x.x/links/ios
  // https://facebook.github.io/react-native/docs/linking
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ] || [[RNFirebaseLinks instance] application:application openURL:url options:options
        ] || [RCTLinkingManager application:application openURL:url options:options];

  return handled;
}

// https://rnfirebase.io/docs/v5.x.x/notifications/ios
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

// https://rnfirebase.io/docs/v5.x.x/links/ios
// https://facebook.github.io/react-native/docs/linking
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler {
  BOOL handled = [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler: restorationHandler];
  
  return handled;
}

@end
