import { Box, Button, Flex, Spacer, Text, Textarea, VStack } from '@chakra-ui/react';
import { useAsset, useUpdateAsset } from '@livepeer/react';
import { useRouter } from 'next/router';

import { useMemo, useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { Spinner } from './Spinner';
import { videoNftAbi } from './videoNftAbi';

export const Video = () => {
  const { address } = useAccount();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assetId, setAssetId] = useState('');

  const {
    data: asset,
    error,
    status: assetStatus,
  } = useAsset({
    assetId,
    enabled: assetId?.length === 36,
    refetchInterval: (asset) =>
      asset?.storage?.status?.phase !== 'ready' ? 5000 : false,
  });
  const { mutate: updateAsset, status: updateStatus } = useUpdateAsset(
    asset
      ? {
          assetId: asset.id,
          storage: {
            ipfs: true,
            metadata: {
              name,
              description,
            },
          },
        }
      : undefined,
  );

  const { config } = usePrepareContractWrite({
    address: '0x5862CA10ab1b2fcaB51c81cAD88BC08A77b92882', // Mumbai 
    abi: videoNftAbi,
    functionName: 'mint',
    args:
      address && asset?.storage?.ipfs?.nftMetadata?.url
        ? [address, asset?.storage?.ipfs?.nftMetadata?.url]
        : undefined,
    enabled: Boolean(address && asset?.storage?.ipfs?.nftMetadata?.url),
  });

  const {
    data: contractWriteData,
    isSuccess,
    isLoading: isContractWriteLoading,
    write,
    error: contractWriteError,
  } = useContractWrite(config);

  const isLoading = useMemo(
    () =>
      assetStatus === 'loading' ||
      updateStatus === 'loading' ||
      (asset && asset?.status?.phase !== 'ready') ||
      (asset?.storage && asset?.storage?.status?.phase !== 'ready') ||
      isContractWriteLoading,
    [asset, assetStatus, updateStatus, isContractWriteLoading],
  );

  return (
   <VStack>
          <Box width="300px">
            <VStack>
            <Text >
              Enter the Livepeer Asset ID below
            </Text>
            <Textarea 
                onChange={(e) => setAssetId(e.target.value)}
                value={assetId} />
            </VStack>

            {asset?.storage?.ipfs?.nftMetadata?.url ? (
              <VStack>
                <Spacer />
                <Text>
                  Metadata IPFS CID
                </Text>
                <Textarea
                  disabled
                  value={asset?.storage?.ipfs?.nftMetadata?.url}
                />
              </VStack>
            ) : (
                <Text color="red">
                  Enter a valid asset ID
                </Text>
            )}

            {error?.message && (
              <Box>
                <Text color="red">{error.message}</Text>
              </Box>
            )}
          </Box>
          <Spacer/>
          <Flex>
            {asset?.status?.phase === 'ready' &&
            asset?.storage?.status?.phase !== 'ready' ? (
              <Button
              color="blue" fontSize="18px" fontFamily="alt" minWidth='260px'
                onClick={() => {
                  updateAsset?.();
                }}
               
                disabled={
                  !updateAsset ||
                  isLoading ||
                  Boolean(asset?.storage?.ipfs?.cid) ||
                  !name ||
                  !description
                }
              >
                {isLoading && <Spinner />}
                Upload to IPFS
              </Button>
            ) : contractWriteData?.hash && isSuccess ? (
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://mumbai.polygonscan.com/tx/${contractWriteData.hash}`}
              >
                <Button
                  color="blue" fontSize="18px" fontFamily="alt" minWidth='260px'
                >
                  View Mint Transaction
                </Button>
              </a>
            ) : contractWriteError ? (
              <Box>
                <Text color="red">{contractWriteError.message}</Text>
              </Box>
            ) : asset?.storage?.status?.phase === 'ready' && write ? (
              <Button
              color="blue" fontSize="18px" fontFamily="alt" width='260px'
                onClick={() => {
                  write();
                }}
                
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                Mint NFT
              </Button>
            ) : (
              <></>
            )}
          </Flex>
    </VStack>
  );
};