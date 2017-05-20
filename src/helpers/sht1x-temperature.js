/**
 * converts raw data to temperature in SHT1x motes
 * see chapter 4.3 in https://www.sensirion.com/fileadmin/user_upload/customers/sensirion/Dokumente/2_Humidity_Sensors/Sensirion_Humidity_Sensors_SHT1x_Datasheet_V5.pdf
 */
// prettier-ignore
module.exports = value => {
  // d1 and d2 assumes that
  // VDD = 3V and SOt = 12bit
  // if SOt is 14bit then d2 should be 0.04
  const d1 = -39.6
  const d2 = 0.01

  return (value * d2 ) + d1 
}
