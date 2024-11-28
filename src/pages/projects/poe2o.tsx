import Layout from "../../components/layout/article";
import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require('../../../public/images/poe2o/poe2o-main.png'),
    title: "Main page"
  },
  {
    image: require("../../../public/images/poe2o/poe2o-gems.png"),
    title: "Gems page",
  },
  {
    image: require("../../../public/images/poe2o/poe2o-classes.png"),
    title: "Classes page",
  },
];

const project = () => {
  const project: Project = {
    title: "Poe 2 Overlords",
    year: 2023,
    type: "Website",
    description:
      "Nettside med oversikt over dataspillet med detaljer rundt karakterenes klasser, valg av ferdigheter med muligheten til å lage seg en utgave man følge når man spiller.",
    stack: "NextJS, TypeScript",
    platform: "Windows/macOS/Linux/Android",
    link: "https://poe2o.vercel.app",
    images: images,
  };
  return <ProjectPage project={project} />
};

export default project;
export { getServerSideProps } from '../../components/chakra'