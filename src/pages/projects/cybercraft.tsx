import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require("../../../public/images/cybercraft/picture1.png"),
    title: "City",
  },
  {
    image: require("../../../public/images/cybercraft/picture2.png"),
    title: "Action scene 1",
  },
  {
    image: require("../../../public/images/cybercraft/picture3.png"),
    title: "Action scene 2",
  },
];

const CyberCraft = () => {
  const project: Project = {
    title: "Cybercraft",
    year: 2025,
    type: "Game",
    link: "",
    description:
      "RTS spill utviklet i Unity",
    stack: "Unity, C#",
    platform: "PC",
    images: images,
  };

  return <ProjectPage project={project} />
};

export default CyberCraft;
export { getServerSideProps } from '../../components/chakra'