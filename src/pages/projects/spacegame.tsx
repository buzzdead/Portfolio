import Layout from "../../components/layout/article";
import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require("../../../public/images/spacegame.png"),
    title: "Exercises",
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
    stack: "React, Three Fiber, Three",
    platform: "PC, Android/IOS",
    images: images,
  };

  return <ProjectPage project={project} />
};

export default SpaceGame;
export { getServerSideProps } from '../../components/chakra'