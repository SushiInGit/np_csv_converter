let div = document.querySelector('div');

for (let i = 0; i < sessionStorage.length; i++) {
   const key = sessionStorage.key(i);
   const value = sessionStorage.getItem(key);
   const excelDataDump = sessionStorage.getItem('key');
   try {
      let jsonData = JSON.parse(value);
      logger.table(jsonData);                                        /// Console OUTPUT
      let container = document.getElementById("container");
      let table = document.createElement("table");
      let cols = Object.keys(jsonData[0]);
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");

      thead.appendChild(tr);
      table.append(tr)
      count = 0;
      jsonData.forEach((item) => {
         if(count === 0){
            let thead = document.createElement("thead");
            let vals = Object.values(item);
            vals.forEach((elem) => {
               let td = document.createElement("td");
               td.innerText = elem;
               thead.appendChild(td);
            });
            table.appendChild(thead);
            count++;
         }else{
            let tr = document.createElement("tr");
            let vals = Object.values(item);
            vals.forEach((elem) => {
               let td = document.createElement("td");
               td.innerText = elem;
               tr.appendChild(td);
            });
            table.appendChild(tr);
         }


         

      });
      container.appendChild(table)
   } catch { }
}

$(document).ready(function(){
   $('.search').on('keyup',function(){
       var searchTerm = $(this).val().toLowerCase();
       $('#container tr').each(function(){
           var lineStr = $(this).text().toLowerCase();
           if(lineStr.indexOf(searchTerm) === -1){
               $(this).hide();
               searchTable();
           }else{
               $(this).show();
               searchTable();
           }
       });
   });
});


function searchTable() {
   var rows = document.querySelectorAll("#container tr");
   var visibleRowIndex = 0;
   rows.forEach(function(row, index) {
      if (index === 0) return;
      console.log(rows);
      /*
       if (index === 0) return;
       var rowText = row.innerText.toLowerCase();
       if (rowText.includes(input)) {
           if (visibleRowIndex % 2 === 0) {
               row.style.backgroundColor = "#2a2a2a"; 
           } else {
               row.style.backgroundColor = "#1e1e1e"; 
           }
           visibleRowIndex++;
          
       }
            */ 
   });
}