/*
  Helium console function for LoRaWan Field Tester sending mapping information to mappers backend.

  https://www.disk91.com/2021/technology/lora/low-cost-lorawan-field-tester/

  Result is visible on https://mappers.helium.com/

  Built from information available on:
	https://docs.helium.com/use-the-network/coverage-mapping/mappers-api/
	https://github.com/disk91/WioLoRaWANFieldTester/blob/master/WioLoRaWanFieldTester.ino
	https://www.disk91.com/2015/technology/sigfox/telecom-design-sdk-decode-gps-frame/

  Integration:
	POST https://mappers.helium.com/api/v1/ingest/uplink
*/

function Decoder(bytes, port) {
	var decoded = {};
	// avoid sending Downlink ACK to integration (Cargo)
	if (port === 1) {
		var lonSign = (bytes[0] >> 7) & 0x01 ? -1 : 1;
		var latSign = (bytes[0] >> 6) & 0x01 ? -1 : 1;

		var encLat = ((bytes[0] & 0x3f) << 17) +
			(bytes[1] << 9) +
			(bytes[2] << 1) +
			(bytes[3] >> 7);

		var encLon = ((bytes[3] & 0x7f) << 16) +
			(bytes[4] << 8) +
			bytes[5];

		var hdop = bytes[8] / 10;
		var sats = bytes[9];

		const maxHdop = 2;
		const minSats = 5;

		if ((hdop < maxHdop) && (sats >= minSats)) {
			// Send only acceptable quality of position to mappers
			decoded.latitude = latSign * (encLat * 108 + 53) / 10000000;
			decoded.longitude = lonSign * (encLon * 215 + 107) / 10000000;
			decoded.altitude = ((bytes[6] << 8) + bytes[7]) - 1000;
			decoded.accuracy = (hdop * 5 + 5) / 10
			decoded.hdop = hdop;
			decoded.sats = sats;
		} else {
			decoded.error = "Need more GPS precision (hdop must be <" + maxHdop +
				" & sats must be >= " + minSats + ") current hdop: " + hdop + " & sats:" + sats;
		}
		return decoded;
	}
	return null;
}