import React from "react";
import { Text, Box, HStack, } from "@chakra-ui/react";
import WagmiConnect from "./WagmiConnect";
import { Stream } from "./Stream";
import { Video } from "./Video";


const Hero: React.FC = () => {
 
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
        Mint a gated stream NFT
        TODO: mint a Stream NFT
        <Stream />
    </>
  );
};

export default Hero;