# RUI3-Field-Tester
RUI3 based Location tracker that implements the payload format for the [Low Cost LoRaWan Field Tester](https://www.disk91.com/2021/technology/lora/low-cost-lorawan-field-tester/)

For simplification it uses the WisBlock RAK1021 OLED to display the data returned from the backend server.

Setup of LoRaWAN credentials, regional and send frequency data is done over RUI3 AT commands and custom AT commands `AT?` shows a list of all available commands. AT command manual is in the [RAKwireless Documentation Center](https://docs.rakwireless.com/RUI3/Serial-Operating-Modes/AT-Command-Manual/#overview).     

This code is _**Proof of Concept**_ only. 

# Get the ready to use RAKwireless RAK10701 Field Tester from the [RAKwireless Store](https://store.rakwireless.com/apps/omega-search/?q=RAK10701)
----

Information to disk91 Low Cost LoRaWan Field Tester    
- [Low Cost LoRaWan Field Tester](https://www.disk91.com/2021/technology/lora/low-cost-lorawan-field-tester/)    
- [Original sources on Github](https://github.com/disk91/WioLoRaWANFieldTester)

----

# Packet data format
The following Frame format are used: uplink format on port 1:
| Byte | Usage |
| --- | --- |
| 0 - 5 | GSP position see [here](https://www.disk91.com/2015/technology/sigfox/telecom-design-sdk-decode-gps-frame/) for details. Decoding see below |
| 6 - 7 | Altitude in meters + 1000m ( 1100 = 100m ) |
| 8 | HDOP * 10 (11 = 1.1) |
| 9 | Sats in view |

When the GPS position is invalid of GPS is disable, the frame is full of 0

downlink response format on port 2:
| Byte | Usage |
| --- | --- |
| 0 | Sequence ID % 255 |
| 1 | Min Rssi + 200 (160 = -40dBm) |
| 2 | Max Rssi + 200 (160 = -40dBm) |
| 3 | Min Distance step 250m |
| 4 | Max Distance step 250m |
| 5 | Seen hotspot |

The distance is calculated from the GPS position and the hotspot position returned by console meta-data. Under 250m value is 250m, over 32km value is 32km. 0 is considered as invalid response

Example decoders for TTN, Chirpstack and Helium can be found in the folder RAKwireless Standardized Payload ==> [RAK10701-FieldTester.js](https://github.com/RAKWireless/RAKwireless_Standardized_Payload) ⤴️
