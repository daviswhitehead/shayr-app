#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <Firebase.h>
#import "ReactNativeConfig.h"
#import <CodePush/CodePush.h>
#import <BugsnagReactNative/BugsnagReactNative.h>

@interface ShareExtension : ReactNativeShareExtension
@end

@implementation ShareExtension

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  
  if(![FIRApp defaultApp]){
   [FIRApp configure];
 }

  
  // Bugsnag https://docs.bugsnag.com/platforms/react-native/react-native/enhanced-native-integration/
  [BugsnagReactNative start];
  
  // JavaScript Code Location
  NSURL *jsCodeLocation;
  NSString *envName = [ReactNativeConfig envFor:@"ENV_NAME"];
  if ([envName isEqualToString:@"prod"] || [envName isEqualToString:@"alpha"])
  {
    jsCodeLocation = [CodePush bundleURL];
    // Uncomment for console output in Xcode console for release mode on device:
    RCTSetLogThreshold(RCTLogLevelInfo - 1);
  }
  else
  {
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  }
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ShareExtension"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;
  
  return rootView;
}

@end
