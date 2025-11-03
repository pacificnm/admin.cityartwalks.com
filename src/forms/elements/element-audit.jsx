/**
 * @fileoverview Comprehensive audit element component for forms
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Elements
 *
 * @requires {@link module:react} - React library
 * @requires {@link module:@mui/material} - Material-UI components
 * @requires {@link module:src/forms/elements/element-user} - User display element
 * @requires {@link module:src/forms/elements/element-created-at} - Created date element
 * @requires {@link module:src/forms/elements/element-updated-at} - Updated date element
 * @requires {@link module:src/components/error/error-boundary} - Error boundary wrapper
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';

import { Box, Card, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { ElementCreatedAt } from './element-created-at';
import { ElementUpdatedAt } from './element-updated-at';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementAudit
 * @description Comprehensive audit display component that combines all audit-related fields
 * in a consistent, reusable format. Includes record ID, creation/update timestamps, and user information.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title="Audit Information"] - Title for the audit section
 * @param {string} [props.recordIdLabel="Record ID"] - Label for the record ID field
 * @param {string} [props.recordIdField="id"] - Field name for the record ID (e.g., "stateId", "artPieceId")
 * @param {string} [props.recordIdHelperText="System-generated identifier"] - Helper text for record ID
 * @param {boolean} [props.showCard=true] - Whether to wrap in a Card component
 * @param {Object} [props.sx] - Additional Material-UI sx styling props for the container
 * @param {Object} [props.cardSx] - Additional Material-UI sx styling props for the Card (if shown)
 *
 * @returns {JSX.Element} The rendered audit element component
 *
 * @example
 * // Basic usage (only shown in edit mode via conditional rendering)
 * {isEdit && <ElementAudit />}
 *
 * @example
 * // Custom configuration for specific entity
 * {isEdit && (
 *   <ElementAudit
 *     title="State Audit Trail"
 *     recordIdField="stateId"
 *     recordIdLabel="State ID"
 *     recordIdHelperText="Unique identifier for this state record"
 *   />
 * )}
 *
 * @example
 * // Without card wrapper for inline usage
 * {isEdit && (
 *   <ElementAudit
 *     showCard={false}
 *     sx={{ mt: 2 }}
 *   />
 * )}
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementAudit(props) {
  const {
    title = 'Audit Information',
    recordIdLabel = 'Record ID',
    recordIdField = 'id',
    recordIdHelperText = 'System-generated identifier',
    showCard = true,
    sx,
    cardSx,
  } = props;
  const auditContent = (
    <Box sx={sx}>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        {title}
      </Typography>

      {/* Record ID - Full Width */}
      <Field.Text
        name={recordIdField}
        label={recordIdLabel}
        disabled
        helperText={recordIdHelperText}
        sx={{ mb: 3 }}
      />

      {/* User and Date Audit Fields - Two Column Grid */}
      <Box
        sx={{
          rowGap: 3,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <ElementCreatedAt />
        <ElementUpdatedAt />
      </Box>
    </Box>
  );

  if (!showCard) {
    return <ErrorBoundary>{auditContent}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <Card sx={{ p: 3, ...cardSx }}>{auditContent}</Card>
    </ErrorBoundary>
  );
}

ElementAudit.propTypes = {
  title: PropTypes.string,
  recordIdLabel: PropTypes.string,
  recordIdField: PropTypes.string,
  recordIdHelperText: PropTypes.string,
  showCard: PropTypes.bool,
  sx: PropTypes.object,
  cardSx: PropTypes.object,
};
