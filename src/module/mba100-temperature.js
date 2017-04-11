module.exports = (value) => {

    const a = 0.001010024
    const b = 0.000242127
    const c = 0.000000146
    const R1 = 10
    const ADC_FS = 1023
    const Rthr = R1 * (ADC_FS - value) / value

    const Rthr_ln = Math.log(Rthr)

    let T = 1 / (a + (b * Rthr_ln) + (c * Rthr_ln * Rthr_ln * Rthr_ln))

    T = T - 273.15

    return T
}