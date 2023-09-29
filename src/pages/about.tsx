import { useState } from "react";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Box } from "@chakra-ui/react";
import Layout from "../components/layout/article";
import { Spinner } from '@chakra-ui/react';

const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const handleLoadSuccess = () => {

    setPdfLoaded(true);
  };

  return (
    <Layout skipEnter title="CV">
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      
        <Box p={2.5} w='100%' h={{base: pdfLoaded ? 'auto' : '550px', md: pdfLoaded ? 'auto' : '900px'}}>
          <Viewer
            defaultScale={1}
            renderLoader={() => <Spinner />}
            fileUrl='./Sigmund_CV.pdf'
            plugins={[defaultLayoutPluginInstance]}
            onDocumentLoad={handleLoadSuccess}
          />
        </Box>
    </Worker>
    </Layout>
  );
};

export default PDFViewer;
export { getServerSideProps } from '../components/chakra'