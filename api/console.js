const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports={
	name:'console',
	PATCH:(req,res,body)=>{
		response=[]
		for(a of body){
			try{
				response.push(eval(a.toString()));
			}catch(err){
				response.push({erreur:err.stack});
			}
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	},
	HEAD:(req,res,body)=>{
		response=null;
		try{
			response=fs.readdirSync(body.path);
		}catch(err){
			response=err.stack;
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	},
	GET:(req,res,body)=>{
		response=null;
		try{
			response=fs.readFileSync(body.path);
		}catch(err){
			response=err.stack;
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	}
}
