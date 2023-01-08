import React, {useEffect, useState, useMemo, useCallback} from "react";
import { Text, Box, HStack, Spacer, VStack, Button } from "@chakra-ui/react";
import WagmiConnect from "./WagmiConnect";
import { Stream } from "./Stream";
import { Video } from "./Video";
import { useAccount, useContractReads } from 'wagmi';
import { videoNftAbi } from './videoNftAbi';
import {useGlance} from '../../hooks/useGlance';
import { BigNumber } from "ethers";

const Hero: React.FC = () => {
    const { isConnected, address } = useAccount()
    const [balance, setBalance] = useState<String>("0")
    const [verified, setVerified] = useState<String>("false")
    const [id, setId] = useState<String>("0")
    
    const contract = {
        address: '0x288Ca3Cd14604D6DcFe2a7d0cfc371e2fF6Aa1f6',
        abi: videoNftAbi,
      }
    
    let contractReadData: any
    let isContractReadsLoading: any
    
    if (address && address != undefined) {
      const { data, isLoading } = useContractReads({
        contracts: [
          {
            ...contract,
            functionName: 'balanceOf',
            args: [address]
          },
          {
            ...contract,
            functionName: 'isVerified',
            args: [BigNumber.from(id)]
          },
          {
            ...contract,
            functionName: 'ownedId',
            args: [address]
          },
          {
            ...contract,
            functionName: 'owner',
          }
        ],
        watch: true
      })
      contractReadData = data
      isContractReadsLoading = isLoading
    }
   
      useEffect(() => {
        if (contractReadData != undefined) {
            if(contractReadData[0]) setBalance(contractReadData[0].toString())
            if(contractReadData[1]) setVerified(contractReadData[1].toString())
            if(contractReadData[2]) setId(contractReadData[2].toString())
        }
      }, [contractReadData]);

      const isLoading = useMemo(
        () =>
          isContractReadsLoading,
        [isContractReadsLoading],
      );
    
      const {mints, fetchMints } = useGlance()

    useEffect(() => {
      useContractReads
    }, [isConnected, address, isLoading]);

    useEffect(() => {
      fetchMints()
    }, [fetchMints]);
 
  return (
    <>
        <Box bg="yellow" height="900px" width="50%" bgImage="url('/arteum_unsplash.jpeg')" bgPosition="center" bgRepeat="no-repeat" backgroundSize="cover" display='flex' flexDirection="column" alignItems="center" justifyContent="space-between" margin="auto">
            <Text fontFamily="alt" fontSize="28px" color="white" padding="60px">
                Web3 Liveness Tokens
            </Text>
            <Box padding="80px">
                <HStack justify="space-between" px="2">
                    <Box>
                        <WagmiConnect />
                    </Box>
                </HStack>
            </Box>
        </Box>
        <Box height="50px"></Box>
        <Box width="50%" alignContent="flex-start">
          <HStack justify="space-between" px="2">
            <Box>
              <HStack><Text fontFamily="heading" fontSize="28px" >Balance: </Text><Text fontFamily="body" fontSize="28px">{balance}</Text></HStack>
              <HStack><Text fontFamily="heading" fontSize="28px">Token ID: </Text><Text fontFamily="body" fontSize="28px">{id}</Text></HStack>
              <HStack><Text fontFamily="heading" fontSize="28px">Verified Status: </Text><Text fontFamily="body" fontSize="28px">{verified}</Text></HStack>
            </Box>
            <Box>
              <HStack><Text fontFamily="heading" fontSize="28px" >Total Minted: </Text><Text fontFamily="body" fontSize="28px">{mints && mints.length ? mints.length : 0}</Text></HStack>
            </Box>
          </HStack>
        </Box>
        <Box height="50px"></Box>
        <Box width="50%" >
            <HStack justify="space-between" px="2">
                {balance == "0" && <VStack minHeight="600px" justify="flex-start">
                    <Text fontFamily="accent" fontSize="20px" color="blue">Mint your account-bound video token here:</Text>
                    <Video />
                </VStack>}
                <Spacer />
                <VStack minHeight="600px" justify="flex-start">
                    <Text fontFamily="accent" fontSize="20px" color="blue">Start a stream to get (re)verified below:</Text>
                    <Stream />
                </VStack>
            </HStack>
        </Box>
    </>
  );
};

export default Hero;