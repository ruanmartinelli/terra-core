/**
 * converts raw data to temperature in SHT1x motes
 * see chapter 4.3 in https://www.sensirion.com/fileadmin/user_upload/customers/sensirion/Dokumente/2_Humidity_Sensors/Sensirion_Humidity_Sensors_SHT1x_Datasheet_V5.pdf
 * 
 */
// prettier-ignore
module.exports = value => {
  const d1 = -39.6
  const d2 = 0.04

  return (value * d2 ) + d1 
}
