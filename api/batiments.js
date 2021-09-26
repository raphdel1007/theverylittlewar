const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'batiments',
	POST:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync("/mnt/users.json"));
		let events=JSON.parse(fs.readFileSync("/mnt/events.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(users[body.username].batiments[body.batiment]!==undefined){
				if(users[body.username].batiment_en_amelioration.indexOf(body.batiment)<0){
					users[body.username].batiment_en_amelioration.push(body.batiment);
					switch(body.batiment){
						case "generateur":
							if(
							users[body.username].ressources.energie>=(10**(users[body.username].batiments.generateur/20)*100)
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(users[body.username].batiments.generateur+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"generateur",
								};
								users[body.username].ressources.energie-=(10**(users[body.username].batiments.generateur/20)*100);
								users[body.username].points.batmients+=1;
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							
							break;
						case "producteur":
							if(
							users[body.username].ressources.carbone>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.oxygene>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.azote>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.iode>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.brome>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.hydrogene>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.soufre>=10**(users[body.username].batiments.producteur/20)*10&&
							users[body.username].ressources.chlore>=10**(users[body.username].batiments.producteur/20)*10
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(users[body.username].batiments.producteur+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"producteur",
								};
								for(a of md.atomes){
									users[body.username].ressources[a]-=10**(users[body.username].batiments.producteur/20)*10;
								}
								users[body.username].points.batmients+=1;
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						case "stockage":
							if(
							users[body.username].ressources.energie>=10**(users[body.username].batiments.stockage/15)*100
							&&users[body.username].ressources.carbone>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.oxygene>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.azote>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.iode>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.brome>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.hydrogene>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.soufre>=10**(users[body.username].batiments.stockage/15)*10
							&&users[body.username].ressources.chlore>=10**(users[body.username].batiments.stockage/15)*10
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(users[body.username].batiments.stockage+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"stockage",
								};
								users[body.username].ressources.energie-=10**(users[body.username].batiments.stockage/15)*100;
								for(a of md.atomes){
									users[body.username].ressources[a]-=10**(users[body.username].batiments.stockage/15)*10;
								}
								users[body.username].points.batmients+=1;
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						case "protecteur":
							if(users[body.username].batiments.protecteur<100){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+Math.sin(Math.PI*(users[body.username].batiments.protecteur+1)/200)*5*(60*60*1000),
									"type":"amelioration",
									"batiment":"protecteur",
								};
								users[body.username].points.batmients+=5;
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(403,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						default:
							if(users[body.username].batiments[body.batiment]<100){
								if(users[body.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]>=(users[body.username].batiments[body.batiment]+1)**3){
									event_amel={
										"username":body.username,
										"time":new Date().getTime()+(Math.sqrt(users[body.username].batiments[body.batiment]+1)*10*(60*1000)),
										"type":"amelioration",
										"batiment":body.batiment,
									};
									users[body.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]-=(users[body.username].batiments[body.batiment]+1)**3;
									users[body.username].points.batmients+=3;
									events.push(event_amel);
									res.writeHead(200,{'Content-Type':'application/json'});
									res.end();
								}else{
									res.writeHead(402,{'Content-Type':'application/json'});
									res.end();
								}
							}else{
								res.writeHead(403,{'Content-Type':'application/json'});
								res.end();
							}
							break;
					}
				}else{
					res.writeHead(409,{'Content-Type':'application/json'});
					res.write("{error:\"batiment already in amelioration\"");
					res.end();
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"no batiment named '"+body.batiment+"'\"");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	},
	PATCH:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync("/mnt/users.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			let check=true;
			for(let a of ["production","pillage","destruction"]){
				if(body[a] instanceof Array){
					if(a=="destruction"){
						if(body[a].length!=3){
							check=false;
						}else{
							let sum=0;
							for(let b=0;b<3;b++){
								sum+=body[a][b]
							}
							if(sum>3*4){
								check=false;
							}
						}
					}else{
						if(body[a].length!=8){
							check=false;
						}else{
							let sum=0;
							for(let b=0;b<8;b++){
								sum+=body[a][b]
							}
							if(sum>8*4){
								check=false;
							}
						}
					}
				}else{
					check=false;
				}
			}
			if(check){
				users[body.username].QG={
					"production":body.production,
					"pillage":body.pillage,
					"destruction":body.destruction
				};
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"Not valid input\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
	}
}
