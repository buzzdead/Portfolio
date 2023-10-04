import Layout from "../../components/layout/article";
import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require("../../../public/images/hypertrophy/Exercises.png"),
    title: "Exercises",
  },
  {
    image: require("../../../public/images/hypertrophy/Filter.png"),
    title: "Filter",
  },
  {
    image: require("../../../public/images/hypertrophy/Progress.png"),
    title: "Progress tab",
  },
  {
    image: require("../../../public/images/hypertrophy/ProgressWeekly.png"),
    title: "Weekly progress",
  },
  {
    image: require("../../../public/images/hypertrophy/Settings.png"),
    title: "Settings",
  }
];

const Hypertrophy = () => {
  const project: Project = {
    title: "Hypertrophy",
    year: 2023,
    type: "App",
    link: "https://play.google.com/store/apps/details?id=com.hypertrophy",
    description:
      "Treningsapp med muligheten til å konfigurere egne typer øvelser og kategorier. Legg enkelt til øvelser og følg dem i progresjons-taben.",
    stack: "React Native, TypeScript, Realm, Android Studio",
    platform: "Android",
    images: images,
  };

  return <ProjectPage project={project} smallImages />
};

export default Hypertrophy;
export { getServerSideProps } from '../../components/chakra'