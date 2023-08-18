import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

const UserVideoComponent = (props) => {
    const getNicknameTag = () => {
        // Checks if streamManager and its properties are defined before accessing them
        if (props.streamManager && props.streamManager.stream && props.streamManager.stream.connection) {
            return JSON.parse(props.streamManager.stream.connection.data).clientData;
        }
        return 'Unknown'; // Default value if data is not available
    };

    return (
        <div>
            {props.streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponent streamManager={props.streamManager} />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
            ) : null}
        </div>
    );
};

export default UserVideoComponent;
