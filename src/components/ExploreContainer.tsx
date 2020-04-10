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
  id: string;
}

interface ContainerContent {
  title: string;
  url: string;
  Content: React.FC<{ id: string }> | undefined;
}

const HomeContainer: React.FC<{ id: string }> = () => {
  return <div>home</div>;
};

const PerformersContainer: React.FC<WithPerformersProps & { id: string }> = ({
  performers,
}) => {
  const [performersList, setPerformersList] = useState<string[] | undefined>(
    []
  );

  useEffect(() => {
    if (performers.type === "Ready") setPerformersList(performers?.Performers);
  }, [performersList, performers]);
  return (
    <IonList>
      {performersList?.map((performer, index) => {
        return (
          <IonItem key={index} button href={`/Channel/${performer}`}>
            <IonLabel>{performer}</IonLabel>
          </IonItem>
        );
      })}
    </IonList>
  );
};

const ChannelContainer: React.FC<WithUserProps & { id: string }> = ({
  user,
  id,
}) => {
  if (user.type === "Ready" && (id || user?.user?.id)) {
    const videoOptions: videojs.VideoJsPlayerOptions = {
      controls: true,
      autoplay: true,
      fluid: true,
      sources: [
        {
          src: `/live/${
            id && id !== user?.user?.id ? id : user?.user?.id
          }/index.m3u8`,
          type: `application/vnd.apple.mpegurl`,
        },
      ],
    };

    return <VideoPlayer {...videoOptions} />;
  }

  return (
    <>
      <div>You are not logged in</div>
    </>
  );
};

const ExploreContainer: React.FC<ContainerProps> = ({ name, id }) => {
  const containerContents: ContainerContent[] = [
    {
      title: "Home",
      url: "/Home",
      Content: HomeContainer,
    },
    {
      title: "Explore",
      url: "/Explore",
      Content: withPerformers(PerformersContainer),
    },
    {
      title: "Channel",
      url: "/Channel",
      Content: withUser(ChannelContainer),
    },
  ];

  return (
    <div className="container">
      {containerContents
        .filter(({ title }) => title.toLowerCase() === name.toLowerCase())
        .map(({ Content }, index) => {
          if (Content) return <Content key={index} id={id} />;
        })}
    </div>
  );
};

export default ExploreContainer;
