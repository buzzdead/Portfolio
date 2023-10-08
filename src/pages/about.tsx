import { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, background, useColorMode } from "@chakra-ui/react";
import Layout from "../components/layout/article";
import { Spinner } from "@chakra-ui/react";


const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const { colorMode } = useColorMode();
  const [fileUrl, setFileUrl] = useState('./Sigmund_CV.pdf')
const { toolbarPluginInstance } = defaultLayoutPluginInstance;
const { zoomPluginInstance } = toolbarPluginInstance;
const { zoomTo, ZoomIn, ZoomOut } = zoomPluginInstance;

useEffect(() => {
  const handleWheel = (e: any) => {
    if (e.ctrlKey && e.srcElement.nodeName !== 'MAIN') {
      e.preventDefault()
      if (e.deltaY > 0) {
        setTimeout(() => zoomTo(scale - 0.1), 50)
        setScale(scale - 0.1)
      } else if (e.deltaY < 0) {
        setTimeout(() => zoomTo(scale + 0.1), 50)
        setScale(scale + 0.1)
      }
    }
  };

  document.addEventListener("wheel", handleWheel, {passive: false});
  
  return () => {
    document.removeEventListener("wheel", handleWheel);
  };
}, [scale]);

useEffect(() => {
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    setScale(0.5); // Set the scale for mobile devices
  } 
  else setScale(1)
}, [])

  const handleLoadSuccess = () => {
    setPdfLoaded(true);
  };

  return (
    <Layout skipEnter title="CV">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Box
          p={2.5}
          w="100%"
          h={{
            base: pdfLoaded ? "auto" : "550px",
            md: pdfLoaded ? "auto" : "900px",
          }}
        >
          <Viewer
            theme={colorMode}
            defaultScale={scale}
            renderLoader={() => <Spinner />}
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
            onDocumentLoad={handleLoadSuccess}
          />
        </Box>
      </Worker>
    </Layout>
  );
};

export default PDFViewer;
export { getServerSideProps } from "../components/chakra";
