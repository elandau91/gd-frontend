import React, { Component } from 'react';
import Sky from 'react-sky';



// you can pass imported images to Sky
// import myImage from "./media/myImage.png"

class Animation extends Component {
  render() {
    return (
      <div>
        
        <Sky
          images={{
            /* FORMAT AS FOLLOWS */
            0: "https://i.redd.it/l108on95e4401.png",
            /* You can pass as many images as you want */
            
          }}
          how={90} /* Pass the number of images Sky will render chosing randomly */
          time={40} /* time of animation */
          size={'50px'} /* size of the rendered images */
          background={'indianred'} /* color of background */
          overflow={"scroll"}

        />
      </div>
    );
  }
}

export default Animation;