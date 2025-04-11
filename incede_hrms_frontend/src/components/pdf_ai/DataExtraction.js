import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';

const DataExtraction = ({ extractedData }) => {
  if (!extractedData) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Extracted Drawing Information
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Field</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(extractedData).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {extractedData.dimensions && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Dimensions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Tolerance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extractedData.dimensions.map((dim, index) => (
                  <TableRow key={index}>
                    <TableCell>{dim.type}</TableCell>
                    <TableCell>{dim.value}</TableCell>
                    <TableCell>{dim.unit}</TableCell>
                    <TableCell>{dim.tolerance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {extractedData.annotations && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Annotations
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Content</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extractedData.annotations.map((note, index) => (
                  <TableRow key={index}>
                    <TableCell>{note.type}</TableCell>
                    <TableCell>{note.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default DataExtraction;
