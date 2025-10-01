# Latihan video 

- resiko tinggi [video](https://drive.google.com/file/d/16-49n72m0grsz3coXijkSXAOOdpNTiI3/view?usp=drivesdk)
- resiko sedang [video](https://drive.google.com/file/d/1c8g6X_Nsf8GPWOUiKFdQ171ZxE2cxtq_/view?usp=drivesdk)
- resiko rendah [video](https://drive.google.com/file/d/1YCYfEdAnwiGhhghlbYfb1u6_hm6TckLT/view?usp=drivesdk)

### Input json data sensor
```
#include <WiFi.h>
#include <HTTPClient.h>
#include <HX711.h>
#include <Wire.h>
#include <MPU6050.h>
#include <ArduinoJson.h>

const char* ssid = "123";
const char* password = "asd";

const char* serverUrl = "http://arthotrack.rf.gd/api/sensor-data";

#define HX711_LEFT_DT 19
#define HX711_RIGHT_DT 25
#define HX711_SCK 18

const int piezoPins[5] = {32, 33, 34, 35, 36};

#define MPU_SDA 22
#define MPU_SCL 21

HX711 scaleLeft;
HX711 scaleRight;

MPU6050 mpu;

float piezoSmoothed[5] = {0, 0, 0, 0, 0};
const float alpha = 0.2;  // smoothing factor

const unsigned long sampleIntervalMs = 20;  // 50 Hz
unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  scaleLeft.begin(HX711_LEFT_DT, HX711_SCK);
  scaleRight.begin(HX711_RIGHT_DT, HX711_SCK);
  scaleLeft.tare();
  scaleRight.tare();

  Wire.begin(MPU_SDA, MPU_SCL);
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed");
  } else {
    Serial.println("MPU6050 connected");
  }

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long now = millis();
  if (now - lastSampleTime >= sampleIntervalMs) {
    lastSampleTime = now;

    if (WiFi.status() == WL_CONNECTED) {
      float leftWeight = scaleLeft.get_units(10);
      float rightWeight = scaleRight.get_units(10);

      for (int i = 0; i < 5; i++) {
        int rawValue = analogRead(piezoPins[i]);
        piezoSmoothed[i] = alpha * rawValue + (1 - alpha) * piezoSmoothed[i];
      }

      int16_t ax, ay, az, gx, gy, gz;
      mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

      StaticJsonDocument<128> leftMpuDoc;
      leftMpuDoc["accel_x"] = ax / 16384.0;  
      leftMpuDoc["accel_y"] = ay / 16384.0;
      leftMpuDoc["accel_z"] = az / 16384.0;
      leftMpuDoc["gyro_x"] = gx / 131.0;   
      leftMpuDoc["gyro_y"] = gy / 131.0;
      leftMpuDoc["gyro_z"] = gz / 131.0;

      StaticJsonDocument<128> rightMpuDoc = leftMpuDoc;

      String leftMpuJson;
      serializeJson(leftMpuDoc, leftMpuJson);

      String rightMpuJson;
      serializeJson(rightMpuDoc, rightMpuJson);

      StaticJsonDocument<512> payload;
      payload["left_weight"] = leftWeight;
      payload["right_weight"] = rightWeight;
      payload["left_mpu"] = leftMpuJson;
      payload["right_mpu"] = rightMpuJson;
      payload["piezo1"] = (int)piezoSmoothed[0];
      payload["piezo2"] = (int)piezoSmoothed[1];
      payload["piezo3"] = (int)piezoSmoothed[2];
      payload["piezo4"] = (int)piezoSmoothed[3];
      payload["piezo5"] = (int)piezoSmoothed[4];

      String jsonPayload;
      serializeJson(payload, jsonPayload);

      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("POST %d\nResponse: %s\n", httpResponseCode, response.c_str());
      } else {
        Serial.printf("POST failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("WiFi disconnected");
    }
  }
}
```
