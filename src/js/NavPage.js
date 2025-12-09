import { 
  Link,
  useLocation,
 } from "react-router-dom";
import React, {
  useState,
  useEffect,
} from "react";
import { 
  Container, 
  Row,
  Col,
  Image,
} from "react-bootstrap";

// static imgs
import DiceImg from "../img/rolldice.jpg";
import CaveImg from "../img/cave2.jpg";
import FamImg from "../img/famfavs2.jpg";
import BoneImg from "../img/bone2.jpg";
import GalleryImg from "../img/gallery2.jpg";
import MormonImg from "../img/mormon2.jpg";
import RecentImg from "../img/recent2.jpg";
import LBracketImg from "../SamsFont/plpbracketsquished.jpg";
import "../css/nav.css";


export default function NavPage(data) {
  const location = useLocation();
  const[queryId, setQueryId] = useState({});
  const[randStr, setRandStr] = useState("");
  const[activeButton, setActiveButton] = useState(0);
  
  // list nav buttons
  const navItems = [{
    src: CaveImg,
    url: "/", // url itself is used for link to routing
    alt: "Link to Home",
    plainUrl: "/", // plainUrl is used for active button purposes
    onclick: () => {},
  },{
    src: FamImg,
    url: "/familyfavs?c=6650f478329ff1376b56801b", // author's fav by default
    alt: "Link to Family Favorites",
    plainUrl: "/familyfavs",
    onclick: () => {},
  },{
    src: BoneImg,
    url: "/funnybones?c=" + queryId.topmostRated,
    alt: "Link to the most Funny Bones Given",
    plainUrl: "/funnybones",
    onclick: () => {},
  },{
    src: DiceImg,
    url: randStr,
    alt: "Link to Random Cartoon",
    plainUrl: "/rolldice",
    onclick: () => {
      newRandom();
    },
  },{
    src: GalleryImg,
    url: "/participationawards?c=" + queryId.oldest,
    alt: "Link to Gallery / Participation Awards",
    plainUrl: "/participationawards",
    onclick: () => {},
  },/*{
    src: RecentImg,
    url: "/recent?c=" + queryId.newest,
    alt: "Link to the most Recent Cartoons",
    plainUrl: "/recent",
    onclick: () => {},
  },*/{
    src: MormonImg,
    url: "/askyourmormonfriend?c=6650f281329ff1376b53ae24", // laman by default
    alt: "Link to Ask Your Mormon Friend",
    plainUrl: "/askyourmormonfriend",
    onclick: () => {},
  }];

  
  useEffect(() => {
    // on location change
    let urlSuffix = location.pathname;
    
    // get index of in navItems
    let thisIndex = navItems.map(e => e.plainUrl).indexOf(urlSuffix);
    //console.log(thisIndex);
    
    setActiveButton(thisIndex);
  }, [location]);
  
  useEffect(() => {
    //console.log(data.data);
    
    if(data.data !== undefined && data.data[0] !== undefined && data.data !== -1){
      // immediately get a single cartoon so we can set links
      let tempObj = { // does not include random since that is a more dynamic link
        topmostRated: "",
        newest: "",
        oldest: "",
      };
      
      // random:
      let indexCartoon;
      indexCartoon = Math.floor(Math.random() * data.data.length);
      setRandStr("/rolldice?c=" + data.data[indexCartoon]._id);
      
      // topmost rated
      let rateSorted = data.data.sort((a, b) => {
        return b.likes - a.likes;
      });
      tempObj.topmostRated = rateSorted[0]._id;
      
      // most recent(according to how it was scanned in)
      let newestSorted = data.data.sort((a, b) => {
        return b.sortKey - a.sortKey;
      });
      tempObj.newest = newestSorted[0]._id;
      
      // oldest
      let oldestSorted = data.data.sort((a, b) => {
        return a.sortKey - b.sortKey;
      });
      tempObj.oldest = oldestSorted[0]._id;
      
      // push to queryid
      setQueryId(tempObj);
    };
  }, [data]);
  
  useEffect(() => {
    //console.log(randStr);
  }, [randStr]);
  
  
  const newRandom = () => {
    // new random cartoon on mouse enter and onclick, since only using onclick gave weird lag issues
    let indexCartoon;
    indexCartoon = Math.floor(Math.random() * data.data.length);
    setRandStr("/rolldice?c=" + data.data[indexCartoon]._id);
  };
  
  return (
    <Container className="" id="navpage-container">
      {
        navItems.map((mapItem, index) =>
          <Row key={index} className="pl-0 pr-0 row-container align-items-center">
            <Col xs={9} className="p-0 m-0 button-container">
              <Link to={mapItem.url}>
                <Image fluid className="" src={mapItem.src} alt={mapItem.alt} onClick={() => {
                  mapItem.onclick();
                  //setNewActiveButton(index);
                }} onMouseEnter={mapItem.onclick} />
              </Link>
            </Col>
            
            <Col xs={3} className="p-0 m-0 nav-arrow-container">
              {
                (activeButton === index) &&
                <Image fluid src={LBracketImg} className="" />
              }
                  
            </Col>
          </Row>
        )
      }
    </Container>
  );
}