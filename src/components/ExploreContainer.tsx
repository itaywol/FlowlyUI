import React from "react";
import VideoPlayer from "../components/VideoPlayer";
import "./ExploreContainer.css";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    width: 350,
    height: 225,
    sources: [
      {
        src: "http://192.168.1.108:8080/live/123.m3u8",
        type: "application/vnd.apple.mpegurl",
      },
    ],
  };
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>
        Explore{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          UI Components
        </a>
      </p>
      <VideoPlayer {...videoJsOptions} />
    </div>
  );
};

export default ExploreContainer;
