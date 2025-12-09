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
import { dbUtility } from "./dbUtility";


export default function MormonPage() {
  const[searchParams, ] = useSearchParams();
  const[cartoonObj, setCartoonObj] = useState(-1);
  const[buildList, setBuildList] = useState([]);
  
  useEffect(() => {
    // mormon page is hard-coded with this order override
    const buildOrder = [{
      _id: "6650f281329ff1376b53ae24", // laman
    },{
      _id: "6650f890c424473841f15be9", // heaven gate
    },{
      _id: "6650e299ce7ad3dad46fedfa", // blessing
    },{
      _id: "66510943cbefdb417b4a3055", // after ammon
    },{
      _id: "6650de5a51c5452a6b2f7cfe", // brother jared
    },{
      _id: "6651108f675a4f551e6b5db4", // tv violence
    },{
      _id: "6650df39ce7ad3dad46a31e2", // little ox
    },{
      _id: "66511039c42447384118f6e4", // 7 cow wife
    },{
      _id: "6651147e135893fe21417b3b", // new ward
    }];
    
    // check params
    let inputParam = searchParams.get("c") // ?c=<_id>
    
    if(inputParam !== undefined){
      // get mormon cartoons
      dbUtility({
        mode: "getCartoonListMormon",
      }).then((mCartoonList) => {
        // masterIndex is the global index from mormon cartoons, e.g. 4
        let masterIndex = mCartoonList.map(e => e._id).indexOf(inputParam);
        
        // location string for db lookup
        setCartoonObj(mCartoonList[masterIndex]);
        
        // rearrange mCartoonList so we slot hardcoded order above
        let tempArr = [];
        for(let i = 0; i < buildOrder.length; i++){
          // local index of each located within mCartoonList so we can push to new
          let reorderIndex = mCartoonList.map(e => e._id).indexOf(buildOrder[i]._id);
          
          // push to temp but also remove that element
          tempArr.push(mCartoonList[reorderIndex]);
          mCartoonList.splice(reorderIndex, 1);
        };
        // console.log(tempArr);
        
        // at this point, anything left in mCartoonList has been added in admin,
        // but not hardcoded, but we ought to list it
        tempArr.push(...mCartoonList);
        //setBuildList(tempArr);
        
        // we want to roll the array starting at the current person
        let localIndex = tempArr.map(e => e._id).indexOf(inputParam);
        let splitArrStart = tempArr.slice(0, localIndex);
        let splitArrEnd = tempArr.slice(localIndex + 1); // + 1 excludes current
        
        // set the list to the slice starting at current cartoon, moving on through all of them
        setBuildList([...splitArrEnd, ...splitArrStart]);
      });
      
    };
  }, [searchParams]);
  
  useEffect(() => {
    //console.log(buildList);
  }, [buildList]);
  
  useEffect(() => {
    //console.log(cartoonObj);
  }, [cartoonObj]);
  
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
        linkString: "/askyourmormonfriend",
      }} />
      
    </Container>
  );
}