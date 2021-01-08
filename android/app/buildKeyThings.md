
signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        ---
    }

release {
  storeFile file('cauzzi_music_key.keystore')
  storePassword System.console().readLine("\nKeystore password:")
  keyAlias System.console().readLine("\nAlias: ")
  keyPassword System.console().readLine("\nAlias password: ")
}


buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            -----
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }



signingConfig signingConfigs.release

