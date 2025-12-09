import React, {
  useState,
  useEffect
} from "react";
import { 
  HashRouter as Router, 
  Routes, 
  Route
} from "react-router-dom";
import { 
  Container, 
  Row, 
  Col,
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import { dbUtility } from "./dbUtility";

import Titlebar from "./Titlebar";
import NavPage from "./NavPage";
import CavePage from "./CavePage";
import RandomPage from "./RandomPage";
import FamPage from "./FamPage";
import MostLikedPage from "./MostLikedPage";
import GalleryPage from "./GalleryPage";
import MormonPage from "./MormonPage";
import RecentPage from "./RecentPage";
import AdminPage from "./AdminPage";


export default function App() {
  const[masterList, setMasterList] = useState(-1); // masterList is the global array of strings containing the location on github of all imgs
  
  // run on init
  useEffect(() => {
    // on start get a whole list of possible string id's to get from github
    dbUtility({
      mode: "getCartoonListRegular",
    }).then((list) => {
      // set a sort key starting 0, we are getting
      // weird sorting issues so this will help solve that
      list = list.map((item, index) => ({
        _id: item._id,
        hour: item.hour,
        likes: item.likes,
        loc: item.loc,
        mormon: item.mormon,
        note: item.note,
        title: item.title,
        sortKey: index,
      }));
      
      setMasterList(list)
    });
  }, []);
  
  useEffect(() => {
    // on master list update, 
    //console.log(masterList);
  }, [masterList]);
 
  const pageRoutes = [{
    path: "/",
    element: <CavePage data={masterList} />,
  },{
    path: "/rolldice",
    element: <RandomPage data={masterList} />
  },{
    path: "/familyfavs",
    element: <FamPage data={masterList} />,
  },{
    path: "/funnybones",
    element: <MostLikedPage data={masterList} />,
  },{
    path: "/participationawards",
    element: <GalleryPage data={masterList} />,
  },{
    path: "/askyourmormonfriend",
    element: <MormonPage />,
  },{
    path: "/recent",
    element: <RecentPage data={masterList} />,
  },{
    path: "/34e54febTe13T34709t0hDt54sJLsl134",
    element: <AdminPage />,
  }];
  
  
  return (
    <Container className="mx-0 px-4 mw-100">
      <Router>
        
        <Row>
          <Titlebar />
        </Row>
        
        <Row>
          <Col xs={3} className="mx-0 px-0">
            <NavPage data={masterList} />
          </Col>
          <Col>
            <Row>
              <Routes>
              {
                pageRoutes.map((mapItem, index) =>
                  <Route path={mapItem.path} element={mapItem.element} key={index} />
                )
              }
              </Routes>
            </Row>
          </Col>
        </Row>
        
      </Router>
    </Container>
  );
}
