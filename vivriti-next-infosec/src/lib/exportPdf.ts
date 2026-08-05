import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export function exportToPDF(
    title: string,
    data: any[]
) {

    const doc = new jsPDF();


    doc.setFontSize(16);

    doc.text(
        title,
        20,
        20
    );


    if(data.length > 0){


        autoTable(doc, {

            startY: 30,

            head: [
                Object.keys(data[0])
            ],


            body:
                data.map(
                    (item)=>Object.values(item)
                )

        });


    }
    else{


        doc.text(
            "No data available",
            20,
            40
        );


    }



    doc.save(

        `${title.replace(/\s/g,"_")}.pdf`

    );

}