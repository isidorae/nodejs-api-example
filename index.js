const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const { readData, writeData } = require("./functions")

app.use(bodyParser.json())

const port = process.env.PORT
const BACKEND_BASEURL = process.env.BACKEND_BASEURL
//******************** Methods */

app.get("/", (req, res) => {
    res.send("Welcome to my API with Node.JS")
})

app.get("/dishes", (req, res) => {
    const data = readData()
    //al entrar a ruta dishes se genera resp en json
    res.json(data.dishes)
})

app.get("/dishes/:id", (req, res) => {
    const data = readData()
    const id = parseInt(req.params.id)
    const dishIndex = data.dishes.findIndex(dish => dish.id === id)
    res.json(data.dishes[dishIndex])
})

app.post("/dishes", (req,res) => {
    //acceder a data parseada
    const data = readData()
    //en req.body viene la data
    const dish = req.body
    //para manipular data debe estar parseada a obj
    //definir id de cada plato nuevo
    const newDish = {
        id: data.dishes.length + 1,
        //plato que ingresamos en el body
        ...dish
    }
    //insertar data
    data.dishes.push(newDish)
    //agregar data al archivo db.json
    writeData(data)
    //respuesta al usuario (frontned)
    res.json(newDish)
})

//****** Ejercicio Bootcamp  CREATE/READ */
app.get("/tvshows", (req, res) => {
    const data = readData()
    res.json(data.series)
})

app.get("/tvshows/:id", (req, res) => {
    const data = readData()
    const id = parseInt(req.params.id)
    const seriesIndex = data.series.findIndex(serie => serie.id === id)
    res.json(data.series[seriesIndex])
})

app.post("/tvshows", (req, res) => {
    const data = readData()
    const show = req.body
    const newShow = {
        id: data.series.length + 1,
        ...show
    }

    data.series.push(newShow)
    writeData(data)
    res.json(newShow)
})

//****** EJ'S UPDATE Y DELETE */
app.put('/dishes/:id', (req, res) => {
    //read data
    const data = readData()
    const body = req.body
    //capturar id y asegurar que sea numerico
    const id = parseInt(req.params.id)
    //acceder a objeto particular con findIndex (index, no id)
    //y chequeamos que id de parametro de URL coincide con id de objetos
    //si es igual = retornar index que coincide.
    const dishIndex = data.dishes.findIndex(dish => dish.id === id)
    console.log(dishIndex)
    //editar objeto al que tenemos acceso; id + lo que hay en body
    data.dishes[dishIndex] = {
        id,
        ...body
    }
    //pasamos data acutalizada a archivo json. 
    writeData(data)
    //enviar resp al usuario
    res.json({message: `"${data.dishes[dishIndex].name}" Dish updated succesfully`})
})

app.delete('/dishes/:id', (req,res) => { 
    //Traer data
    const data = readData()
    //capturar id
    const id = parseInt(req.params.id)
    const dishIndex = data.dishes.findIndex(dish => dish.id === id)

    //delete objeto de array con ese index que coincide con id. 
    //segundo parametro son elem a borrar
    data.dishes.splice(dishIndex, 1)
    //escribir data denuevo
    writeData(data)
    res.json({message: "Dish succesfully deleted"})
})


//****** Ejercicio Bootcamp EDIT/DELETE */
app.put('/tvshows/:id', (req, res) => {
    const data = readData()
    const body = req.body
    const id = parseInt(req.params.id)

    const seriesIndex = data.series.findIndex(serie => serie.id === id)
    console.log(seriesIndex)
    data.series[seriesIndex] = {
        id,
        ...body
    }

    writeData(data)
    res.json({message: "updated sucessfully"})
})

app.delete('/tvshows/:id', (req, res) => {
    const data = readData()
    const id = parseInt(req.params.id)
    const seriesIndex = data.series.findIndex(serie => serie.id === id)

    data.series.splice(seriesIndex, 1)
    writeData(data)
    res.json({message: "series successfully deleted"})
})



//******************** Listener */
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})

