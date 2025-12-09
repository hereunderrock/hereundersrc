import axios from "axios";
import staticdb from "../staticdb.json";

export function dbUtility(utilityObj){
    /*
    this is a master db connector, so if you are migrating you know where everything is
    --
    there are currently 2 different vendors:
    1. read an image from github repo (create, update, delete requires logging into the github account)
    2. crud stats/index for the likes/funny bones, and mormon comments using mongodb atlas data api and db
    --
    also: fuck mongo db for not having a clear and concise documentation for their app services. is it called app services? atlas? realm?
    whatever the fuck it is, nothing is explained, there are no examples. they sell goddamn 70 different products so not only do I not know
    what the fuck this service is called, youtube, stack, and reddit only give wrong answers. shame on these cornhole lickers. remind me
    never to use mongo for any future endeavors.
    9dec25 EDIT: again fuck mongo for end-of-lifing their api services, now its being migrated, but for now it will have to be static page with built in shit
    this will be in comments under the static update
    --
    modes and structure:
    mongo:
    github:
    (needs updating)
    */
   
    // const mongoUrl = "https://us-west-2.aws.data.mongodb-api.com/app/application-0-xtocj/endpoint";
    const githubUrl = "https://api.github.com/repos/hereunderrock/img/contents"
    // console.log(staticdb);
   
    // check mode that db is being accessed in
    if(utilityObj.mode === "getCartoonListAll"){
        /*
        mongo
        only call this function once at app start for read limits
        this will retrieve a list from mongodb, of strings that the cartoons are stored in, in github repo
        
        return new Promise((resolve, reject) => {
            axios({
                url: mongoUrl + "/get_cartoon_list_all",
                method: "GET",
            }).then((res) => {
                //console.log(res);
                resolve(res.data);
            });
        });
        */
       
        // static update:
        return new Promise((resolve, reject) => {
            resolve(staticdb);
        });
        
        
    }else if(utilityObj.mode === "getCartoonListMormon"){
        /*
        mongo
        
        return new Promise((resolve, reject) => {
            axios({
                url: mongoUrl + "/get_cartoon_list_mormon",
                method: "GET",
            }).then((res) => {
                //console.log(res);
                resolve(res.data);
            });
        });
        */
       
        // static update:
        return new Promise((resolve, reject) => {
            let tempdb = staticdb.filter(e => e.mormon) // filter in mormon true
            resolve(tempdb);
        });
        
    }else if(utilityObj.mode === "getCartoonListRegular"){
        /*
        mongo
        
        return new Promise((resolve, reject) => {
            axios({
                url: mongoUrl + "/get_cartoon_list_regular",
                method: "GET",
            }).then((res) => {
                //console.log(res);
                resolve(res.data);
            });
        });
        */
       
        // static update:
        return new Promise((resolve, reject) => {
            let tempdb = staticdb.filter(e => e.mormon == false) // filter in mormon false
            resolve(staticdb);
        });
        
    }else if(utilityObj.mode === "getOneCartoon"){
        /*
        github
        --
        expects:
        {
            mode: "getOneCartoon",
            loc: "location.jpg", // location within the github account repo "img"
        }
        --
        returns:
        {
            img64: "image data in base 64"
        }
        */
       
        return new Promise((resolve, reject) => {
            // first check the rate limit / ip address
            axios({
                url: "https://api.github.com/rate_limit",
                method: "GET",
            }).then((res) => {
                //console.log(res.data.rate);
                
                if(res.data.rate.remaining > 0){
                    
                    // have remaining, go ahead with call
                    axios({
                        url: githubUrl + "/" + utilityObj.loc,
                        method: "GET",
                    }).then((res) => {
                        // we have the raw github response
                        // .contents is base64 image, .download_url is raw host image, but I'd rather DL the image contents thru base64
                        resolve(res.data.content);
                    });
                    
                }else{
                    // dont have any remaining, err string
                    resolve(false);
                };
                
            });
        });
        
    }else if(utilityObj.mode === "githubTotalList"){
        /*
        total list from github, only for admin update purposes
        --
        expects:
        {
            mode: "githubTotalList",
        }
        --
        returns:
        []
        */
       
        return new Promise((resolve, reject) => {
            axios({
                url: githubUrl,
                method: "GET",
            }).then((res) => {
                // we have the raw github response
                // .contents is base64 image, .download_url is raw host image, but I'd rather DL the image contents thru base64
                resolve(res.data);
            });
        });
        
    }else if(utilityObj.mode === "incrementLike"){
        /*
        mongo
        {
            mode: "incrementLike",
        }
        
        return new Promise((resolve, reject) => {
            //console.log(utilityObj.post);
            axios({
                url: mongoUrl + "/increment_like" + utilityObj.post,
                method: "POST",
            }).then((res) => {
                resolve(res);
            });
        });
        */
       
        // static update:
        return new Promise((resolve, reject) => {
            resolve(true);
        });
        
    }else if(utilityObj.mode === "adminUpdate"){
        /*
        mongo
        
        return new Promise((resolve, reject) => {
            //console.log(utilityObj.post);
            axios({
                url: mongoUrl + "/admin_update" + utilityObj.post,
                method: "POST",
            }).then((res) => {
                resolve(res);
            });
        });
        */
        
    }
}