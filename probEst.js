
var ultimosParametros = {
    "k": 4,
    "h": 100,
    'li1': 450
};

var tabelaFrequencia = [];

function getultimosParametros() {
    try {
        for(let par in ultimosParametros){
            let val = parseInt(document.getElementById(par).value);
            if (val != Number.NaN && Number.isFinite(val))
                ultimosParametros[par] = val;
            else
                throw `[${par}] = ${val}`;
        }
    } catch (e){
        console.log(e);
        document.getElementById("k").value = 4;
        document.getElementById("h").value = 100;
        document.getElementById("li1").value = 450;
        ultimosParametros = {
            "k": 4,
            "h": 100,
            "li1": 450
        };
    }
}

function criarTabelaFrequencia() {
    getultimosParametros();
    try {
        tabelaFrequencia = [];
        for(let i = 0; i < ultimosParametros.k; i++) {
            let limInf = (ultimosParametros["li1"] + (i * ultimosParametros["h"]));
            let limSup = limInf + ultimosParametros["h"];
            let xi = (limSup + limInf) / 2;

            tabelaFrequencia.push({
                "limInf": limInf,
                "limSup": limSup,
                "xi": xi
            });
        }
    } catch(e){
        tabelaFrequencia = [];
        console.log(e);
    }
    displayTabelaFrequencia();
}

function displayTabelaFrequencia() {
    let elementTableFreq = document.getElementById("tabelaFrequencia");
    
    while (elementTableFreq.firstChild) {
        elementTableFreq.removeChild(elementTableFreq.firstChild);
    }

    for(let indexFrequencia in tabelaFrequencia){
        let freq = tabelaFrequencia[indexFrequencia];
        let tableRow = document.createElement("tr");

        let custo = document.createElement("td");
        custo.innerText = `${freq["limInf"]} |-- ${freq["limSup"]}`;
        tableRow.append(custo);

        let fiTD = document.createElement("td");
        let fi = document.createElement("input");
        fi.type = "number";
        fi.min = 0;
        fi.max = 2000000;
        fi.value = 0;
        fi.id = `fi${(indexFrequencia + 1)}`;
        fiTD.append(fi);
        tableRow.append(fiTD);

        let xi = document.createElement("td");
        xi.innerText = `${freq["xi"]}`;
        tableRow.append(xi);

        elementTableFreq.append(tableRow);
    }
}
var resultados = {};
function resetResultados() {
    resultados = {
        "rMedia": 0,
        "rMediana": 0,
        "rClasseModal": 0,
        "rModaBruta": 0,
        "rModaCzuber": 0
    };
}


function calcularResultados() {

    let somaFi = 0;
    let somaXiFi = 0;
    for(let indexFrequencia in tabelaFrequencia) {
        let freq = tabelaFrequencia[indexFrequencia];
        let inputFi = document.getElementById(`fi${indexFrequencia + 1}`);
        let valueFi = parseInt(inputFi.value);
        if (valueFi != Number.NaN && Number.isFinite(valueFi)){
            somaFi += valueFi;
            freq['fi'] = valueFi;
            freq['fiAcum'] = somaFi;
            somaXiFi += (valueFi * freq["xi"]);
        } else
            console.log([valueFi, freq['xi']]);
    }
    if (!Number.isNaN(somaFi) && Number.isFinite(somaFi) && somaFi != 0)
        resultados['rMedia'] = (somaXiFi / somaFi);
    
    let valClasseMediana = somaFi / 2;
    try {
        let classeMediana = tabelaFrequencia.filter( (x) => x.fiAcum > valClasseMediana )[0];
        let mediana = (classeMediana['limInf'] +
            ( valClasseMediana - (classeMediana["fiAcum"] - classeMediana["fi"]) 
            ) * ultimosParametros.h / classeMediana["fi"]);
        if (!Number.isNaN(mediana) && Number.isFinite(mediana) && mediana != 0)
            resultados['rMediana'] = mediana;
    } catch(e) { console.log(e); }

    try {
        let classeModal = tabelaFrequencia.slice(0).sort((a, b) => a.fi < b.fi ? -1 : a.fi > b.fi ? 1 : 0).reverse()[0];
        
        resultados['rClasseModal'] = `${classeModal["limInf"]} |-- ${classeModal["limSup"]}`;
        resultados['rModaBruta'] = `${classeModal['xi']}`;
        
        let indexClasseModal = tabelaFrequencia.indexOf(classeModal);
        let fiAnterior = 0;
        let fiPosterior = 0;
        if (indexClasseModal > 0){
            let classeModalAnt = tabelaFrequencia[indexClasseModal - 1];
            fiAnterior = classeModalAnt.fi;
        }
        if (indexClasseModal < (tabelaFrequencia.length - 1)){
            let classeModalPost = tabelaFrequencia[indexClasseModal + 1];
            fiPosterior = classeModalPost.fi;
        }

        let d1 = (classeModal.fi - fiAnterior);
        let d2 = (classeModal.fi - fiPosterior);
        resultados['rModaCzuber'] = (classeModal["limInf"] + (( (classeModal.fi - fiAnterior) / ( d1 + d2 ) ) * ultimosParametros.h));

    } catch (e) { console.log(e); }
}

function mostrarResultados() {
    resetResultados();

    calcularResultados();

    for(let resultadoKey in resultados){
        let valor = resultados[resultadoKey];
        document.getElementById(resultadoKey).innerText = valor;
    }
}
