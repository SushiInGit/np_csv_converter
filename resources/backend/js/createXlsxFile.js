 /* Require:
    <script src= "xlsx.full.min.js"></script>

 */
 
 // Function to export JSON data to Excel
        function exportJsonToExcel() {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Convert JSON data to a worksheet
            const worksheet = XLSX.utils.json_to_sheet(jsonData);

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Export the workbook as an Excel file
            XLSX.writeFile(workbook, "data.xlsx");
        }