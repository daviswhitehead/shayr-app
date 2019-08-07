package com.daviswhitehead.shayr.android;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

// import java.util.Arrays;
import java.util.List;

// React Native Extras
import com.microsoft.codepush.react.CodePush;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;


// Firebase
// // Core
import io.invertase.firebase.RNFirebasePackage;
// // Analytics
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
// // Authentication
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
// // Performance Monitoring
// import io.invertase.firebase.perf.RNFirebasePerformancePackage;
// // Remote Config
// import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
// // Cloud Storage
// import io.invertase.firebase.storage.RNFirebaseStoragePackage;
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
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      
      packages.add(new CodePush(BuildConfig.ANDROID_CODEPUSH_DEPLOYMENT_KEY, getApplicationContext(), BuildConfig.DEBUG));
      packages.add(new RNFirebaseAnalyticsPackage());
      packages.add(new RNFirebaseAuthPackage());
      packages.add(new RNFirebaseFirestorePackage());
      packages.add(new RNFirebaseCrashlyticsPackage());
      packages.add(new RNFirebaseMessagingPackage());
      packages.add(new RNFirebaseNotificationsPackage());
      packages.add(new RNFirebaseLinksPackage());

      return packages;
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
