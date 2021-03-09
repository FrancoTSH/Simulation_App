import Chart from 'chart.js';
import DataFrame from 'dataframe-js';
import InventoryModel from './lib/models';

function toMoney(n:any){
    return (n).toLocaleString("es-PE", {style: "currency", currency: "PEN", minimumFractionDigits: 2})
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function exportToCSV(data:any) {
    const df = new DataFrame(data, ['Dia','Entrega del proveedor','Inventario inicial','Demanda','Inventario final', 'Plazo de entrega','Costo de ordenar','Costo de llevar inventario','Costo por faltante','Costo total','Costo promedio']);
    return df.toCSV(true);
}

function downloadCSV(data:any) {
    let a = document.createElement('a'),
    blob = new Blob([exportToCSV(data)], {type: 'text/csv'}),
    url = URL.createObjectURL(blob);
    a.setAttribute('href', url);
    a.setAttribute('download', 'Inventarios.csv');
    a.click();
}

//MAIN

const form = document.getElementById('input-form'),
      btnAdd = document.getElementById('btn-add');
let policies:number[][] = [],
    nRep:number = 0,
    res:any[][] = [],
    ic:any[][] = [];

function addFields(){
    const number = (<HTMLInputElement>document.getElementById("cant_pol")).value;
    const container = document.getElementById("cont");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for (let i=0;i<Number(number);i++){
        container.appendChild(document.createTextNode("Politica "+(i+1) + ":"));
        container.innerHTML += `<div class="row my-3">
        <div class="col-md-6 p-0">
            s: <input type="number" class="s ${i+1}">
        </div>
        <div class="col-md-6 p-0">
            S: <input type="number" class="S ${i+1}">
        </div>
    </div>`
    }
    document.getElementById('btn-sim').removeAttribute('disabled');
}

function renderTable(pos:HTMLElement,data:any[][],t:number) {
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.className = "table table-sm text-center";
    let row = thead.insertRow();
    row.innerHTML = `<th style="padding:.25rem .95rem;">Política</th>`;
    data.forEach((el,i)=>{   
        const tr = document.createElement('tr');
        el.forEach((l,j)=>{
            if(i==0 && j>0) row.innerHTML += (t==1) ? `<th style="padding:.25rem .95rem;">Réplica ${j}</th>` : `<th style="padding:.25rem .95rem;">Intervalo de confianza</th>`;
            tr.innerHTML += (j==0) ? `<th style='padding:.25rem .75rem;'>${toMoney(l)}</th>` : `<td style='padding:.25rem .75rem;'>${toMoney(l)}</td>`;
            tbody.appendChild(tr);
        })
        table.appendChild(thead);
        table.appendChild(tbody);
        pos.appendChild(table);
    })
}

function renderChart() {
    const chartBox = document.getElementById('chart');
    let dataset:any = [];
    res.forEach(el=>{
        let first = el.shift();
        dataset.push({
            label: first,
            data: el,
            borderColor: getRandomColor(),
            fill: false
        })
    });
    
    let chart = new Chart(chartBox, {
        type:'line',
        data:{
            labels:Array.from({length:nRep},(_,i)=>`Replica ${i+1}`),
            datasets:dataset,
        },
        options:{
            elements:{
                line:{
                    tension:0.00001
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Replicas'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Costo promedio (S/)'
                    }
                }]
            }
        }
    });
}

function addListeners(){
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        let s = [...document.querySelectorAll('.s')].map(el=>(<HTMLFormElement>el).value) as string[];
        let S = [...document.querySelectorAll('.S')].map(el=>(<HTMLFormElement>el).value) as string[];
        let rep = (<HTMLInputElement>document.getElementById('cant_replicas')).value;
        s.forEach((el,i)=> policies.push([Number(el),Number(S[i])]));
        nRep = Number(rep);
        let resultData = {};
        policies.forEach(el=>{
            let d:any = InventoryModel(nRep,el[0],el[1]);
            d.repMean.unshift(`${el[0]}-${el[1]}`); 
            resultData = d.resultsDetails[0];
            res.push(d.repMean);
            ic.push([`${el[0]}-${el[1]}`,`[ ${toMoney(d.confInt[0])}, ${toMoney(d.confInt[1])} ]`]);
        })
        renderTable(document.getElementById('table-container'),res,1);
        renderTable(document.getElementById('table-ic'),ic,2);
        renderChart();
        downloadCSV(resultData);
    })
    btnAdd.addEventListener('click',addFields);
}

document.addEventListener('DOMContentLoaded', () => {
    addListeners();
}); 
