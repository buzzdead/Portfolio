import ProjectPage, { Project } from "../../components/projectpage";

const images = [
    {
        image: require("../../../public/images/roachranch/banner.webp"),
        title: "Banner",
      },
  {
    image: require("../../../public/images/roachranch/screenshot1.png"),
    title: "Main Menu",
  },
  {
    image: require("../../../public/images/roachranch/screenshot2.png"),
    title: "Preview",
  },
];

const RoachRanch = () => {
  const project: Project = {
    title: "Roach Ranch",
    year: 2025,
    type: "Game",
    link: "https://roachranch.netlify.app",
    description:
      "Overlevelsesspill på web laget i Three JS Fiber",
    stack: "Three.js, Three Fiber, Javascript, ",
    platform: "PC",
    images: images,
  };

  return <ProjectPage project={project} />
};

export default RoachRanch;
export { getServerSideProps } from '../../components/chakra'