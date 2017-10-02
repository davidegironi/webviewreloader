copy content of android folder in the android folder

edit android/app/build.gradle

for .env config, add before apply from

---
project.ext.envConfigFiles = [
    debug: ".env.debug",
    release: ".env.release",
    anycustombuildlowercase: ".env",
]
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
---

for signing the app after defaultConfig add
---
    signingConfigs {
        release {
            storeFile file("androidkey.keystore")
            storePassword "123456"
            keyAlias "androidkey"
            keyPassword "123456"
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
---