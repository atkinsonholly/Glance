import { Box, Button, Flex, Text, Textarea, Spacer, VStack } from '@chakra-ui/react';
import { Player, useCreateStream } from '@livepeer/react';
import { useMemo, useState } from 'react';

import { Spinner } from './Spinner';

export const Stream = () => {
    const [streamName, setStreamName] = useState<string>('');
    const {
      mutate: createStream,
      data: stream,
      status,
    } = useCreateStream(streamName ? { name: streamName } : null);
  
    const isLoading = useMemo(() => status === 'loading', [status]);
  
    return (
      <VStack width="300px">
        <Box
        width="300px"
          
        >
            <VStack>
            <Text >
              Enter a stream name below
            </Text>
          <Textarea
            placeholder="Stream name"
            onChange={(e) => setStreamName(e.target.value)}
          />
          </VStack>
        </Box>
  
        {stream &&
          stream.rtmpIngestUrl &&
          (!stream?.playbackUrl || !stream.isActive) && (
            <Text color="gray" fontSize="12px" fontFamily="accent">
              Use the ingest URL <code>{stream.rtmpIngestUrl}</code> in a stream
              client like OBS to see content below.
            </Text>
          )}
  
        {stream?.playbackId && (
          <Box >
            <Player
              title={stream?.name}
              playbackId={stream?.playbackId}
              autoPlay
              muted
            />
          </Box>
        )}
        <Spacer/>
  
        <Flex >
          {!stream && (
            <Button
            color="blue" fontSize="18px" fontFamily="alt" width='260px'
              onClick={() => {
                createStream?.();
              }}
              disabled={isLoading || !createStream}
            >
              {isLoading && <Spinner />}
              Create Stream
            </Button>
          )}
        </Flex>
      </VStack>
    );
  };