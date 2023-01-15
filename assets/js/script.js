/*SELECCIONAR DIVISAS DE DIFERENTES TIPOS*/
const arrayDivisas = ["uf", "ivp", "dolar", "dolar_intercambio", "euro", "ipc", "utm", "imacec", "tpm", "libra_cobre", "tasa_desempleo", "bitcoin"]

const SelectDivisas = document.getElementById("selectDivisa")
const TextResultado = document.getElementById("resultado")
const buttonconvert = document.getElementById("convertirDivisa")
const InputConvertir = document.getElementById("montoAConvertir")
const chartContainer = document.getElementById("chartContainer")


/*GRAFICOS*/
function createChart(dataObjt){
    chartContainer.innerHTML = '<canvas id="chart"></canvas>'
    canvas =  document.getElementById("chart")

    const data = {
        type: "line",
        data: {
            labels: dataObjt.dates,
            datasets:[
                {
                    label: 'ultimos 10 dias',
                    data: dataObjt.data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension:0
                }
            ]
        }
    }
    new Chart(canvas,data)
}

/*TRANSFORMACION DE DIVISA*/

async function convertMoney(){
    try{
        divisa = SelectDivisas.value
        result = await fetch (`https://www.mindicador.cl/api/${divisa}`)
        resultJson = await result.json()
        console.log(resultJson)
        divisaCLP = resultJson.serie[0].valor
        convertCLP = +InputConvertir.value

        console.log(divisaCLP,convertCLP)
        
        TextResultado.innerText = (convertCLP/divisaCLP).toFixed(2)

        const lastDays ={}

        lastDays.data = resultJson.serie.slice(0,10).map(val => val.valor).reverse()
        lastDays.dates = resultJson.serie.slice(0,10).map(val => dayjs(val.fecha).format('YYYY-MM-DD')).reverse()
        createChart(lastDays)
        console.log(lastDays)
                    
    }catch(error){

    }
}

selectHTML = SelectDivisas.innerHTML

arrayDivisas.forEach(val => selectHTML += `
<option value=${val}>${val}</option>
`)

SelectDivisas.innerHTML = selectHTML

buttonconvert.addEventListener('click',convertMoney)