import React, {
  useState,
  useEffect,
} from "react";
import { 
  Container, 
  Row, 
  Col,
  Image,
  Spinner,
  Modal
} from "react-bootstrap";
import BoneImg from "../img/bonesm.jpg";
import BoneHoverImg from "../img/boneshake.jpg";
import BoneCheckImg from "../img/bonecross.jpg";
import HourImg from "../img/hour.jpg";
import FootImg from "../img/foot.jpg";
import "../css/rendercartoon.css";
import { dbUtility } from "./dbUtility";
import Handwrite from "../SamsFont/Handwrite";


export default function RenderCartoon(data) {
  /*
  import RenderCartoon from "./RenderCartoon";
  
  const[cartoonObj, setCartoonObj] = useState(-1);
  
  // render with
  <RenderCartoon data={cartoonObj} />
  
  // somewhere in useEffect...
  setCartoonObj(data.data[masterIndex]);
  */
  const[cartoonData, setCartoonData] = useState(); // logo for homepage or placeholder, or random cartoon base64 imgdata
  const[cartoonIsLoading, setCartoonIsLoading] = useState(false); // used for spinner loader
  const[metadata, setMetadata] = useState({});
  const[apiErr, setApiErr] = useState(false);
  const[boneState, setBoneState] = useState(BoneImg);
  const[isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    // on receiving .loc data
    // data.data = {loc: str, _id: str, likes:} etc straight from mongo db
    
    // activate spinner
    setCartoonIsLoading(true);
    //console.log(data.data);
    
    if(data.data !== -1 && data.data !== undefined){
      dbUtility({
        mode: "getOneCartoon",
        loc: data.data.loc,
      }).then((newImg) => {
        //console.log(newImg);
        
        // if this is false, max rate has been achieved
        if(newImg === false){
          setApiErr(true);
        };
        
        // this has to be prepended by the data: base 64 thing so that the data dumps can be
        setCartoonData("data:image/jpeg;base64," + newImg);
        
        // set metadata, still needed for temp funny bone increment local
        setMetadata(data.data);
        
        // unload spinner, it will do a weird comeback and unload load spinner too early here
        //setCartoonIsLoading(false);
        
        // reset bone
        setBoneState(BoneImg);
      });
    }
  }, [data]);
  
  
  useEffect(() => {
    // unloading spinner here is perfect
    setCartoonIsLoading(false);
  }, [cartoonData]);
  
  
  return (
    <Container className="p-0">
      <Modal show={isFullscreen} fullscreen={true} centered onHide={() => {setIsFullscreen(false)}} onClick={() => {setIsFullscreen(false)}}>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Image src={cartoonData} id="modal-render-frame" />
          </Col>
        </Row>
      </Modal>
      
      {
        (cartoonIsLoading) &&
        <Spinner variant="danger" animation="border" role="status" />
      }
      {
        (!cartoonIsLoading) &&
        <Container className="p-0">
          <Row className="justify-content-center" id="img-container">
            <Image src={cartoonData} id="render-frame" onClick={() => {
              // when clicked on, fullscreen it
              setIsFullscreen(true);
              
              // scroll to top (mobile issue)
              //window.scrollTo({top: 0, left: 0, behavior: "instant"})
            }} />
          </Row>
          
          {
            (apiErr) &&
            <Row className="justify-content-around">
              <Col xs={10} className="my-5 red-text">
                A slight error has occurred: We are using a free host to keep costs minimal, and the cartoon rate limit has been exceeded. Try again in an hour. Sorry about that!
              </Col>
            </Row>
          }
          
          {
            (!apiErr) &&
            <Row className="mb-5 pt-2 ml-4 pl-4 align-items-start justify-content-center">
              <Col xs={6}>
                <Row className="justify-content-center mt-1">
                  <Col xs="auto">
                    <Image alt="funnybone counter(likes)" className="note-img" 
                    
                    onMouseEnter={() => {
                      // mouse enter, change to bone hover
                      if(boneState !== BoneCheckImg){ // not already clicked on
                        setBoneState(BoneHoverImg);
                      }
                      
                    }} onMouseLeave={() => {
                      // mouse leave, change back
                      if(boneState !== BoneCheckImg){ // not already clicked on
                        setBoneState(BoneImg);
                      }
                      
                    }} onClick={() => {
                      // on click
                      if(boneState !== BoneCheckImg){ // not already clicked on
                        // virtual +1 on page
                        let tempMD = metadata;
                        tempMD.likes++;
                        setMetadata(tempMD);
                        setBoneState(BoneCheckImg);
                        
                        // increment in db
                        dbUtility({
                          mode:"incrementLike",
                          post: "?c=" + data.data._id,
                        }).then((res) => {
                          //console.log(res);
                        });
                      };
                    }} src={boneState} />
                  </Col>
                  <Col xs="auto" className="mt-2">
                    <h5 className="mb-0 handwrite">
                      <Handwrite data={metadata.likes} />
                    </h5>
                  
                  </Col>
                </Row>
              </Col>
              
              {
                (metadata.hour) &&
                <Col xs={3}>
                  <Image className="note-img" src={HourImg} />
                </Col>
              }
              {
                (metadata.note) &&
                <Col xs={3}>
                  <Image className="note-img" src={FootImg} />
                </Col>
              }
            </Row>
          }
        </Container>
      }
    </Container>
  );
}