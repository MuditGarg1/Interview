import pdf from "pdf-parse";

export const parseResume = async (req,res)=>{

    try{

        if(!req.file){
            return res.status(400).json({
                message:"No File Uploaded"
            });
        }

        if(!req.body?.role){
            return res.status(400).json({
                message:"Interview role is required"
            });
        }

        const buffer = req.file.buffer;

        const data = await pdf(buffer);

        return res.json({

            text:data.text,
            role:req.body.role

        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Resume Parsing Failed"
        });

    }

}
