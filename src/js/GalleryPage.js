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


export default function GalleryPage(data) {
  const[searchParams, ] = useSearchParams();
  const[cartoonObj, setCartoonObj] = useState(-1);
  const[buildList, setBuildList] = useState([]);

  
  useEffect(() => {
    const sortOldest = (inputParam) => {
      // get highest rated by sorting
      let tempData = data.data;
      let oldestSorted = tempData.sort((a, b) => {
        return a.sortKey - b.sortKey;
      });
      
      // we want to roll the array starting at the current person
      let localIndex = oldestSorted.map(e => e._id).indexOf(inputParam);
      let splitArrStart = oldestSorted.slice(0, localIndex);
      let splitArrEnd = oldestSorted.slice(localIndex + 1);
      
      // set the list to the slice starting at current cartoon, moving on through all of them
      setBuildList([...splitArrEnd, ...splitArrStart]);
    };
    
    // check params
    let inputParam = searchParams.get("c") // ?c=<_id>
    
    if(data.data !== -1 && inputParam !== undefined){
      // masterIndex is the global index from masterList, ex. 192
      let masterIndex = data.data.map(e => e._id).indexOf(inputParam);
      
      // location string for db lookup
      setCartoonObj(data.data[masterIndex]);
      
      // sort using the sortKey provided originally by App.js
      sortOldest(inputParam);
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
        linkString: "/participationawards",
      }} />
      
    </Container>
  );
}