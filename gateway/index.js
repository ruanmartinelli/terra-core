const spawn = require('child_process').spawn

let i = 9000

while (i < 9010){
	console.log('  starting network in port ' + i)

	const child = spawn('./terra-sim-ruan.py', [i])

	child.stdout.on('data', console.log)
	child.on('exit', (code) => {
		console.log('exit with code ' + code)
		proccess.exit(code)
	})
	
	i++
}
