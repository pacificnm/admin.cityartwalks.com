/**
 * @namespace CityArtWalks.Components.Path.PathEmpty
 * @version 1.0.0
 * @author jaimie garner
 */
import { EmptyContent } from 'src/components/empty-content';

export function PathEmpty({ title, description }) {
  return (
    <EmptyContent
      filled
      title={title || 'Path Not Found'}
      description={description || 'The path was not found in the system.'}
      sx={{ py: 10, mb: 5 }}
    />
  );
}
