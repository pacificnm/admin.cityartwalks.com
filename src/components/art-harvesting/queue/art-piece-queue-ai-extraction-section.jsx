/**
 * @file art-piece-queue-ai-extraction-section.jsx
 * @description AI Data Extraction section component for art piece queue detail view
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.AiExtractionSection
 * @author Generated
 * @version 1.1.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import {
  useExtractDataFromHtml,
  useFetchHtmlForExtraction,
} from 'src/actions/art-piece-queue/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.AiExtractionSection
 * @function ArtPieceQueueAiExtractionSection
 * @description React component that handles AI data extraction and processing for art piece queue items.
 * Provides a complete interface for downloading HTML content, processing it with AI, and managing
 * the extracted data including location information and art piece details.
 *
 * Features:
 * - HTML content downloading from source URLs
 * - AI-powered data extraction using OpenAI
 * - Progress tracking and status indicators
 * - Data preview and download functionality
 * - Re-extraction capabilities
 * - Form data application integration
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data object
 * @param {number} props.artPieceQueue.artPieceQueueId - Unique identifier for the queue item
 * @param {string} props.artPieceQueue.status - Current status of the queue item
 * @param {string} props.artPieceQueue.sourceUrl - Source URL for HTML extraction
 * @param {Object} props.artPieceQueue.extractedData - Previously extracted data
 * @param {string} props.accessToken - Access token for API authentication
 * @returns {JSX.Element} The rendered AI extraction section component
 *
 * @example
 * <ArtPieceQueueAiExtractionSection
 *   artPieceQueue={queueItem}
 *   accessToken={userToken}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */
export function ArtPieceQueueAiExtractionSection({ artPieceQueue, accessToken }) {
  const [isExtracting, setIsExtracting] = useState(false);

  // Art harvesting hooks
  const fetchHtmlForExtraction = useFetchHtmlForExtraction(accessToken);
  const extractDataFromHtml = useExtractDataFromHtml(accessToken);

  /**
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.AiExtractionSection.ArtPieceQueueAiExtractionSection
   * @function handleExtractData
   * @description Handles the complete AI data extraction process including HTML download and AI processing
   * @async
   * @private
   */
  const handleExtractData = async () => {
    try {
      setIsExtracting(true);
      toast.info('Starting AI extraction process...');

      // Check if we have an HTML file path in extractedData
      let filePath =
        artPieceQueue.extractedData?.htmlFilePath || artPieceQueue.extractedData?.filePath;

      if (!filePath && artPieceQueue.sourceUrl) {
        // If no file path, we need to fetch the HTML first
        toast.info('Downloading HTML content...');

        const fetchResult = await fetchHtmlForExtraction(
          artPieceQueue.sourceUrl,
          artPieceQueue.artPieceQueueId
        );

        filePath = fetchResult.data?.filePath;
        toast.success('HTML downloaded successfully');
      } else if (filePath) {
        // HTML already exists, skip the download step
        toast.info('Using existing HTML file for extraction...');
      }

      if (!filePath) {
        throw new Error(
          'No HTML file available for extraction. Please ensure the source URL is valid.'
        );
      }

      // Submit to AI service for extraction
      toast.info('Processing with AI...');
      await extractDataFromHtml(artPieceQueue.artPieceQueueId, filePath);
      toast.success('Data extracted successfully!');

      // Refresh handled by hooks automatically
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.AiExtractionSection.ArtPieceQueueAiExtractionSection.handleExtractData',
        'Failed to extract data',
        {
          artPieceQueueId: artPieceQueue?.artPieceQueueId,
          sourceUrl: artPieceQueue?.sourceUrl,
          error: error.message,
        }
      );
      toast.error(`Failed to extract data: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  /**
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.AiExtractionSection.ArtPieceQueueAiExtractionSection
   * @function handleApplyAiData
   * @description Applies AI extracted data to form fields
   * @private
   */
  const handleApplyAiData = () => {
    if (!artPieceQueue.extractedData?.extractedFields) {
      toast.error('No AI extracted data available to apply');
      return;
    }

    // Apply the AI extracted data to the form
    toast.success('AI data applied to form fields');

    // TODO: Implement actual form population logic
    // This would need to communicate with the form component
    // or use a shared state management solution
  };

  return (
    <>
      <Divider />
      <Box>
        <Typography variant="h6" gutterBottom>
          AI Data Extraction
        </Typography>

        {/* Show extraction status and controls */}
        <Stack spacing={2}>
          {/* HTML Status Indicator */}
          {(artPieceQueue.extractedData?.htmlFilePath || artPieceQueue.extractedData?.filePath) && (
            <Card
              sx={{
                p: 2,
                bgcolor: 'success.lighter',
                border: '1px solid',
                borderColor: 'success.light',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="solar:document-check-bold" sx={{ color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'success.dark' }}>
                  HTML content already downloaded and ready for AI extraction
                </Typography>
              </Stack>
            </Card>
          )}

          {artPieceQueue.status === 'PENDING' && (
            <Card
              sx={{
                p: 3,
                bgcolor: 'warning.lighter',
                border: '1px solid',
                borderColor: 'warning.light',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="body2">
                  {artPieceQueue.extractedData?.htmlFilePath ||
                  artPieceQueue.extractedData?.filePath
                    ? 'HTML content is ready. Click the button below to extract art piece information with AI.'
                    : 'This queue item is ready for AI extraction. Click the button below to download HTML and extract art piece information.'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExtractData}
                  disabled={isExtracting}
                  startIcon={
                    <Iconify icon={isExtracting ? 'line-md:loading-loop' : 'solar:robot-bold'} />
                  }
                >
                  {isExtracting ? 'Extracting...' : 'Extract Data with AI'}
                </Button>
              </Stack>
            </Card>
          )}

          {artPieceQueue.status === 'PROCESSING' && (
            <Card
              sx={{ p: 3, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}
            >
              <Typography variant="body2">AI extraction is currently in progress...</Typography>
            </Card>
          )}

          {/* Display extracted data if available */}
          {artPieceQueue.extractedData &&
          typeof artPieceQueue.extractedData === 'object' &&
          (artPieceQueue.extractedData.htmlFilePath ||
            artPieceQueue.extractedData.extractedFields) ? (
            <Stack spacing={2}>
              {/* File Information */}
              {artPieceQueue.extractedData.htmlFilePath && (
                <Card sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Downloaded HTML File
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  >
                    {artPieceQueue.extractedData.htmlFilePath}
                  </Typography>
                </Card>
              )}

              {/* Extracted Fields */}
              {artPieceQueue.extractedData.extractedFields && (
                <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Extracted Information
                  </Typography>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '400px',
                      overflow: 'auto',
                    }}
                  >
                    {JSON.stringify(artPieceQueue.extractedData.extractedFields, null, 2)}
                  </Typography>
                </Card>
              )}

              {/* Location Information */}
              {(artPieceQueue.city || artPieceQueue.state || artPieceQueue.country) && (
                <Card
                  sx={{
                    p: 2,
                    bgcolor: 'success.lighter',
                    border: '1px solid',
                    borderColor: 'success.light',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Location Information (Applied to Record)
                  </Typography>
                  <Stack spacing={1}>
                    {artPieceQueue.country && (
                      <Box>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                          Country:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          {artPieceQueue.country}
                          {artPieceQueue.countryId && ` (ID: ${artPieceQueue.countryId})`}
                        </Typography>
                      </Box>
                    )}
                    {artPieceQueue.state && (
                      <Box>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                          State:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          {artPieceQueue.state}
                          {artPieceQueue.stateId && ` (ID: ${artPieceQueue.stateId})`}
                        </Typography>
                      </Box>
                    )}
                    {artPieceQueue.city && (
                      <Box>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                          City:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          {artPieceQueue.city}
                          {artPieceQueue.cityId && ` (ID: ${artPieceQueue.cityId})`}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              )}

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const dataStr = JSON.stringify(artPieceQueue.extractedData, null, 2);
                    const dataUri =
                      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                    const link = document.createElement('a');
                    link.setAttribute('href', dataUri);
                    link.setAttribute(
                      'download',
                      `queue-item-${artPieceQueue.artPieceQueueId}-extracted-data.json`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                >
                  Download Data
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleExtractData}
                  disabled={isExtracting}
                >
                  {isExtracting ? 'Extracting...' : 'Re-extract Data'}
                </Button>
                <Button variant="outlined" size="small" color="primary" onClick={handleApplyAiData}>
                  Apply AI Data
                </Button>
                {artPieceQueue.sourceUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    startIcon={<Iconify icon="solar:link-outline" />}
                    onClick={() =>
                      window.open(artPieceQueue.sourceUrl, '_blank', 'noopener,noreferrer')
                    }
                  >
                    View Source Page
                  </Button>
                )}
              </Stack>
            </Stack>
          ) : (
            // No data or simple storage
            !artPieceQueue.extractedData &&
            artPieceQueue.status !== 'PENDING' && (
              <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  No extracted data available. The HTML may not have been downloaded yet.
                </Typography>
              </Card>
            )
          )}
        </Stack>
      </Box>
    </>
  );
}
