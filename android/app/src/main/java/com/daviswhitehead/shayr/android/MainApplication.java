package com.daviswhitehead.shayr.android;

import android.app.Application;

import java.util.Arrays;
import java.util.List;

// React Native
import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// Firebase
// // Core
import io.invertase.firebase.RNFirebasePackage;
// // Authentication
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
// // Analytics
// import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
// // Performance Monitoring
// import io.invertase.firebase.perf.RNFirebasePerformancePackage;
// // Remote Config
// import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
// // Cloud Storage
// import io.invertase.firebase.storage.RNFirebaseStoragePackage;
// // Invites
import io.invertase.firebase.invites.RNFirebaseInvitesPackage;
// // Dynamic Links
import io.invertase.firebase.links.RNFirebaseLinksPackage;
// // Cloud Firestore
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
// // Cloud Messaging / FCM
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
// // Crashlytics
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

// FBSDK
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

// Crashlytics
import io.fabric.sdk.android.Fabric;
import com.crashlytics.android.Crashlytics;

// React Native Config
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;

// Vector Icons
import com.oblador.vectoricons.VectorIconsPackage;

// Share Extension
import com.alinz.parkerdan.shareextension.SharePackage;
import com.github.alinz.rnsk.RNSKPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new RNGestureHandlerPackage(), new SplashScreenReactPackage(),
          new ReactNativeConfigPackage(), new VectorIconsPackage(), new RNSKPackage(), new SharePackage(),
          new RNFirebasePackage(), new RNFirebaseAuthPackage(), new RNFirebaseFirestorePackage(),
          new RNFirebaseCrashlyticsPackage(), new RNFirebaseMessagingPackage(), new RNFirebaseNotificationsPackage(),
          new RNFirebaseLinksPackage(), new RNFirebaseInvitesPackage(), new FBSDKPackage(mCallbackManager));
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
