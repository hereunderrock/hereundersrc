import React, {
  useState,
  useEffect,
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


export default function RandomPage(data) {
  const[searchParams, ] = useSearchParams();
  const[cartoonObj, setCartoonObj] = useState(-1);
  const[buildList, setBuildList] = useState([]);
  const buildListLength = 18;
  
  useEffect(() => {
    // check params
    let inputParam = searchParams.get("c") // ?c=<_id>
    
    if(data.data !== -1 && inputParam !== undefined){
      // masterIndex is the global index from masterList, ex. 192
      let masterIndex = data.data.map(e => e._id).indexOf(inputParam);
      
      // location string for db lookup
      setCartoonObj(data.data[masterIndex]);
      
      
      // ------------ build list ----------------
      // now build a random list for the bottom, we only need _id and title
      let tempList = data.data.map(e => {
        return {
          _id: e._id, 
          title: e.title
        };
      });
      
      // delete current index from build list
      tempList.splice(masterIndex, 1);
      
      let tempArr = [];
      for(let i = 0; i < buildListLength; i++){
        let innerIndex = Math.floor(Math.random() * tempList.length);
        tempArr.push(tempList[innerIndex]);
        
        // remove that
        tempList.splice(innerIndex, 1);
      };
      setBuildList(tempArr);
    };
  }, [searchParams, data]);
  
  useEffect(() => {
    //console.log(buildList);
  }, [buildList]);
  
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: "instant"})
  }, [searchParams]);
  
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
        linkString: "/rolldice",
      }} />
    </Container>
  );
}