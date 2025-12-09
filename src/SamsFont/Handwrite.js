import React, {
  useState,
  useEffect
} from "react";
import { 
  Container, 
  Row,
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./font.css";
import "./font_phone.css";
import "./font_very_sm_phone.css";

export default function Handwrite(data) {
  const[textLabel, setTextLabel] = useState([]);
  const[includeBg, setIncludeBg] = useState(true);
  
  // run on init
  useEffect(() => {
    // on text load
    if(data.data !== undefined){
      // split individual chars to array of chars
      
      // debug::differing letters
      //let splitArr = "abcdefghijklmnopqrstuvwxyz".split("");
      //let splitArr = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
      //let splitArr = "\"aThink aso.,\"!?\'".split("");
      //let splitArr = "atwo".split("");
      
      // catch numbers
      let splitArr;
      if(typeof(data.data) == "number"){
        splitArr = data.data.toString()
      }else{
        splitArr = data.data
      };
      splitArr = splitArr.split("");
      
      // only number bool
      let tempBool = 1;
      
      // special lookup table to convert numbers and punctuation, a-z,A-Z are fine
      let quoteOddity = 0; // allows directional quotes
      for(let i = 0; i < splitArr.length; i++){
        // ---------------- punctuation ----------------
        if(splitArr[i] === "."){splitArr[i] = "pdot"}; // e.g. if item is a dot, classname for it is pdot // .
        if(splitArr[i] === "'"){splitArr[i] = "psquo"}; // '
        
        // left and right ""
        if(splitArr[i] === "\"" && quoteOddity % 2 === 0){
          // left quote
          splitArr[i] = "plquo";
          quoteOddity++;
        }else if(splitArr[i] === "\"" && quoteOddity % 2 === 1){
          // right quote
          splitArr[i] = "prquo";
          quoteOddity++;
        };
        
        if(splitArr[i] === ","){splitArr[i] = "pcom"}; // ,
        if(splitArr[i] === " "){splitArr[i] = "pspac"}; // space
        if(splitArr[i] === "!"){splitArr[i] = "pexcl"}; // !
        if(splitArr[i] === "?"){splitArr[i] = "pquest"}; // ?
        if(splitArr[i] === "<"){splitArr[i] = "plpbracket"}; // <
        if(splitArr[i] === ">"){splitArr[i] = "prpbracket"}; // >
        if(splitArr[i] === "*"){splitArr[i] = "bonefont"}; // * turns into bone
        
        // ---------------- numbers ----------------
        for(let n = 0; n < 10; n++){
          if(splitArr[i] === n.toString()){
            // if 0-9
            splitArr[i] = "n" + n.toString(); // e.g. "n4"
          };
        };
        
        
        // ---------------- tall letters ----------------
        
        
        // only numbers bool for bg
        if(typeof(splitArr[i]) != "number"){
          tempBool *= 0;
        };
      };
      //console.log(splitArr);
      setTextLabel(splitArr);
      
      // if the whole thing was numbers, then set bg to false
      if(tempBool){
        setIncludeBg(false);
      }
    };
  }, [data]);
  
  
  return (
    <Container>
      <Row className={"font-container pt-4 px-3 justify-content-center" + includeBg ? " fontbg" : ""}>
        {
          textLabel.map((mapItem, index) =>
            <div key={index} className={"px-0 font " + mapItem} />
          )
        }
      </Row>
    </Container>
  );
}

/*
<Row className="font-container pt-4 px-3 fontbg justify-content-center">
        {
          textLabel.map((mapItem, index) =>
            <div key={index} className={"px-0 font " + mapItem} />
          )
        }
      </Row>
*/