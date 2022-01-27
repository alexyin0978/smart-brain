import React from "react";
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl,box}) => {
    return(
        <div className="center ma2">
            <div className="absolute mt2">
                <img src={imageUrl} 
                     alt="" 
                     width="500px"
                     height="auto"
                     id="input_image"
                     />
                <div className="bounding_box"
                     style={{top:box.top_row, left:box.left_col, right: box.right_col, bottom: box.bottom_row}}
                ></div>
            </div>
        </div>
    )
}

export default FaceRecognition;