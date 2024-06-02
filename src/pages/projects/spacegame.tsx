import Layout from "../../components/layout/article";
import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require("../../../public/images/spacegame/login.png"),
    title: "Login Screen",
  },
  {
    image: require("../../../public/images/spacegame/homebase.png"),
    title: "Homebase",
  },
  {
    image: require("../../../public/images/spacegame/enemies.png"),
    title: "Finding enemies",
  },
  {
    image: require("../../../public/images/spacegame/fighting.png"),
    title: "Fighting Enemies",
  },
  {
    image: require("../../../public/images/spacegame/explosion.png"),
    title: "Enemy exploding",
  },
  {
    image: require("../../../public/images/spacegame/portal.png"),
    title: "Portal",
  }
];

const SpaceGame = () => {
  const project: Project = {
    title: "Space game",
    year: 2024,
    type: "App",
    link: "https://spacegame3d.netlify.app",
    description:
      "3D spill i verdensrommet hvor mange kan høste inn mineraler og i fremtiden bygge skip og gå på kampanje.",
    stack: "React, Three Fiber, Netlify, Prisma",
    platform: "PC, Android/IOS",
    images: images,
  };

  return <ProjectPage project={project} />
};

export default SpaceGame;
export { getServerSideProps } from '../../components/chakra'