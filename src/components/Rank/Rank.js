import React from "react";

const Rank = ({name,entries}) => {
    return(
        <div className="tc f4">
            <div className="ma3">
             {`${name}, your current rank is ...`}
            </div>
            <div>
             {entries}
            </div>
        </div>
    )
}

export default Rank;