//
//  ShareExtension.m
//  ShareExtension
//
//  Created by Alex Trahey on 1/28/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <Firebase.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

@interface ShareExtension : ReactNativeShareExtension
@end

@implementation ShareExtension

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  NSURL *jsCodeLocation;
  
  [FIRApp configure];
  [Fabric with:@[[Crashlytics class]]];
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ShareExtension"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;
  
  // Uncomment for console output in Xcode console for release mode on device:
  RCTSetLogThreshold(RCTLogLevelInfo - 1);
  
  return rootView;
}

@end
