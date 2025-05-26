// import React from "react";
// import { Row, Col, Container } from "reactstrap";

// const Footer = () => {
//   return (
//     <React.Fragment>
//       <footer className="footer">
//         <Container fluid>
//           <Row>
//             <Col sm={6}>{new Date().getFullYear()} © Eraxon.</Col>
//             <Col sm={6}>
//               {/* <div className="text-sm-end d-none d-sm-block">
//                 Crafted with <i className="mdi mdi-heart text-danger"></i> by
//                 Themesdesign
//               </div> */}
//             </Col>
//           </Row>
//         </Container>
//       </footer>
//     </React.Fragment>
//   );
// };

// export default Footer;

// components/Footer.js

import React from "react";
import { Row, Col, Container } from "reactstrap";
import { useSelector } from "react-redux";

const Footer = () => {
  const settings = useSelector((state) => state.settings || {});
  const { companyName = "Your Company" } = settings;

  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          <Row>
            <Col sm={6}>
              {new Date().getFullYear()} © {companyName}.
            </Col>
            <Col sm={6}>{/* Optional right side content */}</Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
