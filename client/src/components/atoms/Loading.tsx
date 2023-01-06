import React from "react";
import { Text, Center, VStack, Flex, Spacer } from "@chakra-ui/react";

const Loading: React.FC = () => (
  <Flex flex="1" flexDirection="row">
    <Spacer />
    <Center>
      <VStack border="2px" px="88px" py="58px">
        <Text>Loading...</Text>
      </VStack>
    </Center>
    <Spacer />
  </Flex>
);

export default Loading;