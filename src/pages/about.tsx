import { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, useColorMode } from "@chakra-ui/react";
import Layout from "../components/layout/article";
import { Spinner } from "@chakra-ui/react";


const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const { colorMode } = useColorMode();
  const [fileUrl, setFileUrl] = useState('./Sigmund_CV.pdf')

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        setScale(0.5); // Set the scale for mobile devices
      } else {
        setScale(1); // Set the scale for non-mobile devices
      }
    };
    // Initial call
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            plugins={[defaultLayoutPluginInstance]}
            onDocumentLoad={handleLoadSuccess}
          />
        </Box>
      </Worker>
    </Layout>
  );
};

export default PDFViewer;
export { getServerSideProps } from "../components/chakra";
