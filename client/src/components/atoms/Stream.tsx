import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { Player, useCreateStream } from '@livepeer/react';
import { useMemo, useState } from 'react';

import { Spinner } from './Spinner';
import Loading from './Loading'

  export const Stream = () => {
    const [streamName, setStreamName] = useState<string>('');
    const {
      mutate: createStream,
      data: stream,
      status,
    } = useCreateStream(streamName ? { name: streamName } : null);
  
    const isLoading = useMemo(() => status === 'loading', [status]);

    if (isLoading) return <Loading />;
  
    return (
      <Box css={{ my: '$6' }}>
        <Box
          css={{
            mb: '$3',
            width: '100%',
          }}
        >
          <Textarea
            size="3"
            placeholder="Stream name"
            onChange={(e) => setStreamName(e.target.value)}
          />
        </Box>
  
        {stream &&
          stream.rtmpIngestUrl &&
          (!stream?.playbackUrl || !stream.isActive) && (
            <Text size="3" variant="gray" css={{ mt: '$3', mb: '$4' }}>
              Use the ingest URL <code>{stream.rtmpIngestUrl}</code> in a stream
              client like OBS to see content below.
            </Text>
          )}
  
        {stream?.playbackId && (
          <Box css={{ mt: '$2' }}>
            <Player
              title={stream?.name}
              playbackId={stream?.playbackId}
              autoPlay
              muted
            />
          </Box>
        )}
  
        <Flex css={{ jc: 'flex-end', gap: '$3', mt: '$4' }}>
          {!stream && (
            <Button
              css={{ display: 'flex', ai: 'center' }}
              onClick={() => {
                createStream?.();
              }}
              size="2"
              disabled={isLoading || !createStream}
              variant="primary"
            >
              {isLoading && <Spinner size={16} css={{ mr: '$1' }} />}
              Create Stream
            </Button>
          )}
        </Flex>
      </Box>
    );
  };