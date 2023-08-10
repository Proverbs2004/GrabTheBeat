import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import { React, useState, useEffect, useRef } from 'react';
import './App.css';
import UserVideoComponent from './UserVideoComponent';

const APPLICATION_SERVER_URL = 'https://i9a607.p.ssafy.io:8443/';

const AppOpenVidu = () => {
    const [mySessionId, setMySessionId] = useState('SessionA');
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, []);

    const onBeforeUnload = () => {
        leaveSession();
    };

    const handleChangeSessionId = (e) => {
        setMySessionId(e.target.value);
    };

    const handleChangeUserName = (e) => {
        setMyUserName(e.target.value);
    };

    const handleMainVideoStream = (stream) => {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream);
        }
    };

    const deleteSubscriber = (streamManager) => {
        setSubscribers(prevSubscribers => prevSubscribers.filter(sub => sub !== streamManager));
    };

    const joinSession = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const ov = new OpenVidu();
        console.log("조인세션 되는 중");
        try {
            const mySession = ov.initSession();
    
            mySession.on('streamCreated', (event) => {
                const subscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
            });
    
            mySession.on('streamDestroyed', (event) => {
                deleteSubscriber(event.stream.streamManager);
            });
    
            const sessionId = await createSession(mySessionId);
            const token = await createToken(sessionId);
    
            mySession.connect(token.token, { clientData: myUserName });
    
            const publisher = await ov.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
    
            mySession.publish(publisher);
    
            const devices = await ov.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
            const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);
    
            // 여기서 세션 연결 후 상태 업데이트 및 UI 렌더링을 진행
            setSession(mySession);
            setMainStreamManager(publisher);
            setPublisher(publisher);
        } catch (error) {
            console.log('There was an error:', error);
        }
    };
    

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }

        setSession(undefined);
        setSubscribers([]);
        setMySessionId('SessionA');
        setMyUserName('Participant' + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
    };

    const createSession = async (sessionId) => {
        try {
            const response = await axios.post(
                APPLICATION_SERVER_URL + 'openvidu/api/sessions',
                { customSessionId: sessionId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic T1BFTlZJRFVBUFA6YTYwNw==',
                    }
                }
            );
            return response.data.sessionId;
        } catch (error) {
            if (error.response && error.response.status === 409) {
                return sessionId;
            }
            throw error;
        }
    };

    const createToken = async (sessionId) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'openvidu/api/sessions/' + sessionId + '/connection',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic T1BFTlZJRFVBUFA6YTYwNw==',
                }
            }
        );
        return response.data;
    };

    return (
        <div className="container">
            {session === undefined ? (
                <div id="join">
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <form className=s"form-group" onSubmit={joinSession}>
                            <p>
                                <label>Participant: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={handleChangeUserName}
                                    required
                                />
                            </p>
                            <p>
                                <label> Session: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {session !== undefined ? (
                <div id="session">
                    <div id="session-header">
                        <h1 id="session-title">{mySessionId}</h1>
                        <input
                            className="btn btn-large btn-danger"
                            type="button"
                            id="buttonLeaveSession"
                            onClick={leaveSession}
                            value="Leave session"
                        />
                    </div>

                    {mainStreamManager !== undefined ? (
                        <div id="main-video" className="col-md-6">
                            <UserVideoComponent streamManager={mainStreamManager} />
                        </div>
                    ) : null}

                    <div id="video-container" className="col-md-6">
                        {publisher !== undefined ? (
                            <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                                <UserVideoComponent streamManager={publisher} />
                            </div>
                        ) : null}

                        {subscribers.map((sub, i) => (
                            <div key={sub.id} className="stream-container col-md-6 col-xs-6"
                                onClick={() => handleMainVideoStream(sub)}>
                                <span>{sub.id}</span>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>
                </div>
        ) : null}
    </div>
);
};

export default AppOpenVidu;
