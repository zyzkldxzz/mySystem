import * as XLSX from "xlsx";


export function export_excel(excelData:any[], fileName: any) {
    const data = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, data, "data");
    XLSX.writeFile(wb, fileName + ".xlsx");
}
export function convert_excel_data(excelData:any[], tHeader:any) {
    const headerKeys = Object.keys(tHeader);
    return excelData.map((item) => {
        const obj: any = {};
        headerKeys.forEach((key) => {
            obj[tHeader[key]] = item[key];
        });
        return obj;
    });
}

