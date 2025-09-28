# Latihan video 

- resiko tinggi [video](https://drive.google.com/file/d/16-49n72m0grsz3coXijkSXAOOdpNTiI3/view?usp=drivesdk)
- resiko sedang [video](https://drive.google.com/file/d/1c8g6X_Nsf8GPWOUiKFdQ171ZxE2cxtq_/view?usp=drivesdk)
- resiko rendah [video](https://drive.google.com/file/d/1YCYfEdAnwiGhhghlbYfb1u6_hm6TckLT/view?usp=drivesdk)

### Input json data sensor
```
  {
    "patient_id": "123",
    "timestamp": "2023-10-01T12:00:00Z",
    "rom_knee_left": 52,      // ° (for asymmetry calc)
    "rom_knee_right": 48,     // °
    "gait_duration": 3.5,     // seconds for 4m
    "stance_time_left": 0.65, // seconds
    "stance_time_right": 0.72,// seconds (average for overall)
    "weight_left": 35,        // kg (average over 3s)
    "weight_right": 32        // kg
  }
```
