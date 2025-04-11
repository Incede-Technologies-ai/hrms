import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PdfUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://192.168.1.22:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data);
        setFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Upload Engineering Drawing (PDF)
        </Typography>
        
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          component="label"
        >
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography>
            {file ? file.name : 'Drag and drop a PDF file here or click to browse'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ mt: 2 }}
        >
          {uploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload PDF'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default PdfUpload;
