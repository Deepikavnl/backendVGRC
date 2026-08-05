import axios from "@/api/axios";



export interface Assessment {


    id:number;


    code:string;


    entityId:number;


    entityName:string;


    templateName:string;


    reviewerName:string;


    status:string;


    progress:number;


    dueDate:string;


    submittedAt?:string;


    completedAt?:string;


    score?:number;


    riskLevel?:string;


    overdue?:boolean;


    createdAt?:string;


    assessmentToken?:string;


    assessmentLink?:string;


    answers?:any[];


}






export interface AssessmentRequest {


    code:string;


    entityId:number;


    templateName:string;


    reviewerName:string;


    status:string;


    progress:number;


    dueDate:string;


}








export interface AssessmentQuestion {


    id:number;


    sectionId:number;


    questionText:string;


    questionType:string;


    mandatory:boolean;


    weight:number;


}



const assessmentApi = {



    getAllAssessments:async():

        Promise<Assessment[]>=>{


        const response =

            await axios.get(
                "/assessments"
            );


        return response.data;


    },









    getAssessmentById:async(

        id:number

    ):Promise<Assessment>=>{


        const response =

            await axios.get(

                `/assessments/${id}`

            );


        return response.data;


    },









    createAssessment:async(

        data:AssessmentRequest

    ):Promise<Assessment>=>{


        const response =

            await axios.post(

                "/assessments",

                data

            );


        return response.data;


    },









    updateAssessment:async(

        id:number,

        data:AssessmentRequest

    ):Promise<Assessment>=>{


        const response =

            await axios.put(

                `/assessments/${id}`,

                data

            );


        return response.data;


    },









    deleteAssessment:async(

        id:number

    ):Promise<void>=>{


        await axios.delete(

            `/assessments/${id}`

        );


    },









    getQuestions:async(

        assessmentId:number

    ):Promise<AssessmentQuestion[]>=>{


        const response =

            await axios.get(

                `/assessments/${assessmentId}/questions`

            );


        return response.data;


    },









    getAssessmentByToken:async(

        token:string

    ):Promise<Assessment>=>{


        const response =

            await axios.get(

                `/assessments/token/${token}`

            );


        return response.data;


    }



};








export default assessmentApi;