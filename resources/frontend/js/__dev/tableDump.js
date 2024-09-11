let div = document.querySelector('div');    
const excelDataDumpClean = sessionStorage.getItem('excelData');


const excelDataDump = excelDataDumpClean;

let jsonData = JSON.parse(excelDataDump);
         let container = document.getElementById("container");
         let table = document.createElement("table");
         let cols = Object.keys(jsonData[0]);
         let thead = document.createElement("thead");
         let tr = document.createElement("tr");
         cols.forEach((item) => {
            let th = document.createElement("th");
            th.innerText = item; 
            tr.appendChild(th); 
         });
         thead.appendChild(tr);
         table.append(tr) 
         jsonData.forEach((item) => {
            let tr = document.createElement("tr");
            let vals = Object.values(item);
            vals.forEach((elem) => {
               let td = document.createElement("td");
               td.innerText = elem;
               tr.appendChild(td); 
            });
            table.appendChild(tr); 
         });
         container.appendChild(table) 