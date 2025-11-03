// 2. Component imports
import { EmptyContent } from 'src/components/empty-content';

/**
 * ImageEmpty component renders a message indicating that an image was not found.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title of the message.
 * @param {string} [props.description] - The description of the message.
 * @returns {JSX.Element} The rendered component.
 */
export function ImageEmpty({ title, description }) {
  return (
    <EmptyContent
      filled
      title={title || 'Image Not Found'}
      description={description || 'The image was not found in the system.'}
      sx={{ py: 10, mb: 5 }}
    />
  );
}
