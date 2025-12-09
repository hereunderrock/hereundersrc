import React, {
  useState,
  useEffect,
} from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col,
  Image,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";
import "../css/admin.css";
import { dbUtility } from "./dbUtility";
import Handwrite from "../SamsFont/Handwrite";


export default function AdminPage(data) {
  const[searchParams, ] = useSearchParams();
  const[showAdmin, setShowAdmin] = useState(false);
  const[injectIsLoading, setInjectIsLoading] = useState(false); // used for spinner loader
  const[disableSubmit, setDisableSubmit] = useState(false);
  const[fontValue, setFontValue] = useState("");
  const[submission, setSubmission] = useState({
    title: "",
    footmark: "",
    hourglass: false,
  });
  const[listUpdate, setListUpdate] = useState([]);
  
  
  // on searchParam
  useEffect(() => {
    //console.log(data);
    if(searchParams.get("a") === "sf53541fa5fj468k4687k786d5f4hd58d351" && data.data !== -1){
      setShowAdmin(true);
      
      // masterList from mongo, turn into hash table
      // dont load from masterList, that is only regular cartoons, we need all(including mormon ones)
      dbUtility({
        mode: "getCartoonListAll",
      }).then((masterList) => {
        //console.log(masterList);
        
        // easier search, push masterList into hash table
        let masterListHash = {}
        for(let m = 0; m < masterList.length; m++){
          masterListHash[masterList[m].loc] = true
        };
        //console.log(masterListHash);
        
        // total list from github, .length should be longer if a cartoon was uploaded there
        dbUtility({
          mode: "githubTotalList",
        }).then((githubData) => {
          //console.log(githubData);
          
          // go thru each github item and crosscheck if it has an entry in the mongodb table masterListHash
          let todoArr = [];
          for(let i = 0; i < githubData.length; i++){
            let innerName = githubData[i].name;
            if(masterListHash[innerName] !== true){
              // github item has no key, need to add to mongodb, therefore push to todoArr
              
              //console.log(innerName);
              //console.log(masterListHash[innerName]);
              //setListUpdate([...listUpdate, githubData[i]])
              
              todoArr.push(githubData[i]);
            };
          };
          //console.log(todoArr);
          setListUpdate(todoArr);
        });
      });
    }
  }, [data, searchParams]);
  
  
  // debug::todo list update
  useEffect(() => {
    // list update is the list of cartoons that need injection to mongodb for total list of cartoons to grab random from,
    // as well as retrieve metadata such as likes(funnybones)
    //console.log(listUpdate);
  }, [listUpdate]);
  
  
  // inject button handler
  const submitHandler = () => {
    //console.log(submission);
    
    // set loading spinner and immediately grey out button
    setInjectIsLoading(true);
    setDisableSubmit(true);
    
    // add location to submission, needs to use query instead of body data because mongo is stupid and has 0 documentation for app services
    let ts = submission;
    let tempFirstUpdate = listUpdate;
    ts["loc"] = tempFirstUpdate[0].path;
    let queryStr = "?t=" + ts.title + "&f=" + ts.footmark + "&h=" + ts.hourglass + "&m=" + ts.mormon + "&l=" + ts.loc;
    //console.log(queryStr);
    
    // send to db
    dbUtility({
      mode: "adminUpdate",
      post: queryStr,
    }).then((res) => {
      //console.log(res);
      //setInjectIsLoading(false);
      
      // on done simply reload page
      window.location.reload()
    });
  };
  
  
  // on change handler
  const onChangeHandler = (thisAttr, value) => {
    let tempVal = submission;
    tempVal[thisAttr] = value;
    setSubmission(tempVal);
  };
  
  
  // render
  return (
    <Container>
      {
        (showAdmin) &&
        <Container>
          <Row className="mt-4 mb-3 justify-content-center">
            <Col xs="auto" className="px-5">
              <h4 className="admin-text">ADMIN CENTER</h4>
            </Col>
            <Col xs="auto" className="px-1">
              <h4 className="admin-text">Cartoons to inject: </h4>
            </Col>
            <Col xs="auto" className="px-1">
              <h4 className="admin-text admin-green">{listUpdate.length}</h4>
            </Col>
          </Row>
          
          {
            listUpdate.map((mapItem, index) =>
              <Container key={index} className="admin-todo pt-3 pb-3 mt-2 mb-2">
                <Row>
                  <Col>
                    <h3 className="admin-text">Name of file as uploaded to github: </h3>
                  </Col>
                  <Col>
                    <h3 className="admin-text admin-green">{mapItem.name}</h3>
                  </Col>
                </Row>
                <Image fluid src={mapItem.download_url} />
                <Form>
                  <h5 className="admin-text mt-4">Title of cartoon (what will be shown officially): </h5>
                  <Form.Control type="text" onChange={
                    (e) => onChangeHandler("title", e.target.value)
                  } />
                  
                  <Form.Check className="admin-text mt-4" type="checkbox" onChange={
                    (e) => onChangeHandler("footmark", e.target.checked)
                  } label="Footmark icon?" />
                  
                  <Form.Check className="admin-text mt-4" type="checkbox" onChange={
                    (e) => onChangeHandler("mormon", e.target.checked)
                  } label="Mormon-only cartoon?" />
                  
                  <Form.Check className="admin-text mt-4" type="checkbox" onChange={
                    (e) => onChangeHandler("hourglass", e.target.checked)
                  } label="Hourglass icon?" />
                  
                  <Button disabled={(index === 0 && disableSubmit === false) ? false : true} className="mt-4" onClick={submitHandler}>
                    {
                      (!injectIsLoading) &&
                      <h4 className="admin-text">
                        INJECT
                      </h4>
                    }
                    {
                      (injectIsLoading) &&
                      <Spinner variant="danger" animation="border" role="status" className="admin-spinner" />
                    }
                  </Button>
                  {
                    (index !== 0) &&
                    <p>Button disabled: Please inject cartoons starting from the top</p>
                  }
                </Form>
              </Container>
            )
          }
          
          <Row className="mt-4 mb-3 justify-content-center">
            <Col xs={2}>
              <h4 className="admin-text">FONT TEST:</h4>
            </Col>
            <Col>
              <Form.Control type="text" onChange={
                (e) => setFontValue(e.target.value)
              } placeholder="Type something here to test" />
            </Col>
          </Row>
          <Row>
            <Handwrite data={fontValue} />
          </Row>
          <Row>
            <p className="admin-grey">
              Note: Does a letter look "off"? A lowercase "a" is the baseline letter, so tell me if it needs to move up or down when compared to an "a", or if it takes up too much space.
            </p>
          </Row>
        </Container>
      }
    </Container>
  );
}