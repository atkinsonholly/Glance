import React, {useEffect, useState, useMemo} from "react";
import { Text, Box, HStack, Spacer, VStack, Button } from "@chakra-ui/react";
import WagmiConnect from "./WagmiConnect";
import { Stream } from "./Stream";
import { Video } from "./Video";
import { useAccount, useContractReads } from 'wagmi';
import { videoNftAbi } from './videoNftAbi';


const Hero: React.FC = () => {
    const { isConnected, address } = useAccount()
    const [balance, setBalance] = useState<String>("0")
    const [verified, setVerified] = useState<String>("false")
    const [id, setId] = useState<String>("0")
    
    const contract = {
        address: '0x5862CA10ab1b2fcaB51c81cAD88BC08A77b92882',
        abi: videoNftAbi,
      }

    const { data: contractReadData, isLoading: isContractReadsLoading } = useContractReads({
        contracts: [
          {
            ...contract,
            functionName: 'balanceOf',
            args: [address]
          },
          {
            ...contract,
            functionName: 'isVerified',
            args: [address]
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

      useEffect(() => {
        if (contractReadData != undefined) {
            console.log(contractReadData)
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

    //   useEffect(() => {
    //     return () => {
            
    //     }
    // }, [isConnected, address, isLoading]);

    useEffect(() => {
        useContractReads
    }, [isConnected, address, isLoading]);
   
 
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
            <HStack><Text fontFamily="heading" fontSize="28px" >Balance: </Text><Text fontFamily="body" fontSize="28px">{balance}</Text></HStack>
            <HStack><Text fontFamily="heading" fontSize="28px">Token ID: </Text><Text fontFamily="body" fontSize="28px">{id}</Text></HStack>
            <HStack><Text fontFamily="heading" fontSize="28px">Verified Status: </Text><Text fontFamily="body" fontSize="28px">{verified}</Text></HStack>
        </Box>
        <Box height="50px"></Box>
        <Box width="50%" >
            <HStack justify="space-between" px="2">
                <VStack minHeight="600px" justify="flex-start">
                    <Text fontFamily="accent" fontSize="20px" color="blue">Mint your account-bound video token here:</Text>
                    <Video />
                </VStack>
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