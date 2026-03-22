import LectureMaterial from "../models/LectureMaterial.js";

export const uploadMaterial = async(req,res)=>{

try{

const {title,description,fileUrl,module} = req.body;

const material = await LectureMaterial.create({

title,
description,
fileUrl,
module,
uploadedBy:req.user._id

});

res.status(201).json(material);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};



export const getModuleMaterials = async(req,res)=>{

try{

const materials = await LectureMaterial.find({

module:req.params.moduleId

})
.populate("uploadedBy","name email")
.sort({createdAt:-1});

res.json(materials);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};