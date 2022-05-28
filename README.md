# RUI3-Field-Tester
RUI3 based Location tracker that implements the payload format for the [Low Cost LoRaWan Field Tester](https://www.disk91.com/2021/technology/lora/low-cost-lorawan-field-tester/)

This code is _**Work in progress**_ and far from finished. But it can give a first start how to use RUI3.     
     
The code compiles on RAK4631. For RAK3172 examples see my other RUI3 examples     

----

# Packet data format
The following Frame format are used: uplink format on port 1:
| Byte | Usage |
| --- | --- |
| 0 - 5 | GSP position see here for details. Decoding see below |
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

Example decoders for TTN, Chirpstack and Helium can be found in the folder [decoders](./decoders) ⤴️
