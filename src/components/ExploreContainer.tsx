import React, { useState, useEffect } from "react";
import "./ExploreContainer.css";
import VideoPlayer from "./VideoPlayer";
import {
  UserProvider,
  withUser,
  WithUserProps,
} from "../providers/user/userProvider";
import {
  withPerformers,
  WithPerformersProps,
} from "../providers/performers/performersProvider";
import { IonList, IonItem, IonLabel } from "@ionic/react";

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
      Content: () => null,
    },
    {
      title: "Explore",
      url: "/Explore",
      Content: () => null,
    },
    {
      title: "Channel",
      url: "/Channel",
      Content: () => null,
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
