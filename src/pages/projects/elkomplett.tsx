import ProjectPage, { Project } from "../../components/projectpage";

const images = [
  {
    image: require("../../../public/images/elkomplett/homepage.png"),
    title: "Homepage",
  },
  {
    image: require("../../../public/images/elkomplett/inventory.png"),
    title: "Inventory",
  },
  {
    image: require("../../../public/images/elkomplett/elkomplett-produkt.png"),
    title: "Product",
  },
  {
    image: require("../../../public/images/elkomplett/elkomplett-konfigurer.png"),
    title: "Configurable Product",
  },
  {
    image: require("../../../public/images/elkomplett/elkomplett-preset.png"),
    title: "Presets",
  },
  {
    image: require("../../../public/images/elkomplett/elkomplett-multikeys.png"),
    title: "Multiple keys",
  }
];

const project = () => {
  const project: Project = {
    title: "ElKomplett",
    year: 2023,
    type: "Website",
    description:
      "Nettbutikk med CRUD support. Legg til kategorier, produkter, produsenter og spesifiser produkttyper. Konfigurer produkter med egendefinerte attributter.",
    stack: "React, TypeScript, PostgreSQL, C#",
    platform: "Windows/macOS/Linux/Android",
    link: "asdf",
    images: images,
  };
  return <ProjectPage project={project} />;
};

export default project;
