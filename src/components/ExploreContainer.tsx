import React from "react";
import "./ExploreContainer.css";

interface ContainerProps {
  name: string;
}

interface ContainerContent {
  title: string;
  url: string;
  Content: React.FC | undefined;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const containerContents: ContainerContent[] = [
    {
      title: "Home",
      url: "/Home",
      Content: () => <>Home</>,
    },
    {
      title: "Explore",
      url: "/Explore",
      Content: () => <>Explore</>,
    },
    {
      title: "Channel",
      url: "/Channel",
      Content: () => <>Channel</>,
    },
  ];

  return (
    <div className="container">
      {containerContents
        .filter(({ title }) => title.toLowerCase() === name.toLowerCase())
        .map(({ Content }, index) => {
          if (Content) return <Content key={index} />;
        })}
    </div>
  );
};

export default ExploreContainer;
