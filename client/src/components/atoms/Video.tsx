import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { useAsset, useUpdateAsset } from '@livepeer/react';
import { useRouter } from 'next/router';
import { Callout } from 'nextra-theme-docs';

import { useMemo, useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { Spinner } from './Spinner';
import { videoNftAbi } from './videoNftAbi';

export const Video = () => {
  const { address } = useAccount();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

const assetId = "5cd84c43-9ec8-4d20-b2e3-cf142eab1b78";
//   const assetId = useMemo(
//     () => (router?.query?.id ? String(router?.query?.id) : undefined),
//     [router?.query],
//   );

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
    address: '0xA4E1d8FE768d471B048F9d73ff90ED8fcCC03643',
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
   <Box css={{ my: '$2' }}>
          <Box
            css={{
              my: '$3',
              width: '100%',
            }}
          >
            <Text css={{ mb: '$1' }} variant="gray">
              Asset ID
            </Text>
            <Textarea disabled size="3" value={assetId} />

            {asset?.storage?.ipfs?.nftMetadata?.url ? (
              <>
                <Text css={{ my: '$1' }} variant="gray">
                  Metadata IPFS CID
                </Text>
                <Textarea
                  disabled
                  size="3"
                  value={asset?.storage?.ipfs?.nftMetadata?.url}
                />
              </>
            ) : (
              <>
                <Text css={{ my: '$1' }} variant="gray">
                  Name
                </Text>
                <Textarea
                  size="3"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <Text css={{ my: '$1' }} variant="gray">
                  Description
                </Text>
                <Textarea
                  size="3"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </>
            )}

            {error?.message && (
              <Box>
                <Text variant="red">{error.message}</Text>
              </Box>
            )}
          </Box>
          <Flex css={{ jc: 'flex-end', mt: '$4', ai: 'center' }}>
            {asset?.status?.phase === 'ready' &&
            asset?.storage?.status?.phase !== 'ready' ? (
              <Button
                css={{ display: 'flex', ai: 'center' }}
                onClick={() => {
                  updateAsset?.();
                }}
                size="2"
                disabled={
                  !updateAsset ||
                  isLoading ||
                  Boolean(asset?.storage?.ipfs?.cid) ||
                  !name ||
                  !description
                }
                variant="primary"
              >
                {isLoading && <Spinner size={16} css={{ mr: '$1' }} />}
                Upload to IPFS
              </Button>
            ) : contractWriteData?.hash && isSuccess ? (
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://mumbai.polygonscan.com/tx/${contractWriteData.hash}`}
              >
                <Button
                  css={{ display: 'flex', ai: 'center' }}
                  size="2"
                  variant="primary"
                >
                  View Mint Transaction
                </Button>
              </a>
            ) : contractWriteError ? (
              <Box>
                <Text variant="red">{contractWriteError.message}</Text>
              </Box>
            ) : asset?.storage?.status?.phase === 'ready' && write ? (
              <Button
                css={{ display: 'flex', ai: 'center' }}
                onClick={() => {
                  write();
                }}
                size="2"
                disabled={isLoading}
                variant="primary"
              >
                {isLoading && <Spinner size={16} css={{ mr: '$1' }} />}
                Mint NFT
              </Button>
            ) : (
              <></>
            )}
          </Flex>
    </Box>
  );
};