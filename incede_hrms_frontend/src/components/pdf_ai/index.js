import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import PdfUpload from './PdfUpload';
import DataExtraction from './DataExtraction';

const PdfAiApp = () => {
  const [extractedData, setExtractedData] = useState(null);

  const handleUploadSuccess = (data) => {
    setExtractedData(data);
  };

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <PdfUpload onUploadSuccess={handleUploadSuccess} />
        <DataExtraction extractedData={extractedData} />
      </Box>
    </Container>
  );
};

export default PdfAiApp;
