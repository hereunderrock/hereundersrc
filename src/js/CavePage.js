import React, {
  useState,
} from "react";
import { 
  Container, 
  Row, 
  Col,
  Image
} from "react-bootstrap";
import "../css/home.css";
import LogoImg from "../img/logo2.jpg";
import DrawnAbout from "../img/about3.jpg";


export default function CavePage(masterList) {
  const aboutText = "About:\nI have always had an odd sense-of-humor which shows up in these cartoons. They are a glimpse of life from here under my rock. They're quirky, but my technie convinced me that works well on the internet and that they're not doing any good in a box in the closet.\nI'm well aware that I'm no artist, in fact I'm not even a doodler, so I have to find an idea funny enough to bother drawing it up.\nIt's always been interesting to me that different folks find different cartoons to be particularly humorous, so if one tickles your fancy, throw it a bone, a funny bone.\nAlso, I find some funnier than others... I'll leave it an authors footnote. Lastly, some may take a moment to figure out, I'll leave it an hourglass.\nI think there's something here for everyone.\nHave fun\n(signed) Sam";
  
  return (
    <Container className="p-0">
      <Row className="p-0 justify-content-center">
        <Image src={LogoImg} id="logo-frame" alt="Here Under My Rock Logo" />
      </Row>
      
      <Row className="justify-content-center">
        <Image src={DrawnAbout} id="about-frame" alt={aboutText} />
      </Row>
    </Container>
  );
}