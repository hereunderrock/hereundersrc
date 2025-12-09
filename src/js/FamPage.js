import React, {
  useState,
  useEffect
} from "react";
import { 
  Container, 
  Row, 
  Col,
} from "react-bootstrap";
import {
  useSearchParams,
} from "react-router-dom";
import "../css/home.css";
import RenderCartoon from "./RenderCartoon";
import BuildListPage from "./BuildListPage";


export default function FamPage(data) {
  const[searchParams, ] = useSearchParams();
  const[cartoonObj, setCartoonObj] = useState(-1);
  const[buildList, setBuildList] = useState([]);
  
  useEffect(() => {
    // only list the _id, that way global id doesn't change static pages later on
    const favArr = [{ 
      _id: "6650f478329ff1376b56801b", // author
    },{ 
      _id: "6650fe74c424473841f97aa5", // techie
    },{ 
      _id: "6651076a248bf92b5248de20", // jt
    },{ 
      _id: "6651100cc42447384118c66a", // don
    },{ 
      _id: "66510014c4b36996c04f27fd", // beavita
    },{ 
      _id: "665109cacbefdb417b4b00c3", // nenny poo
    },{ 
      _id: "66510797c4b36996c05efe13", // teemo
    },{ 
      _id: "665100e0d737d4fa6672a55c", // whiskey
    },{ 
      _id: "66510267248bf92b5240a52c", // try becky boy
    },{ 
      _id: "6650fda1248bf92b5239b0b5", // kanna
    },{ 
      _id: "6650f7a3c4b36996c040da8a", // nacho
    },{ 
      _id: "6650fb7f675a4f551e4d6865", // kawoe
    },{ 
      _id: "6650f5c9c424473841ea81f2", // choey
    },{ 
      _id: "6650f542cbefdb417b272cb9", // bulldog
    },{ 
      _id: "6650f4ca675a4f551e436061", // betsy babe
    }];
    
    // check params
    let inputParam = searchParams.get("c") // ?c=<_id>
    
    if(data.data !== -1 && inputParam !== undefined){
      // masterIndex is the global index from masterList, ex. 192
      let masterIndex = data.data.map(e => e._id).indexOf(inputParam);
      
      // location string for db lookup
      setCartoonObj(data.data[masterIndex]);
      
      // loop thru favArr and inject with _id, and title
      let tempArr = [];
      for(let i = 0; i < favArr.length; i++){
        tempArr.push(...data.data.filter(e => e._id === favArr[i]._id));
      };
      
      // tempArr now has an arr of [{ _id:, title:}]
      
      // we want to roll the array starting at the current person
      let localIndex = tempArr.map(e => e._id).indexOf(inputParam);
      let splitArrStart = tempArr.slice(0, localIndex);
      let splitArrEnd = tempArr.slice(localIndex + 1);
      
      // set the list to the slice starting at current cartoon, moving on through all of them
      setBuildList([...splitArrEnd, ...splitArrStart]);
    };
  }, [searchParams, data]);
  
  useEffect(() => {
    //console.log(buildList);
  }, [buildList]);
  
  return (
    <Container>
      <Row>
        <Col>
          <RenderCartoon data={cartoonObj} />
        </Col>
      </Row>
      
      <BuildListPage data={{
        cartoonObj,
        buildList,
        linkString: "/familyfavs",
      }} />
      
    </Container>
  );
}