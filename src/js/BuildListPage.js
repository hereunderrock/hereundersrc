import React, {
  useState,
  useEffect,
} from "react";
import {
  Link,
 } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col,
} from "react-bootstrap";
import "../css/buildlist.css";
import Handwrite from "../SamsFont/Handwrite";


export default function BuildListPage(data) {
  const[buildList, setBuildList] = useState([]);
  const[cartoonObj, setCartoonObj] = useState("");
  const[linkString, setLinkString] = useState("");
  const[likeMode, setLikeMode] = useState(false); // for showing # likes
  const sizes = {
    xs: 12,
    lg: 10
  }
  
  /*
    data.data = {
      cartoonObj,
      buildList,
      linkString, ex. "/recent"
    }
  */
  useEffect(() => {
    setBuildList(data.data.buildList);
    setCartoonObj(data.data.cartoonObj);
    setLinkString(data.data.linkString);
    
    if(data.data.likeMode === true){
      setLikeMode(true);
    };
  }, [data]);
  
  return (
    (cartoonObj.title !== undefined && cartoonObj !== "") &&
    <Container className="build-main-container">
      <Row className="justify-content-center">
        <Col xs="auto">
          <Handwrite data={"> " + cartoonObj.title + " <"} />
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col xs={sizes.xs} lg={sizes.lg} className="buildlist-top"></Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col xs={sizes.xs} lg={sizes.lg} className="buildlist-container buildlist-mid">
          {
            buildList.map((mapItem, index) =>
              <Row key={index} className="justify-content-center mt-2">
                <Col xs="auto" className="link-title-cartoon">
                  <Link to={linkString + "?c=" + mapItem._id}>
                    <Handwrite data={
                      likeMode? mapItem.likes + "* " + mapItem.title : mapItem.title
                    } />
                  </Link>
                </Col>
              </Row>
            )
          }
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col xs={sizes.xs} lg={sizes.lg} className="buildlist-bottom"></Col>
      </Row>
    </Container>
  );
}