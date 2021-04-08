require('dotenv').config()

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer')
const Busquedas = require('./models/busquedas')

require('colors')

const main = async () => {
  let opt
  let termino; let id = ''
  let lugares = []
  let lugarSeleccionado = {}
  const clima = {}

  do {
    const busquedas = new Busquedas()
    opt = await inquirerMenu()

    switch (opt) {
      case 1:

        termino = await leerInput('Ciudad: ')
        lugares = await busquedas.ciudad(termino)

        id = await listarLugares(lugares)

        if (id === '0') continue

        lugarSeleccionado = lugares.find(l => l.id === id)

        busquedas.agregarHistorial(lugarSeleccionado.nombre)

        const { desc, min, max, temp } = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)

        console.clear()
        console.log('\nInformación de la ciudad\n'.green)
        console.log('Ciudad:'.green, lugarSeleccionado.nombre)
        console.log('Latitud:'.green, lugarSeleccionado.lat)
        console.log('Longitud:'.green, lugarSeleccionado.lng)
        console.log('Temperatura:'.green, temp)
        console.log('Mínima:'.green, min)
        console.log('Máxima:'.green, max)
        console.log('Descripción:'.green, desc)

        break
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green
          console.log(`${idx} ${lugar}`)
        })
        break
    }

    if (opt !== 0) await pausa()
  } while (opt !== 0)
}

main()
