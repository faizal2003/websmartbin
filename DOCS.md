# Smart Trash Bin System Setup

## 1. Firebase Firestore Setup
Create a document in Firestore with the following path:
- Collection: `bins`
- Document ID: `main_bin`
- Fields:
  - `organic`: (number)
  - `inorganic`: (number)

### Firestore Security Rules
For development, you can use these rules to allow the ESP32 and Web Dashboard to read/write:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bins/main_bin {
      allow read, write: if true;
    }
  }
}
```
*Note: In production, you should restrict access to authorized users/devices.*

## 2. Web Application Setup
1.  Open `src/firebase.ts`.
2.  Replace the `firebaseConfig` object with your actual Firebase project credentials from the Firebase Console (Project Settings > General > Your apps).
3.  Run the application:
    ```bash
    npm install
    npm run dev
    ```

## 3. ESP32 Implementation (Arduino C++)
You will need the `Firebase ESP Client` library by Mobizt.

```cpp
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// 1. Define WiFi credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// 2. Define Firebase API Key and Project ID
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define FIREBASE_PROJECT_ID "YOUR_PROJECT_ID"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  config.api_key = API_KEY;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void updateBinCount(int organic, int inorganic) {
  FirebaseJson content;
  content.set("fields/organic/integerValue", String(organic));
  content.set("fields/inorganic/integerValue", String(inorganic));
  
  String documentPath = "bins/main_bin";
  
  if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw(), "organic,inorganic")) {
    Serial.println("Firestore updated successfully");
  } else {
    Serial.println(fbdo.errorReason());
  }
}

void loop() {
  // Add your sensor logic here
  // Example: updateBinCount(10, 5);
  delay(10000); 
}
```
