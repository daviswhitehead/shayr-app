package com.daviswhitehead.shayr.android;

import com.facebook.react.ReactActivity;
import android.content.Intent;

// react navigation -- https://reactnavigation.org/docs/en/getting-started.html
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import android.os.Bundle;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactActivity {
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);

        Fabric.with(this, new Crashlytics());

        // throw new RuntimeException("test");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "shayr";
    }
    
    // react navigation -- https://reactnavigation.org/docs/en/getting-started.html
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
